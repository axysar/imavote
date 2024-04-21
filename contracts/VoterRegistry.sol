// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title VoterRegistry - Standalone voter eligibility manager
/// @author AxAy Labs
/// @notice Manages voter whitelisting independently of the voting logic.
contract VoterRegistry is Ownable {
    mapping(address => bool) private _registered;
    address[] private _voterList;

    event VoterAdded(address indexed voter);
    event VoterRemoved(address indexed voter);

    constructor() Ownable(msg.sender) {}

    function addVoter(address _voter) external onlyOwner {
        require(!_registered[_voter], "VoterRegistry: already registered");
        _registered[_voter] = true;
        _voterList.push(_voter);
        emit VoterAdded(_voter);
    }

    function removeVoter(address _voter) external onlyOwner {
        require(_registered[_voter], "VoterRegistry: not registered");
        _registered[_voter] = false;
        emit VoterRemoved(_voter);
    }

    function isRegistered(address _voter) external view returns (bool) {
        return _registered[_voter];
    }

    function getVoterCount() external view returns (uint256) {
        return _voterList.length;
    }

    function getVoterAt(uint256 _index) external view returns (address) {
        require(_index < _voterList.length, "VoterRegistry: out of bounds");
        return _voterList[_index];
    }
}
