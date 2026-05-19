// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// @title VotingStrategies - Pluggable vote weight calculation
/// @author AxAy Labs
/// @notice Provides different voting weight strategies that VotingCore can
///         reference. Each strategy takes a voter address and returns a
///         weight multiplier. Strategies are stateless pure/view functions.
/// @dev This contract is a library of strategies, not a standalone system.
///      VotingCore reads from it to determine how much each vote counts.
///      Adding new strategies requires deploying a new version.
contract VotingStrategies {

    /// @notice One-person-one-vote. Every registered voter gets weight 1.
    /// @return weight Always returns 1.
    function equalWeight(address) external pure returns (uint256 weight) {
        return 1;
    }

    /// @notice Returns a constant weight. Useful for testing.
    /// @param _weight The fixed weight to return.
    /// @return The provided weight value.
    function fixedWeight(address, uint256 _weight) external pure returns (uint256) {
        return _weight;
    }

    /// @notice Quadratic weight: returns sqrt(rawWeight).
    /// @dev Uses integer square root (Babylonian method).
    ///      Caller supplies the raw weight (e.g., token balance).
    ///      Sybil resistance is NOT enforced here — it must be handled
    ///      at the identity layer (Gitcoin Passport, Worldcoin, etc.).
    /// @param _rawWeight The raw voting power (e.g., token balance).
    /// @return The integer square root of _rawWeight.
    function quadraticWeight(uint256 _rawWeight) external pure returns (uint256) {
        return _sqrt(_rawWeight);
    }

    /// @notice Capped weight: returns min(rawWeight, cap).
    /// @param _rawWeight The raw voting power.
    /// @param _cap Maximum allowed weight per voter.
    /// @return The capped weight.
    function cappedWeight(uint256 _rawWeight, uint256 _cap) external pure returns (uint256) {
        return _rawWeight < _cap ? _rawWeight : _cap;
    }

    /// @dev Babylonian integer square root.
    function _sqrt(uint256 x) internal pure returns (uint256 y) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
