import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
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
  Divider,
  useDisclosure,
  ScaleFade,
  SlideFade,
  Highlight,
  chakra,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  FaShieldAlt,
  FaSearch,
  FaExclamationTriangle,
  FaBell,
  FaChartLine,
  FaLock,
  FaRocket,
  FaTelegram,
  FaMobile,
  FaUserShield,
  FaCheckCircle,
  FaBookOpen,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";

// Animated components with framer-motion
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);

// Pulse animation for the shield icon
const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
`;

const pulse = `${pulseAnimation} 2s infinite`;

// Feature card component
const Feature = ({
  title,
  text,
  icon,
  delay = 0,
  gradient = "linear(to-r, blue.400, teal.500)",
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      p={8}
      rounded="xl"
      shadow="xl"
      bg={useColorModeValue("white", "gray.800")}
      borderWidth="1px"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "2xl",
        borderColor: "blue.400",
        transition: "all 0.3s ease",
      }}
    >
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        rounded="full"
        mb={5}
        bgGradient={gradient}
      >
        {icon}
      </Flex>
      <Text fontWeight={700} fontSize="xl" mb={2}>
        {title}
      </Text>
      <Text color={useColorModeValue("gray.600", "gray.400")}>{text}</Text>
    </MotionBox>
  );
};

// Stat card component
const StatCard = ({ title, value, icon, increase, delay = 0 }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      p={6}
      rounded="xl"
      shadow="lg"
      bg={useColorModeValue("white", "gray.800")}
      borderWidth="1px"
      borderColor={useColorModeValue("gray.100", "gray.700")}
    >
      <HStack spacing={4}>
        <Flex
          w={12}
          h={12}
          align="center"
          justify="center"
          rounded="full"
          bg="blue.50"
          color="blue.500"
        >
          {icon}
        </Flex>
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.500">
            {title}
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {value}
          </Text>
          {increase && (
            <Stat>
              <StatHelpText>
                <StatArrow type="increase" />
                {increase}
              </StatHelpText>
            </Stat>
          )}
        </Box>
      </HStack>
    </MotionBox>
  );
};

// Testimonial component
const Testimonial = ({ content, author, role, delay = 0 }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      p={8}
      rounded="xl"
      shadow="lg"
      bg={useColorModeValue("white", "gray.800")}
      borderWidth="1px"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      position="relative"
    >
      <Text fontSize="lg" mb={4} fontStyle="italic">
        "{content}"
      </Text>
      <HStack>
        <Box
          w={10}
          h={10}
          rounded="full"
          bg="blue.500"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
        >
          {author.charAt(0)}
        </Box>
        <Box>
          <Text fontWeight="bold">{author}</Text>
          <Text fontSize="sm" color="gray.500">
            {role}
          </Text>
        </Box>
      </HStack>
    </MotionBox>
  );
};

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        bg={useColorModeValue("gray.50", "gray.900")}
        py={20}
      >
        {/* Background gradient */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-br, blue.400, purple.500)"
          opacity={0.05}
          zIndex={0}
        />

        {/* Animated circles */}
        <Box
          position="absolute"
          top="10%"
          left="5%"
          w="300px"
          h="300px"
          rounded="full"
          bgGradient="radial(blue.300, transparent)"
          filter="blur(40px)"
          opacity={0.4}
          zIndex={0}
          transform={`translateY(${scrollY * 0.2}px)`}
          transition="transform 0.1s ease-out"
        />

        <Box
          position="absolute"
          bottom="10%"
          right="5%"
          w="250px"
          h="250px"
          rounded="full"
          bgGradient="radial(purple.300, transparent)"
          filter="blur(40px)"
          opacity={0.3}
          zIndex={0}
          transform={`translateY(${scrollY * -0.1}px)`}
          transition="transform 0.1s ease-out"
        />

        <Container maxW="container.xl" position="relative" zIndex={1}>
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing={{ base: 10, lg: 20 }}
            align="center"
            justify="space-between"
          >
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              flex={1}
            >
              <Badge
                colorScheme="blue"
                fontSize="sm"
                px={3}
                py={1}
                rounded="full"
                mb={6}
                display="inline-block"
              >
                Next-Gen Blockchain Security
              </Badge>

              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="bold"
                lineHeight="shorter"
                mb={6}
              >
                <Text as="span" color="blue.500">
                  Stacks Watchdog AI
                </Text>
                <br />
                <Text as="span">Protecting Your Digital Assets</Text>
              </Heading>

              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={useColorModeValue("gray.600", "gray.400")}
                mb={8}
              >
                Stacks Watchdog AI is an intelligent security agent for the Stacks
                blockchain, employing advanced AI algorithms to monitor
                transactions, analyze smart contracts, and scan for
                vulnerabilities in real-time. It also offers educational modules
                to inform users about common security issues.
              </Text>

              <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                <Button
                  as={RouterLink}
                  to="/app/dashboard"
                  size="lg"
                  colorScheme="blue"
                  fontWeight="bold"
                  px={8}
                  rounded="full"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  bgGradient="linear(to-r, blue.400, blue.500)"
                >
                  Launch App
                </Button>

                <Button
                  as={RouterLink}
                  to="/app/security-scanner"
                  size="lg"
                  variant="outline"
                  colorScheme="blue"
                  fontWeight="bold"
                  px={8}
                  rounded="full"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "md",
                    bg: "blue.50",
                  }}
                  leftIcon={<Icon as={FaSearch} />}
                >
                  Try Scanner
                </Button>
              </Stack>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              flex={1}
              display="flex"
              justifyContent="center"
            >
              <Box
                position="relative"
                w={{ base: "300px", md: "400px" }}
                h={{ base: "300px", md: "400px" }}
              >
                {/* Shield animation */}
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  zIndex={2}
                  animation={pulse}
                >
                  <Icon
                    as={FaShieldAlt}
                    w={{ base: "150px", md: "200px" }}
                    h={{ base: "150px", md: "200px" }}
                    color="blue.500"
                  />
                </Box>

                {/* Circular gradient background */}
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  w="100%"
                  h="100%"
                  rounded="full"
                  bgGradient="radial(blue.100, transparent)"
                  zIndex={1}
                />

                {/* Orbiting elements */}
                <Box
                  position="absolute"
                  top="10%"
                  left="50%"
                  transform={`translateX(-50%) rotate(${scrollY * 0.2}deg)`}
                  transition="transform 0.1s ease-out"
                  zIndex={3}
                >
                  <Icon as={FaSearch} w={10} h={10} color="purple.500" />
                </Box>

                <Box
                  position="absolute"
                  top="50%"
                  left="10%"
                  transform={`translateY(-50%) rotate(${scrollY * 0.2}deg)`}
                  transition="transform 0.1s ease-out"
                  zIndex={3}
                >
                  <Icon as={FaBell} w={10} h={10} color="green.500" />
                </Box>

                <Box
                  position="absolute"
                  bottom="10%"
                  left="50%"
                  transform={`translateX(-50%) rotate(${scrollY * 0.2}deg)`}
                  transition="transform 0.1s ease-out"
                  zIndex={3}
                >
                  <Icon as={FaLock} w={10} h={10} color="red.500" />
                </Box>

                <Box
                  position="absolute"
                  top="50%"
                  right="10%"
                  transform={`translateY(-50%) rotate(${scrollY * 0.2}deg)`}
                  transition="transform 0.1s ease-out"
                  zIndex={3}
                >
                  <Icon as={FaTelegram} w={10} h={10} color="telegram.500" />
                </Box>
              </Box>
            </MotionBox>
          </Stack>
          <Box py={12}></Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bg={useColorModeValue("gray.50", "gray.900")}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Box textAlign="center" maxW="container.md" mx="auto">
              <Badge
                colorScheme="blue"
                fontSize="sm"
                px={3}
                py={1}
                rounded="full"
                mb={3}
              >
                Powerful Features
              </Badge>
              <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }} mb={4}>
                Advanced Security Tools
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={useColorModeValue("gray.600", "gray.400")}
              >
                Stacks Watchdog AI provides a comprehensive suite of security tools
                to protect your blockchain assets.
              </Text>
            </Box>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={10}
              w="full"
            >
              <Feature
                title="Real-time Monitoring"
                text="Continuous monitoring of blockchain transactions to detect suspicious activity as it happens."
                icon={<Icon as={FaChartLine} color="white" w={8} h={8} />}
                delay={0.1}
                gradient="linear(to-r, blue.400, blue.600)"
              />

              <Feature
                title="Wallet Security Scanner"
                text="Deep analysis of wallet interactions to identify potential security risks and vulnerabilities."
                icon={<Icon as={FaSearch} color="white" w={8} h={8} />}
                delay={0.3}
                gradient="linear(to-r, purple.400, purple.600)"
              />
              <Feature
                title="Telegram Alerts"
                text="Instant notifications sent directly to your Telegram when suspicious activity is detected."
                icon={<Icon as={FaTelegram} color="white" w={8} h={8} />}
                delay={0.4}
                gradient="linear(to-r, telegram.400, telegram.600)"
              />
              <Feature
                title="Rug Pull Detection"
                text="Advanced algorithms to identify potential rug pulls before they happen."
                icon={
                  <Icon as={FaExclamationTriangle} color="white" w={8} h={8} />
                }
                delay={0.5}
                gradient="linear(to-r, yellow.400, orange.500)"
              />
              <Feature
                title="Wallet Drainer Protection"
                text="Identify and block malicious contracts designed to drain your wallet."
                icon={<Icon as={FaShieldAlt} color="white" w={8} h={8} />}
                delay={0.6}
                gradient="linear(to-r, red.400, red.600)"
              />
              <Feature
                title="Smart Contract Analysis"
                text="Detailed security analysis of smart contracts to identify vulnerabilities and backdoors."
                icon={<Icon as={FaLock} color="white" w={8} h={8} />}
                delay={0.7}
                gradient="linear(to-r, green.400, green.600)"
              />
              <Feature
                title="Interactive Learning Modules"
                text="Enhance your blockchain security knowledge with interactive tutorials on vulnerabilities and best practices."
                icon={<Icon as={FaBookOpen} color="white" w={8} h={8} />}
                delay={0.2}
                gradient="linear(to-r, purple.400, purple.600)"
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Learning Modules Section */}
      <Box py={20} bg={useColorModeValue("white", "gray.800")}>
        <Container maxW="container.xl">
          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={10}
            alignItems="center"
          >
            <Box>
              <Badge
                colorScheme="purple"
                fontSize="sm"
                px={3}
                py={1}
                rounded="full"
                mb={3}
              >
                Educational Resources
              </Badge>
              <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }} mb={4}>
                Interactive Learning Modules
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={useColorModeValue("gray.600", "gray.400")}
                mb={6}
              >
                Enhance your blockchain security knowledge with our
                comprehensive learning modules. From smart contract
                vulnerabilities to security best practices, our interactive
                tutorials help you stay ahead of potential threats.
              </Text>

              <VStack align="start" spacing={4} mb={8}>
                <HStack>
                  <Icon as={FaCheckCircle} color="green.500" />
                  <Text fontSize="lg">Smart Contract Vulnerabilities</Text>
                </HStack>
                <HStack>
                  <Icon as={FaCheckCircle} color="green.500" />
                  <Text fontSize="lg">Security Best Practices</Text>
                </HStack>
                <HStack>
                  <Icon as={FaCheckCircle} color="green.500" />
                  <Text fontSize="lg">Access Control Patterns</Text>
                </HStack>
                <HStack>
                  <Icon as={FaCheckCircle} color="green.500" />
                  <Text fontSize="lg">DeFi Security Fundamentals</Text>
                </HStack>
                <HStack>
                  <Icon as={FaCheckCircle} color="green.500" />
                  <Text fontSize="lg">AI-Driven Vulnerability Detection</Text>
                </HStack>
              </VStack>

              <Button
                as={RouterLink}
                to="/app/learning-modules"
                size="lg"
                colorScheme="purple"
                rightIcon={<Icon as={FaArrowRight} />}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
              >
                Start Learning
              </Button>
            </Box>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                position="relative"
                height="400px"
                rounded="2xl"
                boxShadow="2xl"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg="purple.500"
                  opacity={0.8}
                  roundedTop="2xl"
                />

                <VStack
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  justify="center"
                  p={8}
                  spacing={6}
                >
                  <Icon as={FaBookOpen} color="white" w={16} h={16} />
                  <Heading color="white" textAlign="center">
                    Learn. Secure. Protect.
                  </Heading>
                  <Text color="white" fontSize="lg" textAlign="center">
                    Our interactive modules provide practical knowledge to help
                    you secure your blockchain assets.
                  </Text>

                  <HStack spacing={4}>
                    <Badge
                      colorScheme="green"
                      px={3}
                      py={2}
                      rounded="full"
                      fontSize="md"
                    >
                      Beginner
                    </Badge>
                    <Badge
                      colorScheme="blue"
                      px={3}
                      py={2}
                      rounded="full"
                      fontSize="md"
                    >
                      Intermediate
                    </Badge>
                    <Badge
                      colorScheme="purple"
                      px={3}
                      py={2}
                      rounded="full"
                      fontSize="md"
                    >
                      Advanced
                    </Badge>
                  </HStack>
                </VStack>
              </Box>
            </MotionBox>
          </SimpleGrid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={20} bg={useColorModeValue("white", "gray.800")}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <Box textAlign="center" maxW="container.md" mx="auto">
              <Badge
                colorScheme="blue"
                fontSize="sm"
                px={3}
                py={1}
                rounded="full"
                mb={3}
              >
                Simple Process
              </Badge>
              <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }} mb={4}>
                How Stacks Watchdog AI Works
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={useColorModeValue("gray.600", "gray.400")}
              >
                Protecting your assets has never been easier with our
                streamlined security process.
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
              <VStack spacing={6} align="center" textAlign="center">
                <Flex
                  w={20}
                  h={20}
                  align="center"
                  justify="center"
                  color="white"
                  rounded="full"
                  bg="blue.500"
                  fontSize="4xl"
                  fontWeight="bold"
                >
                  1
                </Flex>
                <Heading as="h3" fontSize="xl">
                  Connect Your Wallet
                </Heading>
                <Text color={useColorModeValue("gray.600", "gray.400")}>
                  Link your wallet to Stacks Watchdog AI to enable comprehensive
                  security monitoring.
                </Text>
              </VStack>

              <VStack spacing={6} align="center" textAlign="center">
                <Flex
                  w={20}
                  h={20}
                  align="center"
                  justify="center"
                  color="white"
                  rounded="full"
                  bg="purple.500"
                  fontSize="4xl"
                  fontWeight="bold"
                >
                  2
                </Flex>
                <Heading as="h3" fontSize="xl">
                  Set Up Alerts
                </Heading>
                <Text color={useColorModeValue("gray.600", "gray.400")}>
                  Configure your notification preferences including Telegram
                  alerts for real-time updates.
                </Text>
              </VStack>

              <VStack spacing={6} align="center" textAlign="center">
                <Flex
                  w={20}
                  h={20}
                  align="center"
                  justify="center"
                  color="white"
                  rounded="full"
                  bg="green.500"
                  fontSize="4xl"
                  fontWeight="bold"
                >
                  3
                </Flex>
                <Heading as="h3" fontSize="xl">
                  Stay Protected
                </Heading>
                <Text color={useColorModeValue("gray.600", "gray.400")}>
                  Receive instant alerts about potential threats and take action
                  to secure your assets.
                </Text>
              </VStack>
            </SimpleGrid>

            <Button
              as={RouterLink}
              to="/app/dashboard"
              size="lg"
              colorScheme="blue"
              fontWeight="bold"
              px={8}
              rounded="full"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
            >
              Get Started Now
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} position="relative" overflow="hidden">
        {/* Background gradient */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-r, blue.600, purple.600)"
          opacity={0.9}
          zIndex={0}
        />

        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={8} textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              color="white"
              fontWeight="bold"
            >
              Protect Your Digital Assets Today
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="whiteAlpha.900"
              maxW="container.md"
            >
              Join thousands of users who trust Stacks Watchdog AI to secure their
              blockchain investments. Get started now and experience next-level
              security.
            </Text>
            <Button
              as={RouterLink}
              to="/app/dashboard"
              size="lg"
              colorScheme="white"
              color="blue.600"
              fontWeight="bold"
              px={10}
              py={7}
              rounded="full"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              fontSize="xl"
            >
              Launch Stacks Watchdog AI
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg={useColorModeValue("gray.900", "gray.900")} color="white" py={10}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
            <VStack align="start" spacing={4}>
              <Heading size="md">Stacks Watchdog AI</Heading>
              <Text color="whiteAlpha.700">
                Next-generation blockchain security powered by artificial
                intelligence.
              </Text>
            </VStack>

            <VStack align="start" spacing={4}>
              <Heading size="md">Features</Heading>
              <Link
                as={RouterLink}
                to="/app/security-scanner"
                color="whiteAlpha.700"
              >
                Security Scanner
              </Link>
              <Link
                as={RouterLink}
                to="/app/wallet-drainers"
                color="whiteAlpha.700"
              >
                Wallet Drainer Detection
              </Link>
              <Link as={RouterLink} to="/app/analyze" color="whiteAlpha.700">
                Smart Contract Analysis
              </Link>
            </VStack>

            <VStack align="start" spacing={4}>
              <Heading size="md">Resources</Heading>
              <Link href="#" color="whiteAlpha.700">
                Documentation
              </Link>
              <Link href="#" color="whiteAlpha.700">
                API
              </Link>
              <Link href="#" color="whiteAlpha.700">
                Blog
              </Link>
            </VStack>

            <VStack align="start" spacing={4}>
              <Heading size="md">Connect</Heading>
              <Link href="#" color="whiteAlpha.700">
                Twitter
              </Link>
              <Link href="#" color="whiteAlpha.700">
                Discord
              </Link>
              <Link href="#" color="whiteAlpha.700">
                Telegram
              </Link>
            </VStack>
          </SimpleGrid>

          <Divider my={8} borderColor="whiteAlpha.300" />

          <Text textAlign="center" color="whiteAlpha.600">
            © {new Date().getFullYear()} Stacks Watchdog AI. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
