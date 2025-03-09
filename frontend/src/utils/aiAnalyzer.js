import axios from 'axios';

/**
 * AI-powered security analysis utilities for ETN Watchdog
 */
class AIAnalyzer {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.initialized = false;
    this.modelConfig = {
      model: 'gpt-4',
      temperature: 0.2,
      max_tokens: 1000
    };
  }

  /**
   * Initialize the AI analyzer
   */
  initialize() {
    this.initialized = true;
    console.log('AI analyzer initialized');
    return true;
  }

  /**
   * Analyze a smart contract for potential vulnerabilities
   * @param {string} contractCode - The smart contract code to analyze
   * @param {string} contractAddress - The address of the contract (optional)
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeSmartContract(contractCode, contractAddress = null) {
    try {
      // If using mock data, return predefined analysis
      if (!this.apiKey || process.env.REACT_APP_USE_MOCK_AI === 'true') {
        return this.getMockContractAnalysis(contractCode, contractAddress);
      }

      // Prepare the prompt for the AI model
      const prompt = `
        Analyze the following Solidity smart contract for security vulnerabilities:
        
        ${contractCode}
        
        Identify any potential security issues including but not limited to:
        1. Reentrancy vulnerabilities
        2. Integer overflow/underflow
        3. Unchecked external calls
        4. Access control issues
        5. Front-running vulnerabilities
        6. Logic errors
        7. Gas optimization issues
        8. Potential rug pull mechanisms
        9. Wallet drainer patterns
        
        Format your response as a JSON object with the following structure:
        {
          "vulnerabilities": [
            {
              "type": "VULNERABILITY_TYPE",
              "severity": "critical|high|medium|low",
              "description": "Detailed description of the vulnerability",
              "location": "Function or line number where the vulnerability exists",
              "recommendation": "How to fix the vulnerability"
            }
          ],
          "overallRiskScore": 0-100,
          "riskLevel": "critical|high|medium|low",
          "summary": "Brief summary of the analysis"
        }
      `;

      // Call the AI model API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.modelConfig.model,
          messages: [
            { role: 'system', content: 'You are a blockchain security expert specializing in smart contract auditing.' },
            { role: 'user', content: prompt }
          ],
          temperature: this.modelConfig.temperature,
          max_tokens: this.modelConfig.max_tokens
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      // Parse the response
      const analysisText = response.data.choices[0].message.content;
      const analysisJson = JSON.parse(analysisText);

      // Add metadata
      analysisJson.contractAddress = contractAddress;
      analysisJson.timestamp = Date.now();

      return analysisJson;
    } catch (error) {
      console.error('Error analyzing smart contract:', error);
      return {
        error: true,
        message: 'Failed to analyze smart contract',
        details: error.message
      };
    }
  }

  /**
   * Analyze a transaction for suspicious activity
   * @param {Object} transaction - The transaction to analyze
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeTransaction(transaction) {
    try {
      // If using mock data, return predefined analysis
      if (!this.apiKey || process.env.REACT_APP_USE_MOCK_AI === 'true') {
        return this.getMockTransactionAnalysis(transaction);
      }

      // Prepare the prompt for the AI model
      const prompt = `
        Analyze the following Electroneum blockchain transaction for suspicious activity:
        
        Transaction Hash: ${transaction.hash}
        From: ${transaction.from}
        To: ${transaction.to}
        Value: ${transaction.value} ETN
        Gas Price: ${transaction.gasPrice}
        Gas Used: ${transaction.gasUsed}
        
        Identify any potential suspicious patterns including but not limited to:
        1. Unusual transaction amounts
        2. Known malicious addresses
        3. Suspicious contract interactions
        4. Potential money laundering patterns
        5. Phishing or scam indicators
        
        Format your response as a JSON object with the following structure:
        {
          "isSuspicious": true|false,
          "suspiciousScore": 0-100,
          "reason": "Detailed explanation of why the transaction is suspicious or not",
          "recommendedAction": "What action should be taken"
        }
      `;

      // Call the AI model API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.modelConfig.model,
          messages: [
            { role: 'system', content: 'You are a blockchain security expert specializing in transaction analysis.' },
            { role: 'user', content: prompt }
          ],
          temperature: this.modelConfig.temperature,
          max_tokens: this.modelConfig.max_tokens
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      // Parse the response
      const analysisText = response.data.choices[0].message.content;
      const analysisJson = JSON.parse(analysisText);

      // Add metadata
      analysisJson.transactionHash = transaction.hash;
      analysisJson.timestamp = Date.now();

      return analysisJson;
    } catch (error) {
      console.error('Error analyzing transaction:', error);
      return {
        isSuspicious: false,
        suspiciousScore: 0,
        reason: 'Failed to analyze transaction',
        error: true,
        details: error.message
      };
    }
  }

  /**
   * Analyze an address for suspicious activity
   * @param {string} address - The address to analyze
   * @param {Array} transactions - Recent transactions for this address (optional)
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeAddress(address, transactions = []) {
    try {
      // If using mock data, return predefined analysis
      if (!this.apiKey || process.env.REACT_APP_USE_MOCK_AI === 'true') {
        return this.getMockAddressAnalysis(address, transactions);
      }

      // Prepare transaction data for the prompt
      const transactionData = transactions.length > 0 
        ? transactions.map(tx => `
          Hash: ${tx.hash}
          To: ${tx.to}
          Value: ${tx.value} ETN
          Timestamp: ${tx.timestamp}
        `).join('\n')
        : 'No transaction data provided';

      // Prepare the prompt for the AI model
      const prompt = `
        Analyze the following Electroneum blockchain address for suspicious activity:
        
        Address: ${address}
        
        Recent transactions:
        ${transactionData}
        
        Identify any potential suspicious patterns including but not limited to:
        1. Unusual transaction patterns
        2. Connections to known malicious addresses
        3. Potential wallet drainer behavior
        4. Money laundering indicators
        5. Scam or phishing indicators
        
        Format your response as a JSON object with the following structure:
        {
          "isSuspicious": true|false,
          "riskScore": 0-100,
          "riskLevel": "critical|high|medium|low|safe",
          "findings": [
            {
              "type": "FINDING_TYPE",
              "description": "Detailed description of the finding",
              "severity": "critical|high|medium|low"
            }
          ],
          "summary": "Brief summary of the analysis",
          "recommendedActions": ["Action 1", "Action 2"]
        }
      `;

      // Call the AI model API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.modelConfig.model,
          messages: [
            { role: 'system', content: 'You are a blockchain security expert specializing in address analysis.' },
            { role: 'user', content: prompt }
          ],
          temperature: this.modelConfig.temperature,
          max_tokens: this.modelConfig.max_tokens
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      // Parse the response
      const analysisText = response.data.choices[0].message.content;
      const analysisJson = JSON.parse(analysisText);

      // Add metadata
      analysisJson.address = address;
      analysisJson.timestamp = Date.now();

      return analysisJson;
    } catch (error) {
      console.error('Error analyzing address:', error);
      return {
        isSuspicious: false,
        riskScore: 0,
        riskLevel: 'unknown',
        findings: [],
        summary: 'Failed to analyze address',
        error: true,
        details: error.message
      };
    }
  }

  /**
   * Generate mock contract analysis for testing
   * @param {string} contractCode - The contract code
   * @param {string} contractAddress - The contract address
   * @returns {Object} Mock analysis
   */
  getMockContractAnalysis(contractCode, contractAddress) {
    // Check for common vulnerability patterns in the code
    const hasReentrancy = contractCode.includes('call.value') && !contractCode.includes('nonReentrant');
    const hasOwnerWithdraw = contractCode.includes('onlyOwner') && contractCode.includes('withdraw');
    const hasUncheckedCall = contractCode.includes('.call(') && !contractCode.includes('require(success');
    
    // Generate vulnerabilities based on code patterns
    const vulnerabilities = [];
    
    if (hasReentrancy) {
      vulnerabilities.push({
        type: 'REENTRANCY',
        severity: 'critical',
        description: 'The contract uses call.value without a reentrancy guard, making it vulnerable to reentrancy attacks.',
        location: 'Functions using call.value',
        recommendation: 'Implement the ReentrancyGuard pattern from OpenZeppelin or ensure all state changes happen before external calls.'
      });
    }
    
    if (hasOwnerWithdraw) {
      vulnerabilities.push({
        type: 'CENTRALIZATION_RISK',
        severity: 'high',
        description: 'The contract allows the owner to withdraw funds, creating a centralization risk and potential for rug pulls.',
        location: 'Owner withdrawal functions',
        recommendation: 'Consider implementing a time-lock or multi-signature mechanism for withdrawals.'
      });
    }
    
    if (hasUncheckedCall) {
      vulnerabilities.push({
        type: 'UNCHECKED_CALL',
        severity: 'medium',
        description: 'The contract contains unchecked low-level calls which may fail silently.',
        location: 'Functions with .call()',
        recommendation: 'Always check the return value of low-level calls and revert on failure.'
      });
    }
    
    // Always add some medium/low vulnerabilities for realistic results
    vulnerabilities.push({
      type: 'MISSING_EVENTS',
      severity: 'low',
      description: 'The contract does not emit events for important state changes, making it difficult to track off-chain.',
      location: 'Throughout the contract',
      recommendation: 'Add events for all significant state changes.'
    });
    
    // Calculate risk score based on vulnerabilities
    let overallRiskScore = 0;
    if (vulnerabilities.length > 0) {
      const severityScores = {
        'critical': 100,
        'high': 70,
        'medium': 40,
        'low': 10
      };
      
      const totalScore = vulnerabilities.reduce((sum, vuln) => sum + severityScores[vuln.severity], 0);
      overallRiskScore = Math.min(100, Math.round(totalScore / vulnerabilities.length));
    }
    
    // Determine risk level
    let riskLevel = 'low';
    if (overallRiskScore >= 75) riskLevel = 'critical';
    else if (overallRiskScore >= 50) riskLevel = 'high';
    else if (overallRiskScore >= 25) riskLevel = 'medium';
    
    return {
      vulnerabilities,
      overallRiskScore,
      riskLevel,
      summary: `Analysis found ${vulnerabilities.length} potential vulnerabilities with an overall risk score of ${overallRiskScore}/100.`,
      contractAddress,
      timestamp: Date.now()
    };
  }

  /**
   * Generate mock transaction analysis for testing
   * @param {Object} transaction - The transaction
   * @returns {Object} Mock analysis
   */
  getMockTransactionAnalysis(transaction) {
    // Determine if transaction is suspicious based on patterns
    const value = parseFloat(transaction.value);
    const isSuspicious = value > 10000 || 
                         transaction.to.startsWith('0xdead') || 
                         transaction.to.startsWith('0x1234');
    
    const suspiciousScore = isSuspicious ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 20);
    
    return {
      isSuspicious,
      suspiciousScore,
      reason: isSuspicious 
        ? 'Transaction involves a large amount or a potentially suspicious address pattern.'
        : 'No suspicious patterns detected in this transaction.',
      recommendedAction: isSuspicious 
        ? 'Monitor this transaction and related addresses for further suspicious activity.'
        : 'No action required.',
      transactionHash: transaction.hash,
      timestamp: Date.now()
    };
  }

  /**
   * Generate mock address analysis for testing
   * @param {string} address - The address
   * @param {Array} transactions - Recent transactions
   * @returns {Object} Mock analysis
   */
  getMockAddressAnalysis(address, transactions) {
    // Determine if address is suspicious based on patterns
    const isSuspicious = address.startsWith('0xdead') || 
                         address.startsWith('0x1234') ||
                         transactions.length > 100;
    
    const riskScore = isSuspicious ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 20);
    
    let riskLevel = 'safe';
    if (riskScore >= 75) riskLevel = 'critical';
    else if (riskScore >= 50) riskLevel = 'high';
    else if (riskScore >= 25) riskLevel = 'medium';
    else if (riskScore >= 10) riskLevel = 'low';
    
    const findings = [];
    
    if (isSuspicious) {
      findings.push({
        type: 'SUSPICIOUS_ADDRESS_PATTERN',
        description: 'Address matches known suspicious patterns.',
        severity: 'high'
      });
      
      if (transactions.length > 100) {
        findings.push({
          type: 'HIGH_TRANSACTION_VOLUME',
          description: 'Address has an unusually high number of transactions.',
          severity: 'medium'
        });
      }
    } else {
      findings.push({
        type: 'NORMAL_ACTIVITY',
        description: 'Address shows normal transaction patterns.',
        severity: 'low'
      });
    }
    
    return {
      isSuspicious,
      riskScore,
      riskLevel,
      findings,
      summary: isSuspicious 
        ? 'Address shows suspicious patterns and may be involved in malicious activity.'
        : 'Address appears to be conducting normal activity.',
      recommendedActions: isSuspicious 
        ? ['Monitor this address for further suspicious activity', 'Consider adding to watchlist']
        : ['No action required'],
      address,
      timestamp: Date.now()
    };
  }
}

export default new AIAnalyzer(); 