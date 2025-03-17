import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  useToast,
  SimpleGrid,
  Icon,
  Badge,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Input,
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Switch,
} from "@chakra-ui/react";
import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaLock,
  FaSearch,
  FaWallet,
  FaTelegram,
} from "react-icons/fa";
import { FiShield, FiAlertTriangle, FiSearch, FiCode } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import AddressAnalyzer from "../components/AddressAnalyzer";
import BlockExplorerLink from "../components/BlockExplorerLink";
import { useDataSource } from "../context/DataSourceContext";
import apiService from "../utils/apiService";
import axios from "axios";

const SecurityScanner = () => {
  const { account } = useWallet();
  const toast = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [customAddress, setCustomAddress] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [scanOptions, setScanOptions] = useState({
    checkApprovals: true,
    checkTransactions: true,
    checkContracts: true,
    checkPhishing: true,
  });
  const [useRealWalletData, setUseRealWalletData] = useState(true);
  const [sendTelegramNotification, setSendTelegramNotification] =
    useState(true);

  const {
    dataSource,
    getNetworkName,
    useRealWalletData: dataSourceUseRealWalletData,
    toggleRealWalletData,
  } = useDataSource();

  // Move useColorModeValue calls outside of conditional rendering
  const textColor = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("white", "gray.800");

  const handleScan = async () => {
    // Validate if we have an address to scan
    const addressToScan = account || customAddress;

    // Check if we have an address to scan
    if (!addressToScan) {
      toast({
        title: "No address provided",
        description: "Please connect your wallet or enter a custom address to scan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Start scanning
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    setScanResults(null);

    try {
      // Start progress animation
      const interval = setInterval(() => {
        setScanProgress((prevProgress) => {
          const newProgress = prevProgress + 5;
          if (newProgress >= 90) {
            clearInterval(interval);
            return 90; // Hold at 90% until the actual scan completes
          }
          return newProgress;
        });
      }, 200);

      // Perform the actual wallet scan using the API service
      console.log(
        `Scanning wallet address: ${addressToScan} with useRealWalletData: ${useRealWalletData}`
      );

      const results = await apiService.scanWallet(
        addressToScan,
        useRealWalletData
      );

      // Complete the progress bar
      clearInterval(interval);
      setScanProgress(100);

      // Set the scan results
      console.log("Scan results:", results);
      setScanResults(results);
      setScanComplete(true);
      setIsScanning(false);

      // Send wallet scan notification
      try {
        if (sendTelegramNotification) {
          console.log("Sending Telegram notification for wallet scan...");
          await axios.post("/api/notifications/wallet-scan", {
            walletAddress: addressToScan,
            scanType: "Security Scan",
          });
          console.log("Wallet scan notification sent successfully");
        } else {
          console.log("Telegram notification skipped (disabled by user)");
        }
      } catch (notificationError) {
        console.error(
          "Error sending wallet scan notification:",
          notificationError
        );
        // Don't show an error toast for notification failure, as it's not critical to the scan
      }

      // Set tab index to the scan results tab (index 3)
      setTabIndex(3);

      // Show toast notification
      toast({
        title: "Scan complete",
        description: "Wallet scan completed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error during wallet scan:", error);
      setIsScanning(false);
      setScanProgress(0);
      toast({
        title: "Scan failed",
        description:
          error.message || "An error occurred during the wallet scan",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const generateMockResults = (address) => {
    // Generate a more realistic security score based on the address
    const addressSum = address
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const securityScore = Math.max(30, Math.min(95, (addressSum % 65) + 30));

    // Create wallet drainer addresses for reference
    const drainerAddresses = [
      "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      "0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
      "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
      "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    ];

    // Mock security scan results
    const results = {
      address: address,
      scanDate: new Date().toISOString(),
      securityScore: securityScore,
      networkInfo: {
        name: "Stacks Mainnet",
        chainId: "1",
        lastActivity: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      balances: [
        {
          token: "STX",
          balance: (Math.random() * 1000).toFixed(2),
          value: (Math.random() * 10000).toFixed(2),
        },
        {
          token: "USDT",
          balance: (Math.random() * 5000).toFixed(2),
          value: (Math.random() * 5000).toFixed(2),
        },
        {
          token: "WETH",
          balance: (Math.random() * 10).toFixed(4),
          value: (Math.random() * 20000).toFixed(2),
        },
      ],
      walletDrainers: [
        {
          id: "wd1",
          address: drainerAddresses[0],
          name: "SeaPort Exploiter",
          type: "Approval Drainer",
          riskLevel: "critical",
          detectedAt: new Date(2025, 2, 5).toISOString(),
          description:
            "This contract exploits unlimited token approvals to drain assets from wallets. It mimics the SeaPort protocol interface but contains malicious code.",
          indicators: [
            "Requests unlimited token approvals",
            "Contains obfuscated code",
            "Transfers assets to hardcoded addresses",
            "Recently deployed contract with suspicious activity",
          ],
          recommendation:
            "Revoke all approvals to this contract immediately and monitor your wallet for unauthorized transactions.",
        },
        {
          id: "wd2",
          address: drainerAddresses[1],
          name: "S Swap Scam",
          type: "Phishing Drainer",
          riskLevel: "high",
          detectedAt: new Date(2025, 2, 1).toISOString(),
          description:
            "This contract presents itself as a token swap service but contains hidden functions that can steal tokens when approvals are granted.",
          indicators: [
            "Misleading function names",
            "Hidden admin functions",
            "No security audit",
            "Connected to known scam addresses",
          ],
          recommendation:
            "Do not interact with this contract and revoke any existing approvals.",
        },
        {
          id: "wd3",
          address: drainerAddresses[2],
          name: "Flash Loan Exploiter",
          type: "Smart Contract Exploit",
          riskLevel: "high",
          detectedAt: new Date(2025, 1, 26).toISOString(),
          description:
            "This contract uses flash loans to manipulate prices and drain liquidity pools. It has been involved in several DeFi exploits.",
          indicators: [
            "Uses flash loans for price manipulation",
            "Contains reentrancy vulnerabilities",
            "Interacts with multiple DeFi protocols in single transactions",
            "Abnormal gas usage patterns",
          ],
          recommendation:
            "Avoid providing liquidity to pools that interact with this contract.",
        },
        {
          id: "wd4",
          address: drainerAddresses[3],
          name: "NFT Approval Scam",
          type: "NFT Drainer",
          riskLevel: "medium",
          detectedAt: new Date(2025, 1, 20).toISOString(),
          description:
            "This contract requests approvals for NFT collections but transfers them to attacker wallets instead of performing the advertised service.",
          indicators: [
            "Requests approvals for entire NFT collections",
            "Suspicious transfer patterns",
            "Unverified contract code",
            "Connected to known scam websites",
          ],
          recommendation:
            "Revoke NFT approvals and use item-by-item approvals instead of collection-wide approvals.",
        },
        {
          id: "wd5",
          address: drainerAddresses[4],
          name: "Fake Airdrop Distributor",
          type: "Signature Exploiter",
          riskLevel: "medium",
          detectedAt: new Date(2025, 1, 13).toISOString(),
          description:
            "This contract claims to distribute airdrops but tricks users into signing malicious transactions that authorize token transfers.",
          indicators: [
            "Requests signatures for unclear purposes",
            "Misleading transaction data",
            "Unusual permission requests",
            "Links to phishing websites",
          ],
          recommendation:
            "Never sign transactions or messages without understanding exactly what permissions you are granting.",
        },
      ],
      drainerInteractions: [
        {
          id: "di1",
          drainerAddress: drainerAddresses[0],
          drainerName: "SeaPort Exploiter",
          interactionType: "Approval",
          asset: "USDT",
          amount: "Unlimited",
          timestamp: new Date(2025, 2, 5).toISOString(),
          transactionHash: "0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
          riskLevel: "critical",
          status: "Active",
          recommendation:
            "Revoke this approval immediately using a service like revoke.cash",
        },
        {
          id: "di2",
          drainerAddress: drainerAddresses[1],
          drainerName: "S Swap Scam",
          interactionType: "Swap",
          asset: "STX",
          amount: "50",
          timestamp: new Date(2025, 2, 1).toISOString(),
          transactionHash: "0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
          riskLevel: "high",
          status: "Completed",
          recommendation:
            "Monitor your wallet for unauthorized transactions and avoid further interactions",
        },
        {
          id: "di3",
          drainerAddress: drainerAddresses[3],
          drainerName: "NFT Approval Scam",
          interactionType: "NFT Approval",
          asset: "S NFT Collection",
          amount: "All NFTs",
          timestamp: new Date(2025, 1, 23).toISOString(),
          transactionHash: "0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
          riskLevel: "medium",
          status: "Active",
          recommendation:
            "Revoke this approval and use item-by-item approvals in the future",
        },
      ],
      issues: [
        {
          id: 1,
          severity: "high",
          title: "Unlimited Token Approval",
          description: `You have approved unlimited spending for USDT to contract ${address.substring(
            0,
            10
          )}...${address.substring(address.length - 8)}`,
          recommendation:
            "Revoke this approval or set a specific limit using a service like revoke.cash",
          affectedAsset: "USDT",
          detectedAt: new Date(2025, 1, 23).toISOString(),
        },
        {
          id: 2,
          severity: "high",
          title: "Interaction with Flagged Contract",
          description: `You have interacted with a contract flagged for malicious activity: 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063`,
          recommendation:
            "Avoid further interactions with this contract and revoke any approvals",
          affectedAsset: "STX",
          detectedAt: new Date(2025, 2, 3).toISOString(),
        },
        {
          id: 3,
          severity: "medium",
          title: "Unverified Smart Contract Interaction",
          description: `You have interacted with an unverified smart contract at 0x742d35Cc6634C0532925a3b844Bc454e4438f44e`,
          recommendation:
            "Only interact with verified contracts and check their security audits",
          affectedAsset: "Multiple",
          detectedAt: new Date(2025, 1, 16).toISOString(),
        },
        {
          id: 4,
          severity: "medium",
          title: "Vulnerable Transaction Patterns",
          description:
            "Your transaction patterns might make you susceptible to front-running attacks",
          recommendation:
            "Consider using private transactions or transaction batching",
          affectedAsset: "STX",
          detectedAt: new Date(2025, 1, 28).toISOString(),
        },
        {
          id: 5,
          severity: "low",
          title: "Inactive Security Features",
          description:
            "Your wallet has not enabled available security features like multi-signature or time-locks",
          recommendation: "Enable additional security features for your wallet",
          affectedAsset: "Wallet",
          detectedAt: new Date(2025, 1, 8).toISOString(),
        },
        {
          id: 6,
          severity: "low",
          title: "Frequent Small Transactions",
          description:
            "You have many small transactions which may lead to unnecessary gas fees",
          recommendation:
            "Batch transactions when possible to save on gas fees",
          affectedAsset: "STX",
          detectedAt: new Date(2025, 1, 20).toISOString(),
        },
      ],
      recentTransactions: [
        {
          hash: "0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
          type: "Transfer",
          asset: "STX",
          amount: "25.5",
          timestamp: new Date(2025, 2, 6).toISOString(),
          to: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
          status: "Confirmed",
          risk: "low",
        },
        {
          hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
          type: "Approval",
          asset: "USDT",
          amount: "Unlimited",
          timestamp: new Date(2025, 1, 23).toISOString(),
          to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          status: "Confirmed",
          risk: "high",
        },
        {
          hash: "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
          type: "Swap",
          asset: "S → WETH",
          amount: "100 → 0.05",
          timestamp: new Date(2025, 2, 1).toISOString(),
          to: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
          status: "Confirmed",
          risk: "medium",
        },
      ],
      recommendations: [
        "Revoke unnecessary token approvals, especially unlimited approvals",
        "Use hardware wallets like Ledger or Trezor for large holdings",
        "Enable multi-signature for critical operations",
        "Regularly check for phishing attempts and suspicious websites",
        "Monitor your wallet activity with a blockchain explorer",
        "Use a dedicated security tool like Stacks Watchdog AI regularly",
        "Consider using a time-lock for large transactions",
        "Verify smart contract addresses before interacting with them",
        "Keep your private keys secure and never share them",
        "Use different wallets for different purposes (trading, holding, etc.)",
      ],
      securityTips: [
        "Never share your seed phrase or private keys with anyone",
        "Be cautious of phishing attempts via email or social media",
        "Verify all transaction details before confirming",
        "Keep your software and wallet applications updated",
        "Use strong, unique passwords for exchange accounts",
      ],
    };

    // Filter issues based on scan options
    const filteredIssues = results.issues.filter((issue) => {
      if (issue.title.includes("Token Approval") && !scanOptions.checkApprovals)
        return false;
      if (issue.title.includes("Interaction") && !scanOptions.checkTransactions)
        return false;
      if (issue.title.includes("Phishing") && !scanOptions.checkPhishing)
        return false;
      if (issue.title.includes("Contract") && !scanOptions.checkContracts)
        return false;
      return true;
    });

    results.issues = filteredIssues;

    // Log the number of wallet drainers for debugging
    console.log(
      `Number of wallet drainers in mock data: ${results.walletDrainers.length}`
    );

    setScanResults(results);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "yellow";
      default:
        return "green";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "green";
    if (score >= 70) return "yellow";
    return "red";
  };

  const handleOptionChange = (option) => {
    setScanOptions({
      ...scanOptions,
      [option]: !scanOptions[option],
    });
  };

  const handleTelegramNotificationToggle = () => {
    console.log(
      "Toggling Telegram notification from",
      sendTelegramNotification,
      "to",
      !sendTelegramNotification
    );
    setSendTelegramNotification(!sendTelegramNotification);
  };

  const testTelegramNotification = async () => {
    if (!account && !customAddress) {
      toast({
        title: "No address provided",
        description:
          "Please connect your wallet or enter a custom address to test notifications",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const addressToTest = account || customAddress;

    try {
      console.log("Testing Telegram notification for wallet scan...");
      const response = await axios.post(
        "/api/notifications/telegram/test-wallet-scan",
        {
          walletAddress: addressToTest,
        }
      );

      if (response.data.success) {
        toast({
          title: "Test notification sent",
          description: "A test notification has been sent to Telegram",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description:
            response.data.error || "Failed to send test notification",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error testing Telegram notification:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.error || "Failed to send test notification",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Heading as="h1" size="xl" mb={2} color="white">
        Security Scanner
      </Heading>

      <Flex align="center" mb={6}>
        <Text color="gray.400">
          Advanced security tools for the Stacks blockchain
        </Text>
        <BlockExplorerLink
          type="explorer"
          label={`${getNetworkName()} Explorer`}
          linkProps={{
            ml: 4,
            bg: "gray.700",
            px: 3,
            py: 1,
            borderRadius: "md",
            fontSize: "sm",
            _hover: { bg: "gray.600" },
          }}
        />
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
        <Box
          bg="gray.800"
          p={6}
          borderRadius="lg"
          boxShadow="md"
          _hover={{
            transform: "translateY(-5px)",
            transition: "transform 0.3s",
          }}
        >
          <Flex align="center" mb={4}>
            <Icon as={FiShield} boxSize={6} color="sonic.400" mr={3} />
            <Heading as="h2" size="md" color="white">
              Wallet Security Check
            </Heading>
          </Flex>
          <Text color="gray.400" mb={4}>
            Analyze your wallet for security vulnerabilities, suspicious
            approvals, and risky interactions.
          </Text>
          <Button
            onClick={handleScan}
            rightIcon={<FiSearch />}
            colorScheme="sonic"
            variant="outline"
            mb={4}
            isLoading={isScanning}
            loadingText="Scanning"
          >
            Scan Wallet
          </Button>

          <FormControl>
            <Input
              placeholder="Or enter a custom address to scan"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleScan();
                }
              }}
              bg="gray.700"
              border="none"
              _focus={{ borderColor: "sonic.400" }}
              size="sm"
            />
          </FormControl>

          <Flex mt={4} align="center">
            <Checkbox
              isChecked={useRealWalletData}
              onChange={toggleRealWalletData}
              colorScheme="sonic"
              mr={2}
            />
            <Text color="gray.400" fontSize="sm">
              Use real wallet data{" "}
              {dataSource === "mock" ? "(disabled in mock mode)" : ""}
            </Text>
          </Flex>

          <FormControl mt={2} display="flex" alignItems="center">
            <FormLabel
              htmlFor="telegram-notification-switch"
              mb="0"
              color="gray.400"
              fontSize="sm"
              cursor="pointer"
              onClick={handleTelegramNotificationToggle}
              flex="1"
            >
              Send Telegram notification when scan completes
            </FormLabel>
            <Switch
              id="telegram-notification-switch"
              isChecked={sendTelegramNotification}
              onChange={handleTelegramNotificationToggle}
              colorScheme="telegram"
            />
          </FormControl>

          {/* Debug info - remove in production */}
          <Text fontSize="xs" color="gray.500" mt={1}>
            Telegram notifications:{" "}
            {sendTelegramNotification ? "Enabled" : "Disabled"}
          </Text>

          <Button
            mt={2}
            size="sm"
            colorScheme="telegram"
            leftIcon={<FaTelegram />}
            onClick={testTelegramNotification}
          >
            Test Telegram Notification
          </Button>

          {isScanning && (
            <Box mt={4}>
              <Text color="gray.400" fontSize="sm" mb={2}>
                Scanning wallet... {Math.round(scanProgress)}%
              </Text>
              <Progress
                value={scanProgress}
                size="sm"
                colorScheme="sonic"
                borderRadius="md"
                hasStripe
                isAnimated
              />
            </Box>
          )}
        </Box>

        <Box
          bg="gray.800"
          p={6}
          borderRadius="lg"
          boxShadow="md"
          _hover={{
            transform: "translateY(-5px)",
            transition: "transform 0.3s",
          }}
        >
          <Flex align="center" mb={4}>
            <Icon as={FiCode} boxSize={6} color="sonic.400" mr={3} />
            <Heading as="h2" size="md" color="white">
              Smart Contract Analyzer
            </Heading>
          </Flex>
          <Text color="gray.400" mb={4}>
            Analyze smart contracts for security vulnerabilities, rug pull
            risks, and potential exploits.
          </Text>
          <Button
            as={RouterLink}
            to="/app/smart-contract-analyzer"
            rightIcon={<FiCode />}
            colorScheme="sonic"
            variant="outline"
          >
            Analyze Contract
          </Button>
        </Box>
      </SimpleGrid>

      <Tabs
        variant="enclosed"
        colorScheme="sonic"
        id="wallet"
        index={tabIndex}
        onChange={(index) => setTabIndex(index)}
      >
        <TabList>
          <Tab>Address Analyzer</Tab>
          <Tab>Token Approvals</Tab>
          <Tab>Transaction History</Tab>
          {scanComplete && (
            <Tab>
              Scan Results
              <Badge ml={2} colorScheme="green" variant="solid">
                New
              </Badge>
            </Tab>
          )}
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <AddressAnalyzer />
          </TabPanel>

          <TabPanel>
            <Box bg="gray.800" p={6} borderRadius="md">
              <Heading as="h2" size="md" color="white" mb={4}>
                Token Approvals
              </Heading>

              <Text color="gray.400" mb={6}>
                View and manage your token approvals. Revoke unnecessary
                permissions to improve security.
              </Text>

              <Button
                as={RouterLink}
                to="/app/token-approvals"
                rightIcon={<FiAlertTriangle />}
                colorScheme="sonic"
              >
                Manage Approvals
              </Button>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box bg="gray.800" p={6} borderRadius="md">
              <Heading as="h2" size="md" color="white" mb={4}>
                Transaction History Analysis
              </Heading>

              <Text color="gray.400" mb={6}>
                Analyze your transaction history for suspicious patterns and
                potential security risks.
              </Text>

              <Text color="gray.500" fontStyle="italic">
                Connect your wallet to analyze your transaction history.
              </Text>
            </Box>
          </TabPanel>

          {scanComplete && (
            <TabPanel>
              <Box p={4} bg="gray.800" borderRadius="lg" boxShadow="md">
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading as="h3" size="md" color="white">
                    Wallet Security Scan Results
                  </Heading>
                  <Text color="gray.400" fontSize="sm">
                    Address: {scanResults.address}
                  </Text>
                </Flex>
                <Text color="gray.400" fontSize="sm" mb={4}>
                  Scan completed on{" "}
                  {new Date(scanResults.scanDate).toLocaleString()}
                  {scanResults.networkInfo && (
                    <Text as="span" ml={2}>
                      Network: {scanResults.networkInfo.name}{" "}
                      {scanResults.networkInfo.chainId &&
                        `(Chain ID: ${scanResults.networkInfo.chainId})`}
                    </Text>
                  )}
                </Text>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
                  <Stat bg="gray.700" p={4} borderRadius="md">
                    <StatLabel color="gray.400">Security Score</StatLabel>
                    <StatNumber
                      color={getScoreColor(scanResults.securityScore)}
                    >
                      {scanResults.securityScore}/100
                    </StatNumber>
                    <StatHelpText color="gray.400">
                      Overall wallet security
                    </StatHelpText>
                  </Stat>

                  {scanResults.balances && scanResults.balances.length > 0 && (
                    <Stat bg="gray.700" p={4} borderRadius="md">
                      <StatLabel color="gray.400">Wallet Balance</StatLabel>
                      <StatNumber color="white">
                        {scanResults.balances.map((balance, index) => (
                          <Text
                            key={index}
                            fontSize={index === 0 ? "2xl" : "md"}
                          >
                            {balance.balance} {balance.token}
                            {balance.value && (
                              <Text
                                as="span"
                                fontSize="sm"
                                color="gray.400"
                                ml={1}
                              >
                                (${balance.value})
                              </Text>
                            )}
                          </Text>
                        ))}
                      </StatNumber>
                      <StatHelpText color="gray.400">
                        Current holdings
                      </StatHelpText>
                    </Stat>
                  )}

                  <Stat bg="gray.700" p={4} borderRadius="md">
                    <StatLabel color="gray.400">Transaction Count</StatLabel>
                    <StatNumber color="white">
                      {scanResults.transactionCount || "N/A"}
                    </StatNumber>
                    <StatHelpText color="gray.400">
                      Total transactions
                    </StatHelpText>
                  </Stat>
                </SimpleGrid>

                {/* Security Issues Section */}
                {scanResults.issues && scanResults.issues.length > 0 && (
                  <Box mb={6}>
                    <Heading as="h4" size="sm" color="white" mb={3}>
                      Security Issues ({scanResults.issues.length})
                    </Heading>
                    <VStack spacing={3} align="stretch">
                      {scanResults.issues.map((issue) => (
                        <Card key={issue.id} bg="gray.700" variant="filled">
                          <CardHeader pb={2}>
                            <Flex justify="space-between" align="center">
                              <Heading size="xs" color="white">
                                {issue.title}
                              </Heading>
                              <Badge
                                colorScheme={getSeverityColor(issue.severity)}
                              >
                                {issue.severity}
                              </Badge>
                            </Flex>
                          </CardHeader>
                          <CardBody pt={0}>
                            <Text color="gray.400" fontSize="sm">
                              {issue.description}
                            </Text>
                            {issue.recommendation && (
                              <Text color="sonic.300" fontSize="sm" mt={2}>
                                Recommendation: {issue.recommendation}
                              </Text>
                            )}
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>
                  </Box>
                )}

                {/* Recommendations Section */}
                {scanResults.recommendations &&
                  scanResults.recommendations.length > 0 && (
                    <Box mb={6}>
                      <Heading as="h4" size="sm" color="white" mb={3}>
                        Security Recommendations
                      </Heading>
                      <VStack
                        spacing={2}
                        align="stretch"
                        bg="gray.700"
                        p={4}
                        borderRadius="md"
                      >
                        {scanResults.recommendations.map((rec, index) => (
                          <Flex
                            key={index}
                            align="center"
                            mb={
                              index < scanResults.recommendations.length - 1
                                ? 2
                                : 0
                            }
                          >
                            <Icon as={FaCheckCircle} color="green.400" mr={2} />
                            <Text color="gray.300" fontSize="sm">
                              {rec}
                            </Text>
                          </Flex>
                        ))}
                      </VStack>
                    </Box>
                  )}

                {/* Data Source Information */}
                <Alert
                  status="info"
                  variant="subtle"
                  bg="blue.900"
                  color="blue.100"
                  borderRadius="md"
                >
                  <AlertIcon color="blue.200" />
                  <Box>
                    <AlertTitle fontSize="sm">
                      Data Source Information
                    </AlertTitle>
                    <AlertDescription fontSize="xs">
                      This scan was performed using{" "}
                      {scanResults.source || dataSource} data.
                      {dataSource !== "mock"
                        ? " The results reflect actual on-chain data."
                        : " Some data may be simulated for demonstration purposes."}
                    </AlertDescription>
                  </Box>
                </Alert>
              </Box>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SecurityScanner;
