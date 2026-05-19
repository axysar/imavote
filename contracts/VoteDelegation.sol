// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title VoteDelegation - On-chain vote delegation registry
/// @author AxAy Labs
/// @notice Allows registered voters to delegate their voting power to a
///         trusted representative. Delegates accumulate weight that the
///         frontend can read when rendering vote tallies and profiles.
/// @dev Delegation is 1:1 (a delegator can only delegate to one delegate at
///      a time). Self-delegation is treated as "no delegation." The contract
///      is intentionally independent of VotingCore so it can be composed
///      across multiple voting contracts.
contract VoteDelegation is Ownable {

    // -------------------------------------------------------------------- //
    // Storage                                                                //
    // -------------------------------------------------------------------- //

    /// @notice delegator → delegate
    mapping(address => address) public delegations;

    /// @notice delegate → number of addresses currently delegating to them
    mapping(address => uint256) public delegatedWeight;

    /// @notice delegate → profile metadata URI (IPFS or HTTP)
    mapping(address => string) public delegateProfiles;

    // -------------------------------------------------------------------- //
    // Events                                                                 //
    // -------------------------------------------------------------------- //

    event DelegateSet(address indexed delegator, address indexed delegate);
    event DelegateRemoved(address indexed delegator, address indexed previousDelegate);
    event DelegateProfileUpdated(address indexed delegate, string profileURI);

    // -------------------------------------------------------------------- //
    // Errors                                                                 //
    // -------------------------------------------------------------------- //

    error CannotDelegateToSelf();
    error NoDelegationSet();
    error AlreadyDelegatedTo(address current);
    error ZeroAddress();

    // -------------------------------------------------------------------- //
    // Constructor                                                            //
    // -------------------------------------------------------------------- //

    constructor() Ownable(msg.sender) {}

    // -------------------------------------------------------------------- //
    // Delegation                                                             //
    // -------------------------------------------------------------------- //

    /// @notice Delegate your voting power to `_delegate`.
    /// @param _delegate The address of the delegate. Cannot be zero or self.
    function setDelegate(address _delegate) external {
        if (_delegate == address(0)) revert ZeroAddress();
        if (_delegate == msg.sender) revert CannotDelegateToSelf();
        address current = delegations[msg.sender];
        if (current == _delegate) revert AlreadyDelegatedTo(_delegate);

        if (current != address(0)) {
            unchecked { delegatedWeight[current]--; }
        }

        delegations[msg.sender] = _delegate;
        unchecked { delegatedWeight[_delegate]++; }

        emit DelegateSet(msg.sender, _delegate);
    }

    /// @notice Remove your current delegation and vote independently.
    function removeDelegate() external {
        address current = delegations[msg.sender];
        if (current == address(0)) revert NoDelegationSet();

        unchecked { delegatedWeight[current]--; }
        delete delegations[msg.sender];

        emit DelegateRemoved(msg.sender, current);
    }

    /// @notice Query who `_delegator` has delegated to.
    /// @param _delegator The address to look up.
    /// @return The delegate address, or address(0) if none.
    function getDelegate(address _delegator) external view returns (address) {
        return delegations[_delegator];
    }

    /// @notice Query total delegated weight of `_delegate`.
    /// @param _delegate The address to look up.
    /// @return The number of addresses that have delegated to `_delegate`.
    function getWeight(address _delegate) external view returns (uint256) {
        return delegatedWeight[_delegate];
    }

    // -------------------------------------------------------------------- //
    // Delegate profiles                                                      //
    // -------------------------------------------------------------------- //

    /// @notice Set or update a profile URI for yourself as a delegate.
    /// @param _profileURI IPFS hash or URL containing delegate statement.
    function setProfile(string calldata _profileURI) external {
        delegateProfiles[msg.sender] = _profileURI;
        emit DelegateProfileUpdated(msg.sender, _profileURI);
    }

    /// @notice Read a delegate's profile URI.
    /// @param _delegate The delegate address.
    /// @return The profile URI string.
    function getProfile(address _delegate) external view returns (string memory) {
        return delegateProfiles[_delegate];
    }
}
