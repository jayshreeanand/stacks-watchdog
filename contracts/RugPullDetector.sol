// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title RugPullDetector
 * @dev Contract for detecting potential rug pulls on Electroneum blockchain
 */
contract RugPullDetector is Ownable {
    // Events
    event TokenAnalyzed(address indexed tokenAddress, bool isPotentialRugPull, string[] reasons);
    event RiskFactorAdded(string name, uint256 weight);
    event RiskFactorRemoved(string name);
    event RiskFactorWeightUpdated(string name, uint256 newWeight);
    
    // Structs
    struct TokenAnalysis {
        bool analyzed;
        bool isPotentialRugPull;
        string[] riskFactors;
        uint256 riskScore;
        uint256 timestamp;
    }
    
    struct RiskFactor {
        bool exists;
        uint256 weight; // 1-100
    }
    
    // State variables
    mapping(address => TokenAnalysis) public tokenAnalyses;
    mapping(string => RiskFactor) public riskFactors;
    string[] public riskFactorNames;
    
    uint256 public rugPullThreshold;
    address[] public analyzedTokens;
    
    // Constructor
    constructor(uint256 _rugPullThreshold) Ownable(msg.sender) {
        rugPullThreshold = _rugPullThreshold;
        
        // Initialize default risk factors
        _addRiskFactor("No liquidity lock", 80);
        _addRiskFactor("Owner can mint unlimited tokens", 90);
        _addRiskFactor("Hidden mint functions", 95);
        _addRiskFactor("Blacklist functions", 60);
        _addRiskFactor("Transfer fees over 10%", 70);
        _addRiskFactor("Owner can pause trading", 75);
        _addRiskFactor("Proxy contract with upgradeable logic", 50);
    }
    
    /**
     * @dev Add a new risk factor
     * @param name Name of the risk factor
     * @param weight Weight of the risk factor (1-100)
     */
    function addRiskFactor(string memory name, uint256 weight) external onlyOwner {
        require(weight > 0 && weight <= 100, "Weight must be between 1 and 100");
        _addRiskFactor(name, weight);
    }
    
    /**
     * @dev Internal function to add a risk factor
     */
    function _addRiskFactor(string memory name, uint256 weight) internal {
        require(!riskFactors[name].exists, "Risk factor already exists");
        
        riskFactors[name] = RiskFactor({
            exists: true,
            weight: weight
        });
        
        riskFactorNames.push(name);
        emit RiskFactorAdded(name, weight);
    }
    
    /**
     * @dev Remove a risk factor
     * @param name Name of the risk factor
     */
    function removeRiskFactor(string memory name) external onlyOwner {
        require(riskFactors[name].exists, "Risk factor does not exist");
        
        // Find and remove from array
        for (uint256 i = 0; i < riskFactorNames.length; i++) {
            if (keccak256(bytes(riskFactorNames[i])) == keccak256(bytes(name))) {
                riskFactorNames[i] = riskFactorNames[riskFactorNames.length - 1];
                riskFactorNames.pop();
                break;
            }
        }
        
        delete riskFactors[name];
        emit RiskFactorRemoved(name);
    }
    
    /**
     * @dev Update the weight of a risk factor
     * @param name Name of the risk factor
     * @param newWeight New weight (1-100)
     */
    function updateRiskFactorWeight(string memory name, uint256 newWeight) external onlyOwner {
        require(riskFactors[name].exists, "Risk factor does not exist");
        require(newWeight > 0 && newWeight <= 100, "Weight must be between 1 and 100");
        
        riskFactors[name].weight = newWeight;
        emit RiskFactorWeightUpdated(name, newWeight);
    }
    
    /**
     * @dev Record token analysis results
     * @param tokenAddress Address of the analyzed token
     * @param detectedRiskFactors Array of detected risk factors
     */
    function recordTokenAnalysis(
        address tokenAddress,
        string[] memory detectedRiskFactors
    ) external onlyOwner {
        uint256 riskScore = 0;
        
        // Calculate risk score
        for (uint256 i = 0; i < detectedRiskFactors.length; i++) {
            string memory factor = detectedRiskFactors[i];
            if (riskFactors[factor].exists) {
                riskScore += riskFactors[factor].weight;
            }
        }
        
        // Normalize risk score to 0-100
        if (detectedRiskFactors.length > 0) {
            riskScore = riskScore / detectedRiskFactors.length;
        }
        
        bool isPotentialRugPull = riskScore >= rugPullThreshold;
        
        // Record analysis
        if (!tokenAnalyses[tokenAddress].analyzed) {
            analyzedTokens.push(tokenAddress);
        }
        
        tokenAnalyses[tokenAddress] = TokenAnalysis({
            analyzed: true,
            isPotentialRugPull: isPotentialRugPull,
            riskFactors: detectedRiskFactors,
            riskScore: riskScore,
            timestamp: block.timestamp
        });
        
        emit TokenAnalyzed(tokenAddress, isPotentialRugPull, detectedRiskFactors);
    }
    
    /**
     * @dev Update the rug pull threshold
     * @param newThreshold New threshold value (0-100)
     */
    function updateRugPullThreshold(uint256 newThreshold) external onlyOwner {
        require(newThreshold >= 0 && newThreshold <= 100, "Threshold must be between 0 and 100");
        rugPullThreshold = newThreshold;
    }
    
    /**
     * @dev Get all risk factor names
     * @return Array of risk factor names
     */
    function getRiskFactorNames() external view returns (string[] memory) {
        return riskFactorNames;
    }
    
    /**
     * @dev Get all analyzed tokens
     * @return Array of token addresses
     */
    function getAnalyzedTokens() external view returns (address[] memory) {
        return analyzedTokens;
    }
    
    /**
     * @dev Get token analysis details
     * @param tokenAddress Address of the token
     * @return analyzed Whether the token has been analyzed
     * @return isPotentialRugPull Whether the token is a potential rug pull
     * @return riskFactors Array of risk factors
     * @return riskScore Risk score (0-100)
     * @return timestamp When the analysis was performed
     */
    function getTokenAnalysis(address tokenAddress) external view returns (
        bool analyzed,
        bool isPotentialRugPull,
        string[] memory riskFactors,
        uint256 riskScore,
        uint256 timestamp
    ) {
        TokenAnalysis memory analysis = tokenAnalyses[tokenAddress];
        return (
            analysis.analyzed,
            analysis.isPotentialRugPull,
            analysis.riskFactors,
            analysis.riskScore,
            analysis.timestamp
        );
    }
} 