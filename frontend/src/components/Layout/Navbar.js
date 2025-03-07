import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  HStack,
  Badge,
} from '@chakra-ui/react';
import {
  FiMenu,
  FiX,
  FiBell,
  FiSettings,
  FiShield,
} from 'react-icons/fi';

const Navbar = () => {
  return (
    <Box
      bg="gray.800"
      px={4}
      borderBottom="1px"
      borderBottomColor="gray.700"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Flex h={16} alignItems={'center'} justifyContent={'flex-end'}>
        <HStack spacing={3}>
          <IconButton
            size="md"
            variant="ghost"
            aria-label="open menu"
            color="gray.400"
            _hover={{ bg: 'gray.700' }}
            icon={<FiBell />}
          />
          <IconButton
            size="md"
            variant="ghost"
            aria-label="open menu"
            color="gray.400"
            _hover={{ bg: 'gray.700' }}
            icon={<FiSettings />}
          />
          <Button
            size="sm"
            rounded="md"
            colorScheme="electroneum"
            leftIcon={<Icon as={FiShield} />}
          >
            Connect Wallet
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar; 