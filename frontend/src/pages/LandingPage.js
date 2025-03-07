import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Icon,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { FaShieldAlt, FaSearch, FaExclamationTriangle, FaBell, FaChartLine, FaLock } from 'react-icons/fa';

const Feature = ({ title, text, icon }) => {
  return (
    <Stack
      align={'center'}
      textAlign={'center'}
      p={8}
      rounded={'xl'}
      boxShadow={'lg'}
      bg={useColorModeValue('white', 'gray.800')}
      _hover={{
        transform: 'translateY(-5px)',
        transition: 'all 0.3s ease',
        boxShadow: 'xl',
      }}
    >
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'blue.500'}
        mb={4}
      >
        {icon}
      </Flex>
      <Text fontWeight={600} fontSize={'xl'}>
        {title}
      </Text>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>{text}</Text>
    </Stack>
  );
};

const Testimonial = ({ content, author, role }) => {
  return (
    <Box
      p={8}
      rounded={'xl'}
      boxShadow={'lg'}
      bg={useColorModeValue('white', 'gray.800')}
    >
      <Text fontSize={'md'} mb={4}>
        "{content}"
      </Text>
      <HStack>
        <Text fontWeight={'bold'}>{author}</Text>
        <Text color={useColorModeValue('gray.600', 'gray.400')}>{role}</Text>
      </HStack>
    </Box>
  );
};

