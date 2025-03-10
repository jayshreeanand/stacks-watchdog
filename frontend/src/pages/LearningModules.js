import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Button,
  Icon,
  useColorModeValue,
  Flex,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Progress,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FiBookOpen, FiCode, FiShield, FiAward, FiCheckCircle, FiLock, FiAlertTriangle, FiCpu } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Create a motion box component
const MotionBox = motion(Box);

// Module card component
const ModuleCard = ({ title, description, icon, level, progress, onClick }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <MotionBox
      p={6}
      rounded="xl"
      shadow="md"
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
      transition="all 0.3s"
      onClick={onClick}
      cursor="pointer"
    >
      <VStack spacing={4} align="flex-start">
        <Flex
          w={12}
          h={12}
          align="center"
          justify="center"
          rounded="full"
          bg="blue.50"
          color="blue.500"
        >
          <Icon as={icon} boxSize={6} />
        </Flex>
        
        <Box>
          <HStack mb={2}>
            <Heading size="md">{title}</Heading>
            <Badge colorScheme={
              level === 'Beginner' ? 'green' : 
              level === 'Intermediate' ? 'blue' : 'purple'
            }>
              {level}
            </Badge>
          </HStack>
          <Text color="gray.500">{description}</Text>
        </Box>
        
        <Box w="100%">
          <HStack justify="space-between" mb={1}>
            <Text fontSize="sm" color="gray.500">Progress</Text>
            <Text fontSize="sm" fontWeight="bold">{progress}%</Text>
          </HStack>
          <Progress value={progress} size="sm" colorScheme="blue" rounded="full" />
        </Box>
      </VStack>
    </MotionBox>
  );
};

