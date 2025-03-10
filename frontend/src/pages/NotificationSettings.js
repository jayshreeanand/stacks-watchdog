import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Switch,
  FormControl,
  FormLabel,
  Input,
  Select,
  Divider,
  useToast,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  Icon,
  Badge,
  useColorModeValue,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
  Flex,
} from '@chakra-ui/react';
import { FaBell, FaEnvelope, FaMobile, FaDesktop, FaShieldAlt, FaSave } from 'react-icons/fa';
import { useWallet } from '../context/WalletContext';
import TelegramConnect from '../components/TelegramConnect';

const NotificationSettings = () => {
  const { account } = useWallet();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  
  // Notification channels
  const [channels, setChannels] = useState({
    email: true,
    browser: true,
    mobile: false,
    telegram: false,
  });

  // Email settings
  const [email, setEmail] = useState('');
  
  // Alert types
  const [alertTypes, setAlertTypes] = useState({
    suspicious_transaction: true,
    rug_pull: true,
    wallet_drainer: true,
    phishing: true,
    security_vulnerability: true,
  });
  
  // Severity threshold
  const [severityThreshold, setSeverityThreshold] = useState(25);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Handle channel toggle
  const handleChannelToggle = (channel) => {
    setChannels({
      ...channels,
      [channel]: !channels[channel],
    });
  };
  
  // Handle alert type toggle
  const handleAlertTypeToggle = (alertType) => {
    setAlertTypes({
      ...alertTypes,
      [alertType]: !alertTypes[alertType],
    });
  };
  
  // Handle email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  
  // Handle severity threshold change
  const handleSeverityChange = (value) => {
    setSeverityThreshold(value);
  };
  
  // Save settings
  const saveSettings = () => {
    // Validate email if email notifications are enabled
    if (channels.email && !validateEmail(email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    // Save settings logic would go here
    // This would typically involve an API call to save the settings
    
    toast({
      title: 'Settings saved',
      description: 'Your notification settings have been saved.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };
  
  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Get severity label
  const getSeverityLabel = (value) => {
    if (value < 25) return 'Low';
    if (value < 50) return 'Medium';
    if (value < 75) return 'High';
    return 'Critical';
  };
  
  // Get severity color
  const getSeverityColor = (value) => {
    if (value < 25) return 'green';
    if (value < 50) return 'yellow';
    if (value < 75) return 'orange';
    return 'red';
  };
  
  // Handle Telegram settings update
  const handleTelegramUpdate = () => {
    // Refresh other settings if needed
    toast({
      title: 'Telegram settings updated',
      description: 'Your Telegram notification settings have been updated.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };
  
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Notification Settings</Heading>
          <Text color="gray.500">
            Configure how and when you want to receive security alerts.
          </Text>
          {/* <Text color="purple.500" fontWeight="bold" mt={2}>
            Debug: Wallet account = {account || 'Not connected'}
          </Text> */}
        </Box>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Telegram Notifications */}
          <TelegramConnect onUpdate={handleTelegramUpdate} />
          
          {/* Email Notifications */}
          <Box p={5} borderWidth="1px" borderRadius="lg" bg={bgColor}>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <HStack>
                  <Icon as={FaEnvelope} color="blue.500" boxSize={6} />
                  <Text fontWeight="bold" fontSize="lg">Email Notifications</Text>
                </HStack>
                <Switch 
                  colorScheme="blue" 
                  isChecked={channels.email} 
                  onChange={() => handleChannelToggle('email')}
                />
              </HStack>
              
              <Divider />
              
              {channels.email && (
                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email} 
                    onChange={handleEmailChange}
                  />
                </FormControl>
              )}
              
              {!channels.email && (
                <Text color="gray.500">
                  Enable email notifications to receive alerts in your inbox.
                </Text>
              )}
            </VStack>
          </Box>
          
          {/* Browser Notifications */}
          <Box p={5} borderWidth="1px" borderRadius="lg" bg={bgColor}>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <HStack>
                  <Icon as={FaDesktop} color="purple.500" boxSize={6} />
                  <Text fontWeight="bold" fontSize="lg">Browser Notifications</Text>
                </HStack>
                <Switch 
                  colorScheme="purple" 
                  isChecked={channels.browser} 
                  onChange={() => handleChannelToggle('browser')}
                />
              </HStack>
              
              <Divider />
              
              {channels.browser && (
                <Text>
                  You will receive notifications in your browser when you have the Sonic Watchdog app open.
                </Text>
              )}
              
              {!channels.browser && (
                <Text color="gray.500">
                  Enable browser notifications to receive alerts while using the app.
                </Text>
              )}
            </VStack>
          </Box>
          
          {/* Mobile Notifications */}
          <Box p={5} borderWidth="1px" borderRadius="lg" bg={bgColor}>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <HStack>
                  <Icon as={FaMobile} color="green.500" boxSize={6} />
                  <Text fontWeight="bold" fontSize="lg">Mobile Notifications</Text>
                </HStack>
                <Switch 
                  colorScheme="green" 
                  isChecked={channels.mobile} 
                  onChange={() => handleChannelToggle('mobile')}
                />
              </HStack>
              
              <Divider />
              
              {channels.mobile && (
                <Text>
                  Download our mobile app to receive push notifications on your device.
                </Text>
              )}
              
              {!channels.mobile && (
                <Text color="gray.500">
                  Enable mobile notifications to receive alerts on your phone or tablet.
                </Text>
              )}
            </VStack>
          </Box>
          
          {/* Alert Types */}
          <Box p={5} borderWidth="1px" borderRadius="lg" bg={bgColor}>
            <VStack spacing={4} align="stretch">
              <HStack>
                <Icon as={FaBell} color="red.500" boxSize={6} />
                <Text fontWeight="bold" fontSize="lg">Alert Types</Text>
              </HStack>
              
              <Divider />
              
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="suspicious-tx" mb="0" flex="1">
                  Suspicious Transactions
                </FormLabel>
                <Switch 
                  id="suspicious-tx" 
                  colorScheme="red" 
                  isChecked={alertTypes.suspicious_transaction} 
                  onChange={() => handleAlertTypeToggle('suspicious_transaction')}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="rug-pull" mb="0" flex="1">
                  Potential Rug Pulls
                </FormLabel>
                <Switch 
                  id="rug-pull" 
                  colorScheme="red" 
                  isChecked={alertTypes.rug_pull} 
                  onChange={() => handleAlertTypeToggle('rug_pull')}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="wallet-drainer" mb="0" flex="1">
                  Wallet Drainers
                </FormLabel>
                <Switch 
                  id="wallet-drainer" 
                  colorScheme="red" 
                  isChecked={alertTypes.wallet_drainer} 
                  onChange={() => handleAlertTypeToggle('wallet_drainer')}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="phishing" mb="0" flex="1">
                  Phishing Attempts
                </FormLabel>
                <Switch 
                  id="phishing" 
                  colorScheme="red" 
                  isChecked={alertTypes.phishing} 
                  onChange={() => handleAlertTypeToggle('phishing')}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="security-vulnerability" mb="0" flex="1">
                  Security Vulnerabilities
                </FormLabel>
                <Switch 
                  id="security-vulnerability" 
                  colorScheme="red" 
                  isChecked={alertTypes.security_vulnerability} 
                  onChange={() => handleAlertTypeToggle('security_vulnerability')}
                />
              </FormControl>
            </VStack>
          </Box>
          
          {/* Severity Threshold */}
          <Box p={5} borderWidth="1px" borderRadius="lg" bg={bgColor}>
            <VStack spacing={4} align="stretch">
              <HStack>
                <Icon as={FaShieldAlt} color="orange.500" boxSize={6} />
                <Text fontWeight="bold" fontSize="lg">Severity Threshold</Text>
              </HStack>
              
              <Divider />
              
              <Text>
                Only receive alerts for issues with severity at or above:
              </Text>
              
              <Box pt={6} pb={2}>
                <Slider
                  id="severity-slider"
                  defaultValue={severityThreshold}
                  min={0}
                  max={100}
                  step={25}
                  onChange={handleSeverityChange}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <SliderMark value={0} mt={2} ml={-2.5} fontSize="sm">
                    Low
                  </SliderMark>
                  <SliderMark value={33} mt={2} ml={-2.5} fontSize="sm">
                    Medium
                  </SliderMark>
                  <SliderMark value={66} mt={2} ml={-2.5} fontSize="sm">
                    High
                  </SliderMark>
                  <SliderMark value={100} mt={2} ml={-2.5} fontSize="sm">
                    Critical
                  </SliderMark>
                  <SliderTrack>
                    <SliderFilledTrack bg={getSeverityColor(severityThreshold) + '.500'} />
                  </SliderTrack>
                  <Tooltip
                    hasArrow
                    bg={getSeverityColor(severityThreshold) + '.500'}
                    color="white"
                    placement="top"
                    isOpen={showTooltip}
                    label={getSeverityLabel(severityThreshold)}
                  >
                    <SliderThumb boxSize={6} />
                  </Tooltip>
                </Slider>
              </Box>
              
              <HStack justify="space-between">
                <Badge colorScheme={getSeverityColor(severityThreshold)}>
                  {getSeverityLabel(severityThreshold)}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  You will only receive alerts for issues with {getSeverityLabel(severityThreshold).toLowerCase()} or higher severity.
                </Text>
              </HStack>
            </VStack>
          </Box>
        </SimpleGrid>
        
        <Flex justify="flex-end">
          <Button
            leftIcon={<FaSave />}
            colorScheme="blue"
            size="lg"
            onClick={saveSettings}
          >
            Save Settings
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
};

export default NotificationSettings; 