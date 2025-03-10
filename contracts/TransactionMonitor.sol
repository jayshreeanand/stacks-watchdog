// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title TransactionMonitor
 * @dev Contract for monitoring suspicious transactions on Sonic blockchain
 */
contract TransactionMonitor is Ownable {
    // Events
    event SuspiciousTransactionDetected(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp,
        string reason
    );
    
    event WatchlistAddressAdded(address indexed addr, string category);
    event WatchlistAddressRemoved(address indexed addr);
    
    // Structs
    struct WatchlistEntry {
        bool isListed;
        string category; // "drainer", "rugpull", "scam", etc.
        uint256 addedAt;
    }
    
    // State variables
    mapping(address => WatchlistEntry) public watchlist;
    address[] public watchlistAddresses;
    
    uint256 public largeTransactionThreshold;
    uint256 public suspiciousTransactionCount;
    
    // Constructor
    constructor(uint256 _largeTransactionThreshold) Ownable(msg.sender) {
        largeTransactionThreshold = _largeTransactionThreshold;
        suspiciousTransactionCount = 0;
    }
    
    /**
     * @dev Add an address to the watchlist
     * @param addr Address to add
     * @param category Category of the address (drainer, rugpull, scam, etc.)
     */
    function addToWatchlist(address addr, string memory category) external onlyOwner {
        require(!watchlist[addr].isListed, "Address already on watchlist");
        
        watchlist[addr] = WatchlistEntry({
            isListed: true,
            category: category,
            addedAt: block.timestamp
        });
        
        watchlistAddresses.push(addr);
        emit WatchlistAddressAdded(addr, category);
    }
    
    /**
     * @dev Remove an address from the watchlist
     * @param addr Address to remove
     */
    function removeFromWatchlist(address addr) external onlyOwner {
        require(watchlist[addr].isListed, "Address not on watchlist");
        
        // Find and remove from array
        for (uint256 i = 0; i < watchlistAddresses.length; i++) {
            if (watchlistAddresses[i] == addr) {
                // Replace with the last element and pop
                watchlistAddresses[i] = watchlistAddresses[watchlistAddresses.length - 1];
                watchlistAddresses.pop();
                break;
            }
        }
        
        delete watchlist[addr];
        emit WatchlistAddressRemoved(addr);
    }
    
    /**
     * @dev Check if a transaction is suspicious
     * @param from Sender address
     * @param to Recipient address
     * @param amount Transaction amount
     * @return bool True if suspicious
     * @return string Reason for suspicion
     */
    function isSuspiciousTransaction(
        address from,
        address to,
        uint256 amount
    ) public view returns (bool, string memory) {
        // Check if either address is on watchlist
        if (watchlist[from].isListed) {
            return (true, string.concat("Sender is on watchlist as ", watchlist[from].category));
        }
        
        if (watchlist[to].isListed) {
            return (true, string.concat("Recipient is on watchlist as ", watchlist[to].category));
        }
        
        // Check for large transactions
        if (amount > largeTransactionThreshold) {
            return (true, "Large transaction amount");
        }
        
        return (false, "");
    }
    
    /**
     * @dev Report a suspicious transaction
     * @param from Sender address
     * @param to Recipient address
     * @param amount Transaction amount
     * @param reason Reason for suspicion
     */
    function reportSuspiciousTransaction(
        address from,
        address to,
        uint256 amount,
        string memory reason
    ) external onlyOwner {
        suspiciousTransactionCount++;
        emit SuspiciousTransactionDetected(from, to, amount, block.timestamp, reason);
    }
    
    /**
     * @dev Update the large transaction threshold
     * @param newThreshold New threshold value
     */
    function updateLargeTransactionThreshold(uint256 newThreshold) external onlyOwner {
        largeTransactionThreshold = newThreshold;
    }
    
    /**
     * @dev Get all addresses on the watchlist
     * @return Array of addresses
     */
    function getWatchlistAddresses() external view returns (address[] memory) {
        return watchlistAddresses;
    }
    
    /**
     * @dev Get watchlist entry details
     * @param addr Address to query
     * @return isListed Whether the address is listed
     * @return category Category of the address
     * @return addedAt When the address was added
     */
    function getWatchlistEntry(address addr) external view returns (
        bool isListed,
        string memory category,
        uint256 addedAt
    ) {
        WatchlistEntry memory entry = watchlist[addr];
        return (entry.isListed, entry.category, entry.addedAt);
    }
} 