const LandingPage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        position="relative"
        overflow="hidden"
      >
        <Container maxW={'7xl'} py={16}>
          <Stack
            align={'center'}
            spacing={{ base: 8, md: 10 }}
            direction={{ base: 'column', md: 'row' }}
            py={{ base: 20, md: 28 }}
          >
            <Stack flex={1} spacing={{ base: 5, md: 10 }}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
              >
                <Text
                  as={'span'}
                  position={'relative'}
                  color={'blue.400'}
                >
                  ETN Watchdog
                </Text>
                <br />
                <Text as={'span'} color={useColorModeValue('gray.900', 'gray.100')}>
                  Blockchain Security Monitoring
                </Text>
              </Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize={'xl'}>
                Protect your assets with real-time blockchain security monitoring. 
                ETN Watchdog detects suspicious transactions, potential rug pulls, 
                and wallet drainers on the Electroneum blockchain.
              </Text>
              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <Button
                  as={RouterLink}
                  to="/app/dashboard"
                  rounded={'full'}
                  size={'lg'}
                  fontWeight={'normal'}
                  px={6}
                  colorScheme={'blue'}
                  bg={'blue.400'}
                  _hover={{ bg: 'blue.500' }}
                >
                  Get Started
                </Button>
                <Button
                  as={RouterLink}
                  to="/app/analyze"
                  rounded={'full'}
                  size={'lg'}
                  fontWeight={'normal'}
                  px={6}
                  variant={'outline'}
                  colorScheme={'blue'}
                >
                  Analyze Contract
                </Button>
              </Stack>
              <HStack spacing={4}>
                <Badge colorScheme="green" fontSize="sm" p={1}>
                  Real-time Monitoring
                </Badge>
                <Badge colorScheme="purple" fontSize="sm" p={1}>
                  AI-Powered Analysis
                </Badge>
                <Badge colorScheme="red" fontSize="sm" p={1}>
                  Threat Detection
                </Badge>
              </HStack>
            </Stack>
            <Flex
              flex={1}
              justify={'center'}
              align={'center'}
              position={'relative'}
              w={'full'}
            >
              <Box
                position={'relative'}
                height={'400px'}
                rounded={'2xl'}
                boxShadow={'2xl'}
                width={'full'}
                overflow={'hidden'}
                bg={'blue.900'}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaShieldAlt} w={40} h={40} color="blue.200" opacity={0.4} />
                <Text
                  position="absolute"
                  fontSize="6xl"
                  fontWeight="bold"
                  color="white"
                  textShadow="0 0 20px rgba(0,0,0,0.5)"
                >
                  SECURE
                </Text>
              </Box>
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bg={useColorModeValue('white', 'gray.800')}>
        <Container maxW={'7xl'}>
          <Heading
            textAlign={'center'}
            fontSize={'4xl'}
            py={10}
            fontWeight={'bold'}
          >
            Key Features
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            <Feature
              icon={<Icon as={FaSearch} w={10} h={10} />}
              title={'Real-time Monitoring'}
              text={'Monitor blockchain transactions in real-time to detect suspicious activity and potential threats.'}
            />
            <Feature
              icon={<Icon as={FaChartLine} w={10} h={10} />}
              title={'AI-Powered Analysis'}
              text={'Leverage artificial intelligence to analyze transactions and contracts for security risks.'}
            />
            <Feature
              icon={<Icon as={FaExclamationTriangle} w={10} h={10} />}
              title={'Rug-Pull Detection'}
              text={'Identify potential rug-pull risks by analyzing token contract code and behavior patterns.'}
            />
            <Feature
              icon={<Icon as={FaLock} w={10} h={10} />}
              title={'Wallet Drainer Detection'}
              text={'Detect malicious contracts designed to drain user wallets through sophisticated techniques.'}
            />
            <Feature
              icon={<Icon as={FaBell} w={10} h={10} />}
              title={'Alert System'}
              text={'Receive real-time alerts through the API and WebSocket connections when threats are detected.'}
            />
            <Feature
              icon={<Icon as={FaShieldAlt} w={10} h={10} />}
              title={'Comprehensive Protection'}
              text={'Get complete security coverage with our integrated monitoring and detection systems.'}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW={'7xl'}>
          <Heading
            textAlign={'center'}
            fontSize={'4xl'}
            py={10}
            fontWeight={'bold'}
          >
            How It Works
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <VStack align={'start'} spacing={5}>
              <Box>
                <Heading size="md" mb={2}>1. Connect Your Wallet</Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                  Securely connect your Electroneum wallet to our platform to start monitoring your transactions.
                </Text>
              </Box>
              <Box>
                <Heading size="md" mb={2}>2. Analyze Contracts</Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                  Submit smart contracts for analysis to detect potential security vulnerabilities before interacting with them.
                </Text>
              </Box>
              <Box>
                <Heading size="md" mb={2}>3. Monitor Transactions</Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                  Our system continuously monitors blockchain transactions to identify suspicious patterns.
                </Text>
              </Box>
              <Box>
                <Heading size="md" mb={2}>4. Receive Alerts</Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                  Get instant notifications when potential threats are detected, allowing you to take immediate action.
                </Text>
              </Box>
            </VStack>
            <Box
              rounded={'xl'}
              boxShadow={'lg'}
              p={8}
              bg={useColorModeValue('white', 'gray.800')}
            >
              <VStack spacing={4} align="stretch">
                <Heading size="md" mb={2}>Security Dashboard</Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')} mb={4}>
                  Our intuitive dashboard provides a comprehensive overview of your security status and recent alerts.
                </Text>
                <Button
                  as={RouterLink}
                  to="/app/dashboard"
                  colorScheme={'blue'}
                  bg={'blue.400'}
                  _hover={{ bg: 'blue.500' }}
                  size="lg"
                  width="full"
                >
                  View Dashboard
                </Button>
              </VStack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box py={20} bg={useColorModeValue('white', 'gray.800')}>
        <Container maxW={'7xl'}>
          <Heading
            textAlign={'center'}
            fontSize={'4xl'}
            py={10}
            fontWeight={'bold'}
          >
            What Users Say
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Testimonial
              content="ETN Watchdog helped me avoid a potential rug pull by alerting me to suspicious contract behavior. This tool is essential for anyone serious about crypto security."
              author="Alex M."
              role="Crypto Investor"
            />
            <Testimonial
              content="The real-time monitoring feature gives me peace of mind. I can now interact with new projects knowing I have an extra layer of security watching over my transactions."
              author="Sarah K."
              role="DeFi Enthusiast"
            />
            <Testimonial
              content="As a developer, I appreciate the detailed contract analysis. It helps me understand potential vulnerabilities in my own code and in contracts I interact with."
              author="Michael T."
              role="Blockchain Developer"
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bg={'blue.500'}>
        <Container maxW={'7xl'}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={10}
            align={'center'}
            justify={'center'}
          >
            <Stack flex={1} spacing={5} align={'center'} textAlign={'center'}>
              <Heading
                color={'white'}
                fontSize={{ base: '3xl', md: '4xl' }}
                fontWeight={'bold'}
              >
                Start Protecting Your Assets Today
              </Heading>
              <Text color={'white'} fontSize={{ base: 'md', md: 'lg' }}>
                Join thousands of users who trust ETN Watchdog to keep their blockchain assets secure.
              </Text>
              <Button
                as={RouterLink}
                to="/app/dashboard"
                rounded={'full'}
                size={'lg'}
                fontWeight={'normal'}
                px={6}
                bg={'white'}
                color={'blue.500'}
                _hover={{ bg: 'gray.100' }}
              >
                Get Started Now
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} color={useColorModeValue('gray.700', 'gray.200')}>
        <Container
          as={Stack}
          maxW={'7xl'}
          py={10}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          <Text>© 2023 ETN Watchdog. All rights reserved</Text>
          <Stack direction={'row'} spacing={6}>
            <Link href={'#'}>Privacy</Link>
            <Link href={'#'}>Terms</Link>
            <Link href={'#'}>Contact</Link>
            <Link href={'#'}>About</Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 