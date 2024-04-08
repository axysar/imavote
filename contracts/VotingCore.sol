// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title VotingCore - Enterprise Voting Engine
/// @author AxAy Labs
/// @notice Manages proposals, vote casting, and tallying with role-based access control.
/// @dev Uses OpenZeppelin primitives for battle-tested security patterns.
contract VotingCore is AccessControl, Pausable, ReentrancyGuard {

    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    enum ProposalState { Pending, Active, Closed }

    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 abstainVotes;
        ProposalState state;
        uint256 createdAt;
        uint256 closedAt;
    }

    struct Voter {
        bool isRegistered;
        mapping(uint256 => bool) hasVotedOn;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    mapping(address => Voter) private voters;
    uint256 public totalRegisteredVoters;

    event ProposalCreated(uint256 indexed id, string title);
    event ProposalActivated(uint256 indexed id);
    event ProposalClosed(uint256 indexed id, uint256 yesVotes, uint256 noVotes);
    event VoterRegistered(address indexed voter);
    event VoterDeregistered(address indexed voter);
    event VoteCast(address indexed voter, uint256 indexed proposalId, uint8 selection);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REGISTRAR_ROLE, msg.sender);
    }

    // ──────────────── Voter Management ────────────────

    /// @notice Register a wallet address as an eligible voter
    function registerVoter(address _voter) external onlyRole(REGISTRAR_ROLE) {
        require(!voters[_voter].isRegistered, "VotingCore: already registered");
        voters[_voter].isRegistered = true;
        totalRegisteredVoters++;
        emit VoterRegistered(_voter);
    }

    /// @notice Remove a voter's eligibility
    function deregisterVoter(address _voter) external onlyRole(REGISTRAR_ROLE) {
        require(voters[_voter].isRegistered, "VotingCore: not registered");
        voters[_voter].isRegistered = false;
        totalRegisteredVoters--;
        emit VoterDeregistered(_voter);
    }

    function isVoterRegistered(address _voter) external view returns (bool) {
        return voters[_voter].isRegistered;
    }

    // ──────────────── Proposal Lifecycle ────────────────

    /// @notice Create a new proposal (admin only)
    function createProposal(
        string calldata _title,
        string calldata _description
    ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256) {
        proposalCount++;
        Proposal storage p = proposals[proposalCount];
        p.id = proposalCount;
        p.title = _title;
        p.description = _description;
        p.state = ProposalState.Pending;
        p.createdAt = block.timestamp;
        emit ProposalCreated(proposalCount, _title);
        return proposalCount;
    }

    /// @notice Activate a pending proposal to accept votes
    function activateProposal(uint256 _id) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Proposal storage p = proposals[_id];
        require(p.state == ProposalState.Pending, "VotingCore: not pending");
        p.state = ProposalState.Active;
        emit ProposalActivated(_id);
    }

    /// @notice Close an active proposal and finalize results
    function closeProposal(uint256 _id) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Proposal storage p = proposals[_id];
        require(p.state == ProposalState.Active, "VotingCore: not active");
        p.state = ProposalState.Closed;
        p.closedAt = block.timestamp;
        emit ProposalClosed(_id, p.yesVotes, p.noVotes);
    }

    // ──────────────── Voting ────────────────

    /// @notice Cast a vote on an active proposal
    /// @param _proposalId The proposal to vote on
    /// @param _selection 0 = Yes, 1 = No, 2 = Abstain
    function castVote(
        uint256 _proposalId,
        uint8 _selection
    ) external whenNotPaused nonReentrant {
        require(voters[msg.sender].isRegistered, "VotingCore: not registered");
        require(!voters[msg.sender].hasVotedOn[_proposalId], "VotingCore: already voted");
        require(_selection <= 2, "VotingCore: invalid selection");

        Proposal storage p = proposals[_proposalId];
        require(p.state == ProposalState.Active, "VotingCore: proposal not active");

        voters[msg.sender].hasVotedOn[_proposalId] = true;

        if (_selection == 0) p.yesVotes++;
        else if (_selection == 1) p.noVotes++;
        else p.abstainVotes++;

        emit VoteCast(msg.sender, _proposalId, _selection);
    }

    // ──────────────── Emergency Controls ────────────────
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }
}
