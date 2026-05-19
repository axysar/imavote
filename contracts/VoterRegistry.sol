// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title VoterRegistry - Standalone voter eligibility manager
/// @author AxAy Labs
/// @notice Manages voter whitelisting independently of the voting logic.
///         Can be shared across multiple voting contracts.
contract VoterRegistry is Ownable {
    mapping(address => bool) private _registered;
    address[] private _voterList;

    event VoterAdded(address indexed voter);
    event VoterRemoved(address indexed voter);

    error AlreadyRegistered(address voter);
    error NotRegistered(address voter);
    error ZeroAddress();
    error OutOfBounds(uint256 index, uint256 length);

    constructor() Ownable(msg.sender) {}

    /// @notice Register a new voter address.
    /// @param _voter The wallet address to whitelist.
    function addVoter(address _voter) external onlyOwner {
        if (_voter == address(0)) revert ZeroAddress();
        if (_registered[_voter]) revert AlreadyRegistered(_voter);
        _registered[_voter] = true;
        _voterList.push(_voter);
        emit VoterAdded(_voter);
    }

    /// @notice Remove a voter from the whitelist.
    /// @param _voter The wallet address to remove.
    function removeVoter(address _voter) external onlyOwner {
        if (_voter == address(0)) revert ZeroAddress();
        if (!_registered[_voter]) revert NotRegistered(_voter);
        _registered[_voter] = false;
        emit VoterRemoved(_voter);
    }

    /// @notice Check if an address is registered.
    /// @param _voter The address to check.
    /// @return True if the voter is registered.
    function isRegistered(address _voter) external view returns (bool) {
        return _registered[_voter];
    }

    /// @notice Get the total number of voters ever added.
    /// @return The length of the voter list.
    function getVoterCount() external view returns (uint256) {
        return _voterList.length;
    }

    /// @notice Access a voter by index in the list.
    /// @param _index The zero-based index.
    /// @return The voter address at that index.
    function getVoterAt(uint256 _index) external view returns (address) {
        if (_index >= _voterList.length) revert OutOfBounds(_index, _voterList.length);
        return _voterList[_index];
    }
}
