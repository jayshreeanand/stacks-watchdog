import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  useToast,
  Code,
  Badge,
  Flex,
  Icon,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useClipboard,
  useColorModeValue,
  Spinner,
  Link,
} from '@chakra-ui/react';
import { FaTelegram, FaCheck, FaTimes, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';
import { useWallet } from '../context/WalletContext';
import axios from 'axios';

// API key from environment
const API_KEY = process.env.REACT_APP_API_KEY || 'your_api_key_for_security';

// API instance with API key
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Temporarily disable API key for testing
    // 'x-api-key': API_KEY
  }
});

const TelegramConnect = ({ onUpdate }) => {
  console.log('TelegramConnect component rendered');
  const { account } = useWallet();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const [loading, setLoading] = useState(false);
  const [telegramSettings, setTelegramSettings] = useState({
    enabled: false,
    chatId: '',
    username: '',
  });
  const [connectionCode, setConnectionCode] = useState('');
  const [connectionInstructions, setConnectionInstructions] = useState('');
  const [botUsername, setBotUsername] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  
  const { hasCopied, onCopy } = useClipboard(connectionCode ? `/connect ${connectionCode}` : '');
  
  // Fetch Telegram settings on component mount
  useEffect(() => {
    if (account) {
      fetchTelegramSettings();
    }
  }, [account]);
  
  // Fetch Telegram settings from the API
  const fetchTelegramSettings = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/notifications/settings/${account}`);
      if (response.data && response.data.notifications && response.data.notifications.telegram) {
        setTelegramSettings(response.data.notifications.telegram);
      }
    } catch (error) {
      console.error('Error fetching Telegram settings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Generate a connection code
  const generateConnectionCode = async () => {
    console.log('generateConnectionCode called');
    alert('Generate Connection Code function called!');
    
    if (!account) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet first.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post(`/notifications/telegram/connect`, { userId: account });
      
      if (response.data && response.data.success) {
        setConnectionCode(response.data.code);
        setConnectionInstructions(response.data.instructions);
        setBotUsername(response.data.botUsername || 'SonicWatchdogBot');
        setShowAlert(true);
        
        // Auto-refresh status after 1 minute
        setTimeout(() => {
          fetchTelegramSettings();
        }, 60000);
      } else {
        toast({
          title: 'Error',
          description: response.data.error || 'Failed to generate connection code',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error generating connection code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate connection code. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Disconnect Telegram
  const disconnectTelegram = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      const response = await api.post(`/notifications/telegram/disconnect`, { userId: account });
      
      if (response.data && response.data.success) {
        setTelegramSettings({
          enabled: false,
          chatId: '',
          username: '',
        });
        
        toast({
          title: 'Telegram disconnected',
          description: 'Your Telegram account has been disconnected.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Notify parent component
        if (onUpdate) onUpdate();
      } else {
        toast({
          title: 'Error',
          description: response.data.error || 'Failed to disconnect Telegram',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error disconnecting Telegram:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect Telegram. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Test Telegram connection
  const testConnection = async () => {
    if (!account || !telegramSettings.enabled) return;
    
    setLoading(true);
    try {
      const response = await api.post(`/notifications/telegram/test`, { userId: account });
      
      if (response.data && response.data.success) {
        toast({
          title: 'Test message sent',
          description: 'A test message has been sent to your Telegram account.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: response.data.error || 'Failed to send test message',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error testing Telegram connection:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test message. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      bg={bgColor}
      borderColor={borderColor}
      width="100%"
    >
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <HStack>
            <Icon as={FaTelegram} color="telegram.500" boxSize={6} />
            <Text fontWeight="bold" fontSize="lg">Telegram Notifications</Text>
          </HStack>
          
          {telegramSettings.enabled ? (
            <Badge colorScheme="green" px={2} py={1} borderRadius="md">
              <Flex align="center">
                <Icon as={FaCheck} mr={1} />
                Connected
              </Flex>
            </Badge>
          ) : (
            <Badge colorScheme="gray" px={2} py={1} borderRadius="md">
              <Flex align="center">
                <Icon as={FaTimes} mr={1} />
                Not Connected
              </Flex>
            </Badge>
          )}
        </HStack>
        
        <Divider />
        
        <Text color="purple.500" fontWeight="bold">
          Debug: Wallet account = {account || 'Not connected'}
        </Text>
        
        <Box bg="yellow.100" p={4} borderRadius="md">
          <Text color="black" fontWeight="bold">
            Direct button test:
          </Text>
          <Button
            mt={2}
            colorScheme="red"
            onClick={() => alert('Button clicked!')}
          >
            Test Button
          </Button>
        </Box>
        
        {showAlert && connectionCode && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle mb={1}>Connect your Telegram account</AlertTitle>
              <AlertDescription display="block">
                <Text mb={2}>
                  1. Open Telegram and search for <Code>@{botUsername}</Code>
                </Text>
                <Text mb={2}>
                  2. Start a chat with the bot by clicking "Start"
                </Text>
                <Text mb={2}>
                  3. Send the following command to the bot:
                </Text>
                <Flex mb={2} align="center">
                  <Code p={2} borderRadius="md" fontSize="sm" width="100%">
                    /connect {connectionCode}
                  </Code>
                  <Button
                    size="sm"
                    ml={2}
                    onClick={onCopy}
                    leftIcon={<FaCopy />}
                    colorScheme="blue"
                    variant="outline"
                  >
                    {hasCopied ? 'Copied' : 'Copy'}
                  </Button>
                </Flex>
                <Text fontSize="sm" color="gray.500">
                  This code will expire in 10 minutes.
                </Text>
              </AlertDescription>
            </Box>
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={() => setShowAlert(false)}
            />
          </Alert>
        )}
        
        {telegramSettings.enabled ? (
          <VStack spacing={4} align="stretch">
            <Text>
              You are receiving Telegram notifications at{' '}
              {telegramSettings.username ? (
                <Link
                  href={`https://t.me/${telegramSettings.username}`}
                  isExternal
                  color="telegram.500"
                >
                  @{telegramSettings.username} <Icon as={FaExternalLinkAlt} boxSize={3} mx="2px" />
                </Link>
              ) : (
                'your connected Telegram account'
              )}
              .
            </Text>
            
            <HStack spacing={4}>
              <Button
                leftIcon={<FaTelegram />}
                colorScheme="telegram"
                onClick={testConnection}
                isLoading={loading}
                loadingText="Sending..."
              >
                Send Test Message
              </Button>
              
              <Button
                colorScheme="red"
                variant="outline"
                onClick={disconnectTelegram}
                isLoading={loading}
                loadingText="Disconnecting..."
              >
                Disconnect Telegram
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack spacing={4} align="stretch">
            <Text>
              Connect your Telegram account to receive real-time security alerts about suspicious transactions,
              potential rug pulls, and wallet drainers.
            </Text>
            
            <Text color="red.500" fontWeight="bold">
              Debug: telegramSettings.enabled = {String(telegramSettings.enabled)}
            </Text>
            
            {/* Regular button */}
            <Button
              leftIcon={<FaTelegram />}
              colorScheme="telegram"
              onClick={generateConnectionCode}
              isLoading={loading}
              loadingText="Generating code..."
              size="lg"
              width="100%"
              height="60px"
              fontSize="xl"
              position="relative"
              zIndex={10}
            >
              Connect Telegram
            </Button>
            
            {/* Fallback button with different styling */}
            <Button
              mt={4}
              leftIcon={<FaTelegram />}
              colorScheme="red"
              onClick={generateConnectionCode}
              isLoading={loading}
              loadingText="Generating code..."
              position="relative"
              zIndex={10}
            >
              FALLBACK: Connect Telegram
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default TelegramConnect; 