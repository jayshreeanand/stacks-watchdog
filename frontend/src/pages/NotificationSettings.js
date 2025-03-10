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
  
  // Alert thresholds
  const [thresholds, setThresholds] = useState({
    transactionAmount: 1000,
    riskLevel: 'medium', // low, medium, high
    frequency: 'immediate', // immediate, hourly, daily
  });
  
  // Alert types
  const [alertTypes, setAlertTypes] = useState({
    largeTransactions: true,
    suspiciousContracts: true,
    walletDrainers: true,
    rugPulls: true,
    phishingAttempts: true,
    newApprovals: true,
  });

  // Transaction amount threshold
  const [showTooltip, setShowTooltip] = useState(false);
  const [sliderValue, setSliderValue] = useState(1000);

  const handleChannelToggle = (channel) => {
    setChannels({
      ...channels,
      [channel]: !channels[channel],
    });
  };

  const handleAlertToggle = (alertType) => {
    setAlertTypes({
      ...alertTypes,
      [alertType]: !alertTypes[alertType],
    });
  };

  const handleThresholdChange = (field, value) => {
    setThresholds({
      ...thresholds,
      [field]: value,
    });
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
    handleThresholdChange('transactionAmount', value);
  };

  const handleSaveSettings = () => {
    // Validate email if email notifications are enabled
    if (channels.email && !email) {
      toast({
        title: 'Email required',
        description: 'Please enter an email address to receive email notifications',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // In a real app, we would save these settings to the backend
    toast({
      title: 'Settings saved',
      description: 'Your notification preferences have been updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Notification Settings
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Configure how and when you want to be notified about security events
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Notification Channels */}
          <Card variant="outline" bg={bgColor}>
            <CardHeader>
              <HStack>
                <Icon as={FaBell} color="blue.400" />
                <Heading size="md">Notification Channels</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <HStack>
                    <Icon as={FaEnvelope} color="gray.500" />
                    <FormLabel mb={0}>Email Notifications</FormLabel>
                  </HStack>
                  <Switch 
                    colorScheme="blue" 
                    isChecked={channels.email}
                    onChange={() => handleChannelToggle('email')}
                  />
                </FormControl>
                
                {channels.email && (
                  <FormControl>
                    <Input 
                      placeholder="Enter your email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                )}
                
                <Divider />
                
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <HStack>
                    <Icon as={FaDesktop} color="gray.500" />
                    <FormLabel mb={0}>Browser Notifications</FormLabel>
                  </HStack>
                  <Switch 
                    colorScheme="blue" 
                    isChecked={channels.browser}
                    onChange={() => handleChannelToggle('browser')}
                  />
                </FormControl>
                
                <Divider />
                
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <HStack>
                    <Icon as={FaMobile} color="gray.500" />
                    <FormLabel mb={0}>Mobile Push Notifications</FormLabel>
                  </HStack>
                  <Switch 
                    colorScheme="blue" 
                    isChecked={channels.mobile}
                    onChange={() => handleChannelToggle('mobile')}
                  />
                </FormControl>
                
                <Divider />
                
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <HStack>
                    <Icon as={FaBell} color="gray.500" />
                    <FormLabel mb={0}>Telegram Notifications</FormLabel>
                  </HStack>
                  <Switch 
                    colorScheme="blue" 
                    isChecked={channels.telegram}
                    onChange={() => handleChannelToggle('telegram')}
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          {/* Alert Types */}
          <Card variant="outline" bg={bgColor}>
            <CardHeader>
              <HStack>
                <Icon as={FaShieldAlt} color="blue.400" />
                <Heading size="md">Alert Types</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel mb={0}>Large Transactions</FormLabel>
                  <Switch 
                    colorScheme="blue" 
                    isChecked={alertTypes.largeTransactions}
                    onChange={() => handleAlertToggle('largeTransactions')}
                  />
                </FormControl>
                
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel mb={0}>Suspicious Contracts</FormLabel>
                  <Switch 
                    colorScheme="blue" 
                    isChecked={alertTypes.suspiciousContracts}
                    onChange={() => handleAlertToggle('suspiciousContracts')}
                  />
                </FormControl>
                
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel mb={0}>Wallet Drainers</FormLabel>
                  <Switch 
                    colorScheme="blue" 
                    isChecked={alertTypes.walletDrainers}
                    onChange={() => handleAlertToggle('walletDrainers')}
                  />
                </FormControl>
                
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel mb={0}>Rug Pulls</FormLabel>
                  <Switch 
                    colorScheme="blue" 
                    isChecked={alertTypes.rugPulls}
                    onChange={() => handleAlertToggle('rugPulls')}
                  />
                </FormControl>
                
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel mb={0}>Phishing Attempts</FormLabel>
                  <Switch 
                    colorScheme="blue" 
                    isChecked={alertTypes.phishingAttempts}
                    onChange={() => handleAlertToggle('phishingAttempts')}
                  />
                </FormControl>
                
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel mb={0}>New Token Approvals</FormLabel>
                  <Switch 
                    colorScheme="blue" 
                    isChecked={alertTypes.newApprovals}
                    onChange={() => handleAlertToggle('newApprovals')}
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Thresholds */}
        <Card variant="outline" bg={bgColor}>
          <CardHeader>
            <Heading size="md">Alert Thresholds</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl>
                <FormLabel>Transaction Amount Threshold (S)</FormLabel>
                <Box pt={6} pb={2}>
                  <Slider
                    id="transaction-slider"
                    defaultValue={1000}
                    min={100}
                    max={10000}
                    step={100}
                    onChange={handleSliderChange}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <SliderMark value={100} mt={2} ml={-2.5} fontSize="sm">
                      100
                    </SliderMark>
                    <SliderMark value={5000} mt={2} ml={-2.5} fontSize="sm">
                      5000
                    </SliderMark>
                    <SliderMark value={10000} mt={2} ml={-2.5} fontSize="sm">
                      10000
                    </SliderMark>
                    <SliderTrack>
                      <SliderFilledTrack bg="blue.400" />
                    </SliderTrack>
                    <Tooltip
                      hasArrow
                      bg="blue.500"
                      color="white"
                      placement="top"
                      isOpen={showTooltip}
                      label={`${sliderValue} S`}
                    >
                      <SliderThumb boxSize={6}>
                        <Box color="blue.500" as={FaBell} />
                      </SliderThumb>
                    </Tooltip>
                  </Slider>
                </Box>
                <Flex justify="space-between" mt={2}>
                  <Text>0 S</Text>
                  <Badge colorScheme="blue" p={1} borderRadius="md">
                    {sliderValue} S
                  </Badge>
                  <Text>10,000 S</Text>
                </Flex>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  You will be notified of transactions larger than {sliderValue} S
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Risk Level</FormLabel>
                <Select 
                  value={thresholds.riskLevel}
                  onChange={(e) => handleThresholdChange('riskLevel', e.target.value)}
                >
                  <option value="low">Low (All alerts, including minor risks)</option>
                  <option value="medium">Medium (Moderate and high risk alerts)</option>
                  <option value="high">High (Only high risk alerts)</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Alert Frequency</FormLabel>
                <Select 
                  value={thresholds.frequency}
                  onChange={(e) => handleThresholdChange('frequency', e.target.value)}
                >
                  <option value="immediate">Immediate (As they happen)</option>
                  <option value="hourly">Hourly Digest</option>
                  <option value="daily">Daily Summary</option>
                </Select>
              </FormControl>
            </SimpleGrid>
          </CardBody>
          <CardFooter>
            <Button
              leftIcon={<Icon as={FaSave} />}
              colorScheme="blue"
              onClick={handleSaveSettings}
              width="full"
            >
              Save Notification Settings
            </Button>
          </CardFooter>
        </Card>
      </VStack>
    </Container>
  );
};

export default NotificationSettings; 