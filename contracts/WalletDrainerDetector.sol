// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WalletDrainerDetector
 * @dev Contract for detecting wallet drainers on Sonic blockchain
 */
contract WalletDrainerDetector is Ownable {
    // Events
    event DrainerDetected(address indexed drainerAddress, string drainerType, uint256 timestamp);
    event DrainerPatternAdded(string pattern, string description);
    event DrainerPatternRemoved(string pattern);
    event ContractAnalyzed(address indexed contractAddress, bool isDrainer, string drainerType);
    
    // Structs
    struct DrainerPattern {
        bool exists;
        string description;
        uint256 addedAt;
    }
    
    struct DrainerContract {
        bool analyzed;
        bool isDrainer;
        string drainerType;
        uint256 detectedAt;
    }
    
    // State variables
    mapping(string => DrainerPattern) public drainerPatterns;
    string[] public patternList;
    
    mapping(address => DrainerContract) public drainerContracts;
    address[] public detectedDrainers;
    
    // Constructor
    constructor() Ownable(msg.sender) {
        // Initialize default drainer patterns
        _addDrainerPattern(
            "setApprovalForAll",
            "Function that can approve all tokens for transfer"
        );
        _addDrainerPattern(
            "transferFrom with unlimited approval",
            "Function that can transfer tokens without specific approval"
        );
        _addDrainerPattern(
            "hidden fee structure",
            "Contract with hidden or excessive fees"
        );
        _addDrainerPattern(
            "phishing signature",
            "Contract requesting signatures that can be used maliciously"
        );
        _addDrainerPattern(
            "sweepToken",
            "Function that can sweep all tokens from an address"
        );
    }
    
    /**
     * @dev Add a new drainer pattern
     * @param pattern Pattern name
     * @param description Pattern description
     */
    function addDrainerPattern(string memory pattern, string memory description) external onlyOwner {
        _addDrainerPattern(pattern, description);
    }
    
    /**
     * @dev Internal function to add a drainer pattern
     */
    function _addDrainerPattern(string memory pattern, string memory description) internal {
        require(!drainerPatterns[pattern].exists, "Pattern already exists");
        
        drainerPatterns[pattern] = DrainerPattern({
            exists: true,
            description: description,
            addedAt: block.timestamp
        });
        
        patternList.push(pattern);
        emit DrainerPatternAdded(pattern, description);
    }
    
    /**
     * @dev Remove a drainer pattern
     * @param pattern Pattern to remove
     */
    function removeDrainerPattern(string memory pattern) external onlyOwner {
        require(drainerPatterns[pattern].exists, "Pattern does not exist");
        
        // Find and remove from array
        for (uint256 i = 0; i < patternList.length; i++) {
            if (keccak256(bytes(patternList[i])) == keccak256(bytes(pattern))) {
                patternList[i] = patternList[patternList.length - 1];
                patternList.pop();
                break;
            }
        }
        
        delete drainerPatterns[pattern];
        emit DrainerPatternRemoved(pattern);
    }
    
    /**
     * @dev Record a contract as a drainer
     * @param contractAddress Address of the drainer contract
     * @param drainerType Type of drainer
     */
    function recordDrainerContract(address contractAddress, string memory drainerType) external onlyOwner {
        if (!drainerContracts[contractAddress].analyzed) {
            detectedDrainers.push(contractAddress);
        }
        
        drainerContracts[contractAddress] = DrainerContract({
            analyzed: true,
            isDrainer: true,
            drainerType: drainerType,
            detectedAt: block.timestamp
        });
        
        emit DrainerDetected(contractAddress, drainerType, block.timestamp);
    }
    
    /**
     * @dev Record a contract as safe (not a drainer)
     * @param contractAddress Address of the safe contract
     */
    function recordSafeContract(address contractAddress) external onlyOwner {
        drainerContracts[contractAddress] = DrainerContract({
            analyzed: true,
            isDrainer: false,
            drainerType: "",
            detectedAt: block.timestamp
        });
        
        emit ContractAnalyzed(contractAddress, false, "");
    }
    
    /**
     * @dev Get all drainer pattern names
     * @return Array of pattern names
     */
    function getDrainerPatterns() external view returns (string[] memory) {
        return patternList;
    }
    
    /**
     * @dev Get drainer pattern details
     * @param pattern Pattern name
     * @return exists Whether the pattern exists
     * @return description Pattern description
     * @return addedAt When the pattern was added
     */
    function getDrainerPatternDetails(string memory pattern) external view returns (
        bool exists,
        string memory description,
        uint256 addedAt
    ) {
        DrainerPattern memory p = drainerPatterns[pattern];
        return (p.exists, p.description, p.addedAt);
    }
    
    /**
     * @dev Get all detected drainer addresses
     * @return Array of drainer addresses
     */
    function getDetectedDrainers() external view returns (address[] memory) {
        return detectedDrainers;
    }
    
    /**
     * @dev Check if a contract is a known drainer
     * @param contractAddress Address to check
     * @return isDrainer Whether the contract is a drainer
     * @return drainerType Type of drainer if it is one
     */
    function isKnownDrainer(address contractAddress) external view returns (bool isDrainer, string memory drainerType) {
        DrainerContract memory dc = drainerContracts[contractAddress];
        return (dc.isDrainer, dc.drainerType);
    }
} 