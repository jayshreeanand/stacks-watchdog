// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./TransactionMonitor.sol";
import "./RugPullDetector.sol";
import "./WalletDrainerDetector.sol";

/**
 * @title SWatchdogRegistry
 * @dev Main registry contract for Sonic Shield security monitoring system
 */
contract SWatchdogRegistry is Ownable {
    // Events
    event SecurityAlertRaised(
        uint256 indexed alertId,
        string alertType,
        address indexed targetAddress,
        string details,
        uint256 timestamp
    );
    event MonitoringComponentUpdated(string componentName, address componentAddress);
    event AlertSubscriptionUpdated(address subscriber, bool isSubscribed);
    
    // Structs
    struct SecurityAlert {
        uint256 id;
        string alertType; // "suspicious_transaction", "rug_pull", "wallet_drainer"
        address targetAddress;
        string details;
        uint256 timestamp;
        bool resolved;
    }
    
    // State variables
    TransactionMonitor public transactionMonitor;
    RugPullDetector public rugPullDetector;
    WalletDrainerDetector public walletDrainerDetector;
    
    SecurityAlert[] public alerts;
    mapping(address => bool) public subscribers;
    address[] public subscriberList;
    
    uint256 public alertCount;
    
    // Constructor
    constructor(
        address _transactionMonitor,
        address _rugPullDetector,
        address _walletDrainerDetector
    ) Ownable(msg.sender) {
        transactionMonitor = TransactionMonitor(_transactionMonitor);
        rugPullDetector = RugPullDetector(_rugPullDetector);
        walletDrainerDetector = WalletDrainerDetector(_walletDrainerDetector);
        alertCount = 0;
    }
    
    /**
     * @dev Update a monitoring component
     * @param componentName Name of the component
     * @param componentAddress New address of the component
     */
    function updateMonitoringComponent(
        string memory componentName,
        address componentAddress
    ) external onlyOwner {
        require(componentAddress != address(0), "Invalid component address");
        
        if (keccak256(bytes(componentName)) == keccak256(bytes("transaction_monitor"))) {
            transactionMonitor = TransactionMonitor(componentAddress);
        } else if (keccak256(bytes(componentName)) == keccak256(bytes("rug_pull_detector"))) {
            rugPullDetector = RugPullDetector(componentAddress);
        } else if (keccak256(bytes(componentName)) == keccak256(bytes("wallet_drainer_detector"))) {
            walletDrainerDetector = WalletDrainerDetector(componentAddress);
        } else {
            revert("Unknown component name");
        }
        
        emit MonitoringComponentUpdated(componentName, componentAddress);
    }
    
    /**
     * @dev Raise a security alert
     * @param alertType Type of alert
     * @param targetAddress Address related to the alert
     * @param details Additional details about the alert
     * @return alertId ID of the created alert
     */
    function raiseSecurityAlert(
        string memory alertType,
        address targetAddress,
        string memory details
    ) external onlyOwner returns (uint256 alertId) {
        alertId = alertCount++;
        
        SecurityAlert memory newAlert = SecurityAlert({
            id: alertId,
            alertType: alertType,
            targetAddress: targetAddress,
            details: details,
            timestamp: block.timestamp,
            resolved: false
        });
        
        alerts.push(newAlert);
        
        emit SecurityAlertRaised(
            alertId,
            alertType,
            targetAddress,
            details,
            block.timestamp
        );
        
        return alertId;
    }
    
    /**
     * @dev Mark an alert as resolved
     * @param alertId ID of the alert
     */
    function resolveAlert(uint256 alertId) external onlyOwner {
        require(alertId < alerts.length, "Alert does not exist");
        require(!alerts[alertId].resolved, "Alert already resolved");
        
        alerts[alertId].resolved = true;
    }
    
    /**
     * @dev Subscribe to security alerts
     */
    function subscribe() external {
        require(!subscribers[msg.sender], "Already subscribed");
        
        subscribers[msg.sender] = true;
        subscriberList.push(msg.sender);
        
        emit AlertSubscriptionUpdated(msg.sender, true);
    }
    
    /**
     * @dev Unsubscribe from security alerts
     */
    function unsubscribe() external {
        require(subscribers[msg.sender], "Not subscribed");
        
        // Find and remove from array
        for (uint256 i = 0; i < subscriberList.length; i++) {
            if (subscriberList[i] == msg.sender) {
                subscriberList[i] = subscriberList[subscriberList.length - 1];
                subscriberList.pop();
                break;
            }
        }
        
        subscribers[msg.sender] = false;
        
        emit AlertSubscriptionUpdated(msg.sender, false);
    }
    
    /**
     * @dev Get all alerts
     * @return Array of security alerts
     */
    function getAllAlerts() external view returns (SecurityAlert[] memory) {
        return alerts;
    }
    
    /**
     * @dev Get all active (unresolved) alerts
     * @return Array of active security alerts
     */
    function getActiveAlerts() external view returns (SecurityAlert[] memory) {
        // Count active alerts
        uint256 activeCount = 0;
        for (uint256 i = 0; i < alerts.length; i++) {
            if (!alerts[i].resolved) {
                activeCount++;
            }
        }
        
        // Create array of active alerts
        SecurityAlert[] memory activeAlerts = new SecurityAlert[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < alerts.length; i++) {
            if (!alerts[i].resolved) {
                activeAlerts[index] = alerts[i];
                index++;
            }
        }
        
        return activeAlerts;
    }
    
    /**
     * @dev Get all subscribers
     * @return Array of subscriber addresses
     */
    function getSubscribers() external view returns (address[] memory) {
        return subscriberList;
    }
    
    /**
     * @dev Check if an address is on the transaction monitor watchlist
     * @param addr Address to check
     * @return isListed Whether the address is listed
     * @return category Category of the address
     */
    function isAddressOnWatchlist(address addr) external view returns (bool isListed, string memory category) {
        (isListed, category, ) = transactionMonitor.getWatchlistEntry(addr);
        return (isListed, category);
    }
    
    /**
     * @dev Check if a token is a potential rug pull
     * @param tokenAddress Token address to check
     * @return isPotentialRugPull Whether the token is a potential rug pull
     * @return riskScore Risk score of the token
     */
    function isTokenRugPull(address tokenAddress) external view returns (bool isPotentialRugPull, uint256 riskScore) {
        (bool analyzed, bool isRugPull, , uint256 score, ) = rugPullDetector.getTokenAnalysis(tokenAddress);
        
        if (!analyzed) {
            return (false, 0);
        }
        
        return (isRugPull, score);
    }
    
    /**
     * @dev Check if a contract is a wallet drainer
     * @param contractAddress Contract address to check
     * @return isDrainer Whether the contract is a drainer
     * @return drainerType Type of drainer
     */
    function isContractDrainer(address contractAddress) external view returns (bool isDrainer, string memory drainerType) {
        return walletDrainerDetector.isKnownDrainer(contractAddress);
    }
} 