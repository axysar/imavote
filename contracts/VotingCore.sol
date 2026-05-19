// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title VotingCore - Enterprise Voting Engine v2.0
/// @author AxAy Labs
/// @notice Role-based, pausable, reentrancy-safe voting engine with a
///         proposal state machine and optional voting deadlines.
/// @dev Uses custom errors (cheaper than revert strings), batch operations
///      for gas-friendly bulk registration and a paginated read helper for
///      frontends.
contract VotingCore is AccessControl, Pausable, ReentrancyGuard {
    // ---------------------------------------------------------------------
    // Roles
    // ---------------------------------------------------------------------

    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    // ---------------------------------------------------------------------
    // Types
    // ---------------------------------------------------------------------

    enum ProposalState {
        Pending,
        Active,
        Closed
    }

    enum VoteOption {
        Yes,
        No,
        Abstain
    }

    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 abstainVotes;
        ProposalState state;
        uint256 createdAt;
        uint256 activatedAt;
        uint256 closedAt;
        uint256 deadline; // 0 = no deadline
    }

    struct Voter {
        bool isRegistered;
        mapping(uint256 => bool) hasVotedOn;
    }

    // Lightweight struct returned by `getProposals` for indexing / UI.
    struct ProposalView {
        uint256 id;
        string title;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 abstainVotes;
        uint8 state;
        uint256 createdAt;
        uint256 activatedAt;
        uint256 closedAt;
        uint256 deadline;
    }

    // ---------------------------------------------------------------------
    // Storage
    // ---------------------------------------------------------------------

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    mapping(address => Voter) private voters;
    uint256 public totalRegisteredVoters;

    // Gas optimization: track total votes per proposal to avoid recomputation.
    mapping(uint256 => uint256) public totalVotesOnProposal;

    // ---------------------------------------------------------------------
    // Custom Errors
    // ---------------------------------------------------------------------

    error AlreadyRegistered(address voter);
    error NotRegistered(address voter);
    error AlreadyVoted(address voter, uint256 proposalId);
    error InvalidSelection(uint8 selection);
    error InvalidProposalId(uint256 proposalId);
    error WrongState(uint256 proposalId, ProposalState expected, ProposalState actual);
    error DeadlinePassed(uint256 proposalId, uint256 deadline);
    error DeadlineInPast(uint256 deadline);
    error EmptyTitle();
    error ZeroAddress();

    // ---------------------------------------------------------------------
    // Events
    // ---------------------------------------------------------------------

    event ProposalCreated(uint256 indexed id, string title, address indexed creator, uint256 deadline);
    event ProposalActivated(uint256 indexed id, uint256 activatedAt);
    event ProposalClosed(
        uint256 indexed id,
        uint256 yesVotes,
        uint256 noVotes,
        uint256 abstainVotes
    );
    event VoterRegistered(address indexed voter);
    event VoterDeregistered(address indexed voter);
    event VoteCast(address indexed voter, uint256 indexed proposalId, VoteOption selection);

    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REGISTRAR_ROLE, msg.sender);
    }

    // ---------------------------------------------------------------------
    // Voter registration
    // ---------------------------------------------------------------------

    function registerVoter(address _voter) external onlyRole(REGISTRAR_ROLE) {
        _registerVoter(_voter);
    }

    /// @notice Batch register multiple voters in a single transaction.
    /// @dev Silently skips addresses already registered to remain idempotent.
    function batchRegisterVoters(address[] calldata _voters) external onlyRole(REGISTRAR_ROLE) {
        uint256 len = _voters.length;
        for (uint256 i; i < len; ++i) {
            if (!voters[_voters[i]].isRegistered) {
                _registerVoter(_voters[i]);
            }
        }
    }

    function deregisterVoter(address _voter) external onlyRole(REGISTRAR_ROLE) {
        if (!voters[_voter].isRegistered) revert NotRegistered(_voter);
        voters[_voter].isRegistered = false;
        unchecked {
            totalRegisteredVoters--;
        }
        emit VoterDeregistered(_voter);
    }

    function isVoterRegistered(address _voter) external view returns (bool) {
        return voters[_voter].isRegistered;
    }

    function hasVoted(address _voter, uint256 _proposalId) external view returns (bool) {
        return voters[_voter].hasVotedOn[_proposalId];
    }

    function _registerVoter(address _voter) internal {
        if (_voter == address(0)) revert ZeroAddress();
        if (voters[_voter].isRegistered) revert AlreadyRegistered(_voter);
        voters[_voter].isRegistered = true;
        unchecked {
            totalRegisteredVoters++;
        }
        emit VoterRegistered(_voter);
    }

    // ---------------------------------------------------------------------
    // Proposal lifecycle
    // ---------------------------------------------------------------------

    /// @notice Create a new proposal with an optional voting deadline.
    /// @param _title Short human-readable title. Must be non-empty.
    /// @param _description Longer proposal body.
    /// @param _deadline Unix timestamp after which votes are rejected.
    ///                  Pass 0 for "no deadline".
    function createProposal(
        string calldata _title,
        string calldata _description,
        uint256 _deadline
    ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256) {
        if (bytes(_title).length == 0) revert EmptyTitle();
        if (_deadline != 0 && _deadline <= block.timestamp) revert DeadlineInPast(_deadline);

        unchecked {
            proposalCount++;
        }
        uint256 newId = proposalCount;

        Proposal storage p = proposals[newId];
        p.id = newId;
        p.title = _title;
        p.description = _description;
        p.state = ProposalState.Pending;
        p.createdAt = block.timestamp;
        p.deadline = _deadline;

        emit ProposalCreated(newId, _title, msg.sender, _deadline);
        return newId;
    }

    function activateProposal(uint256 _id) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Proposal storage p = proposals[_id];
        if (p.id == 0) revert InvalidProposalId(_id);
        if (p.state != ProposalState.Pending) {
            revert WrongState(_id, ProposalState.Pending, p.state);
        }
        p.state = ProposalState.Active;
        p.activatedAt = block.timestamp;
        emit ProposalActivated(_id, block.timestamp);
    }

    function closeProposal(uint256 _id) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Proposal storage p = proposals[_id];
        if (p.id == 0) revert InvalidProposalId(_id);
        if (p.state != ProposalState.Active) {
            revert WrongState(_id, ProposalState.Active, p.state);
        }
        p.state = ProposalState.Closed;
        p.closedAt = block.timestamp;
        emit ProposalClosed(_id, p.yesVotes, p.noVotes, p.abstainVotes);
    }

    // ---------------------------------------------------------------------
    // Vote casting
    // ---------------------------------------------------------------------

    function castVote(uint256 _proposalId, uint8 _selection)
        external
        whenNotPaused
        nonReentrant
    {
        if (_selection > uint8(VoteOption.Abstain)) revert InvalidSelection(_selection);
        if (!voters[msg.sender].isRegistered) revert NotRegistered(msg.sender);

        Proposal storage p = proposals[_proposalId];
        if (p.id == 0) revert InvalidProposalId(_proposalId);
        if (p.state != ProposalState.Active) {
            revert WrongState(_proposalId, ProposalState.Active, p.state);
        }
        if (p.deadline != 0 && block.timestamp > p.deadline) {
            revert DeadlinePassed(_proposalId, p.deadline);
        }
        if (voters[msg.sender].hasVotedOn[_proposalId]) {
            revert AlreadyVoted(msg.sender, _proposalId);
        }

        voters[msg.sender].hasVotedOn[_proposalId] = true;
        unchecked {
            totalVotesOnProposal[_proposalId]++;
        }

        VoteOption choice = VoteOption(_selection);
        if (choice == VoteOption.Yes) {
            unchecked { p.yesVotes++; }
        } else if (choice == VoteOption.No) {
            unchecked { p.noVotes++; }
        } else {
            unchecked { p.abstainVotes++; }
        }

        emit VoteCast(msg.sender, _proposalId, choice);
    }

    // ---------------------------------------------------------------------
    // Views
    // ---------------------------------------------------------------------

    /// @notice Paginated read helper returning a slice of proposals.
    /// @param _offset 1-indexed start id (pass 1 to start at proposal #1).
    /// @param _limit Max number of proposals to return.
    function getProposals(uint256 _offset, uint256 _limit)
        external
        view
        returns (ProposalView[] memory result)
    {
        if (_offset == 0) _offset = 1;
        uint256 total = proposalCount;
        if (_offset > total) return new ProposalView[](0);

        uint256 end = _offset + _limit - 1;
        if (end > total) end = total;
        uint256 size = end - _offset + 1;

        result = new ProposalView[](size);
        for (uint256 i; i < size; ++i) {
            Proposal storage p = proposals[_offset + i];
            result[i] = ProposalView({
                id: p.id,
                title: p.title,
                description: p.description,
                yesVotes: p.yesVotes,
                noVotes: p.noVotes,
                abstainVotes: p.abstainVotes,
                state: uint8(p.state),
                createdAt: p.createdAt,
                activatedAt: p.activatedAt,
                closedAt: p.closedAt,
                deadline: p.deadline
            });
        }
    }

    /// @notice Returns the participation rate in basis points (0-10000).
    function getParticipationRate(uint256 _proposalId) external view returns (uint256) {
        if (totalRegisteredVoters == 0) return 0;
        return (totalVotesOnProposal[_proposalId] * 10_000) / totalRegisteredVoters;
    }

    // ---------------------------------------------------------------------
    // Emergency controls
    // ---------------------------------------------------------------------

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