// Module content component
const ModuleContent = ({ module, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  
  const steps = module.steps || [];
  const progress = Math.round((currentStep / (steps.length - 1)) * 100) || 0;
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      onComplete && onComplete(module.id);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };
  
  const currentStepData = steps[currentStep] || {};
  
  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Button leftIcon={<FiBookOpen />} variant="outline" onClick={onBack}>
          Back to Modules
        </Button>
        <HStack>
          <Text fontWeight="medium">Progress:</Text>
          <Progress value={progress} size="sm" w="200px" colorScheme="blue" rounded="full" />
          <Text>{progress}%</Text>
        </HStack>
      </HStack>
      
      <Box mb={8}>
        <Heading size="lg" mb={2}>{module.title}</Heading>
        <Text color="gray.500">{module.description}</Text>
      </Box>
      
      <Box p={6} rounded="xl" shadow="md" bg={useColorModeValue('white', 'gray.800')} mb={6}>
        <Heading size="md" mb={4}>
          {currentStepData.title}
        </Heading>
        
        <Text mb={6}>{currentStepData.content}</Text>
        
        {currentStepData.type === 'quiz' && (
          <VStack align="stretch" spacing={4}>
            {currentStepData.questions && currentStepData.questions.map((question, idx) => (
              <Box key={idx} p={4} borderWidth="1px" rounded="md">
                <Text fontWeight="bold" mb={3}>{question.text}</Text>
                <VStack align="stretch">
                  {question.options.map((option, optIdx) => (
                    <Button 
                      key={optIdx}
                      variant={answers[question.id] === option ? "solid" : "outline"}
                      colorScheme={answers[question.id] === option ? "blue" : "gray"}
                      justifyContent="flex-start"
                      onClick={() => handleAnswer(question.id, option)}
                    >
                      {option}
                    </Button>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        )}
        
        {currentStepData.type === 'code' && (
          <Box p={4} bg="gray.900" color="white" fontFamily="mono" rounded="md" overflowX="auto">
            <pre>{currentStepData.code}</pre>
          </Box>
        )}
        
        {currentStepData.type === 'interactive' && (
          <Box p={4} borderWidth="1px" rounded="md">
            <Text mb={4}>{currentStepData.interactivePrompt}</Text>
            {/* Interactive elements would go here */}
          </Box>
        )}
      </Box>
      
      <HStack justify="space-between">
        <Button 
          onClick={handlePrevious} 
          isDisabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button 
          colorScheme="blue" 
          onClick={handleNext}
        >
          {currentStep < steps.length - 1 ? 'Next' : 'Complete'}
        </Button>
      </HStack>
      
      {isCompleted && (
        <Modal isOpen={isCompleted} onClose={() => setIsCompleted(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Module Completed!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Icon as={FiAward} boxSize={12} color="yellow.500" />
                <Heading size="md">Congratulations!</Heading>
                <Text>You've successfully completed the {module.title} module.</Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={() => {
                setIsCompleted(false);
                onBack();
              }}>
                Return to Modules
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

// Certificate component
const Certificate = ({ completedModules }) => {
  return (
    <Box p={6} rounded="xl" shadow="md" bg={useColorModeValue('white', 'gray.800')} borderWidth="1px">
      <VStack spacing={6}>
        <Icon as={FiAward} boxSize={12} color="yellow.500" />
        <Heading size="lg">Your Achievements</Heading>
        <Text textAlign="center">
          You've completed {completedModules.length} learning modules. Keep going to earn your Blockchain Security Expert certificate!
        </Text>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
          {completedModules.map((module, idx) => (
            <HStack key={idx} p={3} borderWidth="1px" rounded="md">
              <Icon as={FiCheckCircle} color="green.500" />
              <Text>{module.title}</Text>
            </HStack>
          ))}
        </SimpleGrid>
        
        <Button 
          colorScheme="blue" 
          isDisabled={completedModules.length < 5}
          leftIcon={<FiAward />}
        >
          {completedModules.length < 5 
            ? `Complete ${5 - completedModules.length} more to earn certificate` 
            : 'Download Certificate'}
        </Button>
      </VStack>
    </Box>
  );
};

// Main component
const LearningModules = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [completedModules, setCompletedModules] = useState([]);
  
  // Mock data for modules
  const modules = [
    {
      id: 'smart-contract-vulnerabilities',
      title: 'Smart Contract Vulnerabilities',
      description: 'Learn about common vulnerabilities like reentrancy attacks, integer overflows, and access control issues.',
      icon: FiAlertTriangle,
      level: 'Beginner',
      category: 'vulnerabilities',
      steps: [
        {
          title: 'Introduction to Smart Contract Vulnerabilities',
          type: 'content',
          content: 'Smart contracts are self-executing contracts with the terms directly written into code. While they offer many advantages, they are also susceptible to various vulnerabilities that can lead to significant financial losses. In this module, we will explore common vulnerabilities and how to identify and prevent them.'
        },
        {
          title: 'Reentrancy Attacks',
          type: 'content',
          content: 'Reentrancy attacks occur when external contract calls are allowed to make new calls to the calling contract before the first execution is complete. This can lead to functions being called repeatedly before the first call is complete, potentially draining funds from a contract.'
        },
        {
          title: 'Reentrancy Example',
          type: 'code',
          content: 'Here is an example of a vulnerable contract susceptible to reentrancy:',
          code: `// VULNERABLE CONTRACT
contract VulnerableBank {
    mapping(address => uint) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw() public {
        uint amount = balances[msg.sender];
        
        // This external call happens before the balance is updated
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        // Balance is updated after the external call
        balances[msg.sender] = 0;
    }
}`
        },
        {
          title: 'Reentrancy Prevention',
          type: 'content',
          content: 'To prevent reentrancy attacks, always follow the Checks-Effects-Interactions pattern: perform all checks first, then make state changes, and finally interact with external contracts. Additionally, consider using reentrancy guards.'
        },
        {
          title: 'Secure Implementation',
          type: 'code',
          code: `// SECURE CONTRACT
contract SecureBank {
    mapping(address => uint) public balances;
    bool private locked;
    
    modifier noReentrancy() {
        require(!locked, "No reentrancy");
        locked = true;
        _;
        locked = false;
    }
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw() public noReentrancy {
        uint amount = balances[msg.sender];
        
        // Update the state before making external calls
        balances[msg.sender] = 0;
        
        // External call happens after state update
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}`
        },
        {
          title: 'Integer Overflow and Underflow',
          type: 'content',
          content: 'Integer overflow and underflow occur when arithmetic operations exceed the maximum or minimum value that can be stored in a variable. In Solidity versions prior to 0.8.0, this could lead to unexpected behavior and security vulnerabilities.'
        },
        {
          title: 'Quiz: Smart Contract Vulnerabilities',
          type: 'quiz',
          questions: [
            {
              id: 'reentrancy-q1',
              text: 'What is the correct order for the Checks-Effects-Interactions pattern?',
              options: [
                'Interactions, Checks, Effects',
                'Checks, Interactions, Effects',
                'Checks, Effects, Interactions',
                'Effects, Checks, Interactions'
              ],
              correctAnswer: 'Checks, Effects, Interactions'
            },
            {
              id: 'integer-q1',
              text: 'In Solidity versions prior to 0.8.0, what happens when an unsigned integer is decremented below zero?',
              options: [
                'It throws an error',
                'It wraps around to the maximum value',
                'It becomes a negative number',
                'It stays at zero'
              ],
              correctAnswer: 'It wraps around to the maximum value'
            }
          ]
        }
      ]
    },
    {
      id: 'security-best-practices',
      title: 'Security Best Practices',
      description: 'Guidance on secure coding standards, proper use of libraries, and audit procedures.',
      icon: FiShield,
      level: 'Intermediate',
      category: 'best-practices',
      steps: [
        {
          title: 'Introduction to Security Best Practices',
          type: 'content',
          content: 'Implementing security best practices is essential for developing robust and secure smart contracts. This module covers key principles and techniques to enhance the security of your blockchain applications.'
        },
        {
          title: 'Code Simplicity and Modularity',
          type: 'content',
          content: 'Complex code is more prone to errors and harder to audit. Keep your smart contracts simple, modular, and focused on specific functionality. Use established design patterns and avoid reinventing the wheel when possible.'
        },
        {
          title: 'Using Secure Libraries',
          type: 'content',
          content: 'Leverage well-audited libraries like OpenZeppelin for common functionality such as token standards, access control, and mathematical operations. These libraries have been extensively tested and reviewed by the community.'
        },
        {
          title: 'Example: Using OpenZeppelin',
          type: 'code',
          code: `// Using OpenZeppelin's SafeMath library (for Solidity < 0.8.0)
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SecureToken {
    using SafeMath for uint256;
    
    mapping(address => uint256) balances;
    
    function transfer(address to, uint256 amount) public {
        // SafeMath prevents overflow/underflow
        balances[msg.sender] = balances[msg.sender].sub(amount);
        balances[to] = balances[to].add(amount);
    }
}

// For Solidity >= 0.8.0, built-in overflow checking is available
contract ModernToken {
    mapping(address => uint256) balances;
    
    function transfer(address to, uint256 amount) public {
        // Overflow/underflow will revert automatically
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}`
        },
        {
          title: 'Comprehensive Testing',
          type: 'content',
          content: 'Implement thorough testing strategies including unit tests, integration tests, and formal verification when possible. Use tools like Hardhat, Truffle, or Foundry for testing, and consider property-based testing for edge cases.'
        },
        {
          title: 'Security Audits',
          type: 'content',
          content: 'Professional security audits are crucial for identifying vulnerabilities that automated tools might miss. Engage reputable auditors before deploying critical contracts, and consider multiple audits for high-value systems.'
        },
        {
          title: 'Quiz: Security Best Practices',
          type: 'quiz',
          questions: [
            {
              id: 'practices-q1',
              text: 'Which of the following is NOT a recommended security practice for smart contracts?',
              options: [
                'Using well-audited libraries',
                'Implementing comprehensive testing',
                'Writing complex, monolithic contracts',
                'Conducting professional security audits'
              ],
              correctAnswer: 'Writing complex, monolithic contracts'
            },
            {
              id: 'practices-q2',
              text: 'What is the primary advantage of using libraries like OpenZeppelin?',
              options: [
                'They make contracts smaller in size',
                'They provide well-tested, secure implementations of common functionality',
                'They automatically fix all security vulnerabilities',
                'They eliminate the need for security audits'
              ],
              correctAnswer: 'They provide well-tested, secure implementations of common functionality'
            }
          ]
        }
      ]
    },
    {
      id: 'access-control-patterns',
      title: 'Access Control Patterns',
      description: 'Learn about implementing secure access control in smart contracts.',
      icon: FiLock,
      level: 'Intermediate',
      category: 'best-practices',
      steps: [
        {
          title: 'Introduction to Access Control',
          type: 'content',
          content: 'Access control is a critical aspect of smart contract security that determines who can perform specific actions within a contract. Proper implementation of access control mechanisms helps prevent unauthorized access and potential exploits.'
        },
        {
          title: 'Common Access Control Patterns',
          type: 'content',
          content: 'Several patterns exist for implementing access control in smart contracts. The most common include Ownership, Role-Based Access Control (RBAC), and Access Control Lists (ACLs). Each has its own advantages and use cases.'
        },
        {
          title: 'Ownership Pattern',
          type: 'content',
          content: 'The Ownership pattern is the simplest form of access control, where a single address (the owner) has special privileges. While easy to implement, it creates a single point of failure and may not be suitable for decentralized applications.'
        },
        {
          title: 'Ownership Implementation',
          type: 'code',
          code: `// Basic Ownership Pattern
contract Owned {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}`
        },
        {
          title: 'Role-Based Access Control',
          type: 'content',
          content: 'Role-Based Access Control (RBAC) assigns permissions to roles rather than directly to addresses. This provides more flexibility and better separation of concerns. Users can be assigned one or multiple roles, each with specific permissions.'
        },
        {
          title: 'RBAC Implementation',
          type: 'code',
          code: `// Role-Based Access Control
contract RBACExample {
    mapping(address => mapping(bytes32 => bool)) private roles;
    
    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER");
    
    constructor() {
        // Assign the admin role to the deployer
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    modifier onlyRole(bytes32 role) {
        require(roles[msg.sender][role], "Unauthorized");
        _;
    }
    
    function _grantRole(bytes32 role, address account) internal {
        roles[account][role] = true;
    }
    
    function grantRole(bytes32 role, address account) public onlyRole(ADMIN_ROLE) {
        _grantRole(role, account);
    }
    
    function revokeRole(bytes32 role, address account) public onlyRole(ADMIN_ROLE) {
        roles[account][role] = false;
    }
    
    // Function restricted to minters
    function mint() public onlyRole(MINTER_ROLE) {
        // Minting logic
    }
}`
        },
        {
          title: 'Using OpenZeppelin Access Control',
          type: 'content',
          content: 'OpenZeppelin provides well-tested implementations of access control patterns. Their AccessControl contract offers a comprehensive RBAC solution that includes role management, role hierarchies, and events.'
        },
        {
          title: 'OpenZeppelin AccessControl Example',
          type: 'code',
          code: `// Using OpenZeppelin AccessControl
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TokenWithRoles is AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    constructor() {
        // Grant the contract deployer the default admin role
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        // Minting logic
    }
    
    function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) {
        // Burning logic
    }
}`
        },
        {
          title: 'Multi-Signature Wallets',
          type: 'content',
          content: 'Multi-signature (multisig) wallets require multiple parties to approve an action before it is executed. This distributes trust among multiple participants and provides an additional layer of security for high-value operations.'
        },
        {
          title: 'Timelock Controllers',
          type: 'content',
          content: 'Timelock controllers introduce a delay between when an action is proposed and when it can be executed. This gives users time to review changes and potentially exit the system if they disagree with the proposed changes.'
        },
        {
          title: 'Quiz: Access Control Patterns',
          type: 'quiz',
          questions: [
            {
              id: 'access-q1',
              text: 'Which access control pattern is most suitable for a fully decentralized application?',
              options: [
                'Simple Ownership pattern',
                'Role-Based Access Control',
                'Multi-signature with distributed key holders',
                'Single admin with unlimited powers'
              ],
              correctAnswer: 'Multi-signature with distributed key holders'
            },
            {
              id: 'access-q2',
              text: 'What is the main advantage of using a Timelock Controller?',
              options: [
                'It makes transactions faster',
                'It reduces gas costs',
                'It gives users time to review and react to proposed changes',
                'It automatically approves all transactions'
              ],
              correctAnswer: 'It gives users time to review and react to proposed changes'
            }
          ]
        }
      ]
    },
    {
      id: 'defi-security',
      title: 'DeFi Security Fundamentals',
      description: 'Understanding security considerations specific to decentralized finance applications.',
      icon: FiCode,
      level: 'Advanced',
      category: 'vulnerabilities',
      steps: [
        {
          title: 'Introduction to DeFi Security',
          type: 'content',
          content: 'Decentralized Finance (DeFi) applications face unique security challenges due to their financial nature, composability, and the large amounts of value they handle. This module covers fundamental security considerations for DeFi protocols.'
        },
        {
          title: 'Common DeFi Vulnerabilities',
          type: 'content',
          content: 'DeFi protocols are susceptible to various attack vectors, including flash loan attacks, oracle manipulation, front-running, and economic exploits. Understanding these vulnerabilities is essential for building secure DeFi applications.'
        },
        {
          title: 'Flash Loan Attacks',
          type: 'content',
          content: 'Flash loans allow users to borrow large amounts of assets without collateral, as long as the loan is repaid within the same transaction. Attackers can use flash loans to temporarily acquire significant capital and manipulate markets or exploit vulnerabilities in protocols.'
        },
        {
          title: 'Flash Loan Attack Example',
          type: 'code',
          code: `// Simplified Flash Loan Attack
contract FlashLoanAttack {
    // Target vulnerable protocol
    VulnerableProtocol target;
    // DeFi lending protocol that offers flash loans
    LendingProtocol lender;
    
    function executeAttack() external {
        // 1. Take out a flash loan
        lender.flashLoan(
            1000000 ether,  // Borrow a large amount
            address(this),  // Send to this contract
            abi.encodeWithSignature("receiveFlashLoan(uint256)", 1000000 ether)
        );
        // 4. Profit is now in the attacker's contract
    }
    
    function receiveFlashLoan(uint256 amount) external {
        // 2. Use the borrowed funds to manipulate the market
        //    or exploit a vulnerability
        target.deposit(amount);
        target.triggerVulnerableFunction();
        target.withdraw();
        
        // 3. Repay the flash loan
        lender.repay(amount);
    }
}`
        },
        {
          title: 'Oracle Manipulation',
          type: 'content',
          content: 'Price oracles provide external data to smart contracts. If a protocol relies on a single source or manipulable oracle, attackers can exploit this to manipulate prices and extract value from the protocol.'
        },
        {
          title: 'Secure Oracle Usage',
          type: 'content',
          content: 'To mitigate oracle manipulation risks, use decentralized oracles like Chainlink, implement time-weighted average prices (TWAP), and consider using multiple independent oracle sources. Always validate oracle data and implement circuit breakers for extreme price movements.'
        },
        {
          title: 'Front-Running Protection',
          type: 'content',
          content: 'Front-running occurs when someone sees a pending transaction and submits their own transaction with a higher gas price to be executed first. In DeFi, this can be used to profit from upcoming price changes or to steal value from legitimate transactions.'
        },
        {
          title: 'Front-Running Mitigation Techniques',
          type: 'code',
          code: `// Commit-Reveal Pattern
contract CommitRevealTrade {
    mapping(bytes32 => bool) public commitments;
    uint256 public constant REVEAL_TIMEOUT = 10 minutes;
    
    // Step 1: User commits to a trade without revealing details
    function commitTrade(bytes32 commitment) external {
        commitments[commitment] = true;
    }
    
    // Step 2: After some blocks, user reveals the trade details
    function revealTrade(
        address token,
        uint256 amount,
        uint256 price,
        bytes32 salt
    ) external {
        // Recreate the commitment hash
        bytes32 commitment = keccak256(
            abi.encodePacked(msg.sender, token, amount, price, salt)
        );
        
        // Verify the commitment exists
        require(commitments[commitment], "Invalid commitment");
        
        // Execute the trade
        // ...
        
        // Remove the commitment
        delete commitments[commitment];
    }
}`
        },
        {
          title: 'Economic Security',
          type: 'content',
          content: 'DeFi protocols must be economically secure against various attack vectors. This includes ensuring proper collateralization ratios, implementing slippage protection, and designing incentive mechanisms that align with the protocol\'s goals.'
        },
        {
          title: 'Composability Risks',
          type: 'content',
          content: 'DeFi\'s composability allows protocols to interact with each other, creating powerful financial legos. However, this also introduces dependencies and potential cascading failures. Always consider how your protocol interacts with others and implement safeguards against external protocol failures.'
        },
        {
          title: 'Secure Yield Farming',
          type: 'content',
          content: 'Yield farming protocols are particularly vulnerable to economic exploits. Implement proper reward distribution mechanisms, consider vesting periods for rewards, and be cautious of inflationary tokenomics that may not be sustainable.'
        },
        {
          title: 'Quiz: DeFi Security',
          type: 'quiz',
          questions: [
            {
              id: 'defi-q1',
              text: 'Which of the following is NOT a common mitigation for oracle manipulation?',
              options: [
                'Using time-weighted average prices (TWAP)',
                'Implementing multiple independent oracle sources',
                'Relying on a single centralized price feed',
                'Using decentralized oracles like Chainlink'
              ],
              correctAnswer: 'Relying on a single centralized price feed'
            },
            {
              id: 'defi-q2',
              text: 'What makes flash loan attacks particularly dangerous?',
              options: [
                'They require no upfront capital to execute',
                'They can only be performed by the contract owner',
                'They always result in permanent loss of funds',
                'They can only target specific tokens'
              ],
              correctAnswer: 'They require no upfront capital to execute'
            }
          ]
        }
      ]
    },
    {
      id: 'ai-vulnerability-detection',
      title: 'AI-Driven Vulnerability Detection',
      description: 'Advanced AI techniques for identifying subtle vulnerabilities in smart contracts.',
      icon: FiCpu,
      level: 'Advanced',
      category: 'advanced-techniques',
      steps: [
        {
          title: 'Introduction to AI in Smart Contract Security',
          type: 'content',
          content: 'Artificial intelligence and machine learning techniques are increasingly being used to identify vulnerabilities in smart contracts that traditional methods might miss. These approaches can analyze patterns across large codebases and identify subtle security issues.'
        },
        {
          title: 'Advantages of AI-Driven Security',
          type: 'content',
          content: 'AI-driven security tools offer several advantages: they can identify patterns across millions of contracts, learn from historical vulnerabilities, detect subtle and complex vulnerabilities, continuously improve as more data becomes available, and complement traditional static and dynamic analysis techniques.'
        },
        {
          title: 'Machine Learning Approaches',
          type: 'content',
          content: 'Various machine learning techniques can be applied to smart contract security, including supervised learning (training on labeled datasets of vulnerable/non-vulnerable contracts), unsupervised learning (anomaly detection to identify unusual patterns), and deep learning (neural networks for complex pattern recognition).'
        },
        {
          title: 'Natural Language Processing for Code Analysis',
          type: 'content',
          content: 'Smart contract code can be analyzed using NLP techniques to identify potential vulnerabilities. This includes code embeddings (representing code as vectors in a high-dimensional space), semantic analysis (understanding the meaning and intent of code), and pattern recognition (identifying common vulnerability patterns).'
        },
        {
          title: 'Example: Vulnerability Detection Model',
          type: 'code',
          code: `// Simplified example of how an AI model might be used in a security tool

// Feature extraction from a smart contract
function extractFeatures(contractCode) {
  // Extract various features like:
  // - Number of external calls
  // - Presence of reentrancy patterns
  // - Use of unchecked math operations
  // - Presence of access control
  // - etc.
  
  return {
    externalCalls: countExternalCalls(contractCode),
    stateAfterCall: checkStateAfterCall(contractCode),
    accessControl: hasAccessControl(contractCode),
    // ... more features
  };
}

// Using a pre-trained model to predict vulnerabilities
function predictVulnerabilities(contractCode) {
  const features = extractFeatures(contractCode);
  
  // This would use a pre-trained ML model in a real implementation
  const predictions = {
    reentrancy: model.predict('reentrancy', features),
    overflowUnderflow: model.predict('overflow', features),
    accessControl: model.predict('accessControl', features),
    // ... more vulnerability types
  };
  
  return predictions;
}

// Example usage in a security tool
function analyzeContract(contractCode) {
  const vulnerabilities = predictVulnerabilities(contractCode);
  
  // Generate report
  return {
    vulnerabilities: vulnerabilities,
    riskScore: calculateRiskScore(vulnerabilities),
    recommendations: generateRecommendations(vulnerabilities)
  };
}`
        },
        {
          title: 'Implementing AI-Driven Security Tools',
          type: 'content',
          content: 'Implementing AI-driven security analysis involves several steps: data collection (gathering large datasets of smart contracts), model training (training models to identify vulnerability patterns), integration with development workflow (providing real-time feedback during coding), and continuous improvement (updating models with new vulnerability data).'
        },
        {
          title: 'Limitations and Challenges',
          type: 'content',
          content: 'AI-driven approaches have limitations that must be considered: false positives/negatives (AI models may flag secure code as vulnerable), explainability (understanding why a model flagged a vulnerability), and adversarial attacks (attackers may design code to evade detection).'
        },
        {
          title: 'Case Studies',
          type: 'content',
          content: 'Real-world examples of AI-driven vulnerability detection include automated audit assistance (AI tools that assist human auditors), vulnerability prediction (predicting which contracts are most likely to be exploited), and anomaly detection in DeFi (monitoring transaction patterns for unusual activity).'
        },
        {
          title: 'Future Directions',
          type: 'content',
          content: 'Emerging trends in AI-driven security include formal verification with AI (using AI to guide formal verification efforts), automated vulnerability remediation (suggesting fixes for identified vulnerabilities), and cross-chain security analysis (analyzing vulnerabilities across multiple blockchains).'
        },
        {
          title: 'Quiz: AI-Driven Vulnerability Detection',
          type: 'quiz',
          questions: [
            {
              id: 'ai-q1',
              text: 'Which of the following is NOT a typical advantage of AI-driven security tools?',
              options: [
                'They can analyze patterns across millions of contracts',
                'They guarantee 100% detection of all vulnerabilities',
                'They learn from historical vulnerabilities',
                'They complement traditional static analysis'
              ],
              correctAnswer: 'They guarantee 100% detection of all vulnerabilities'
            },
            {
              id: 'ai-q2',
              text: 'What is a key challenge in using AI for smart contract security?',
              options: [
                'AI models are too slow to be practical',
                'Smart contracts are too simple for AI analysis',
                'Explaining why an AI model flagged a vulnerability',
                'AI cannot process Solidity code'
              ],
              correctAnswer: 'Explaining why an AI model flagged a vulnerability'
            }
          ]
        }
      ]
    }
  ];
  
  // Initialize progress data
  useEffect(() => {
    // In a real app, this would come from an API or local storage
    const initialProgress = {};
    modules.forEach(module => {
      initialProgress[module.id] = Math.floor(Math.random() * 30); // Mock progress data
    });
    setUserProgress(initialProgress);
    
    // Mock completed modules
    const completed = modules.filter(m => Math.random() > 0.7);
    setCompletedModules(completed);
  }, []);
  
  const handleModuleSelect = (module) => {
    setSelectedModule(module);
  };
  
  const handleModuleComplete = (moduleId) => {
    setUserProgress({
      ...userProgress,
      [moduleId]: 100
    });
    
    const completedModule = modules.find(m => m.id === moduleId);
    if (completedModule && !completedModules.some(m => m.id === moduleId)) {
      setCompletedModules([...completedModules, completedModule]);
    }
  };
  
  return (
    <Box>
      <Container maxW="container.xl" py={8}>
        {!selectedModule ? (
          <>
            <Box mb={10}>
              <Heading as="h1" size="xl" mb={4}>
                Interactive Learning Modules
              </Heading>
              <Text fontSize="lg" color="gray.500">
                Enhance your blockchain security knowledge with our interactive learning modules.
                Complete modules to earn certificates and become a blockchain security expert.
              </Text>
            </Box>
            
            <Tabs colorScheme="blue" mb={10}>
              <TabList>
                <Tab>All Modules</Tab>
                <Tab>Vulnerabilities</Tab>
                <Tab>Best Practices</Tab>
                <Tab>Your Progress</Tab>
              </TabList>
              
              <TabPanels>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {modules.map((module) => (
                      <ModuleCard
                        key={module.id}
                        title={module.title}
                        description={module.description}
                        icon={module.icon}
                        level={module.level}
                        progress={userProgress[module.id] || 0}
                        onClick={() => handleModuleSelect(module)}
                      />
                    ))}
                  </SimpleGrid>
                </TabPanel>
                
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {modules
                      .filter(module => module.category === 'vulnerabilities')
                      .map((module) => (
                        <ModuleCard
                          key={module.id}
                          title={module.title}
                          description={module.description}
                          icon={module.icon}
                          level={module.level}
                          progress={userProgress[module.id] || 0}
                          onClick={() => handleModuleSelect(module)}
                        />
                      ))}
                  </SimpleGrid>
                </TabPanel>
                
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {modules
                      .filter(module => module.category === 'best-practices')
                      .map((module) => (
                        <ModuleCard
                          key={module.id}
                          title={module.title}
                          description={module.description}
                          icon={module.icon}
                          level={module.level}
                          progress={userProgress[module.id] || 0}
                          onClick={() => handleModuleSelect(module)}
                        />
                      ))}
                  </SimpleGrid>
                </TabPanel>
                
                <TabPanel>
                  <Certificate completedModules={completedModules} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        ) : (
          <ModuleContent 
            module={selectedModule} 
            onComplete={handleModuleComplete}
            onBack={() => setSelectedModule(null)}
          />
        )}
      </Container>
    </Box>
  );
};

export default LearningModules; 