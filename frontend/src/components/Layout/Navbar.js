import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  HStack,
  Badge,
  useToast,
} from '@chakra-ui/react';
import {
  FiBell,
  FiSettings,
  FiShield,
  FiUser,
  FiLogOut,
  FiCopy,
  FiExternalLink,
} from 'react-icons/fi';
import { useWallet } from '../../context/WalletContext';

const Navbar = () => {
  const { account, isConnecting, connectWallet, disconnectWallet, formatAddress } = useWallet();
  const toast = useToast();

  // Copy address to clipboard
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast({
        title: 'Address copied',
        description: 'Wallet address copied to clipboard',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // View address in explorer
  const viewInExplorer = () => {
    if (account) {
      window.open(`https://explorer.stacks.co/address/${account}`, '_blank');
    }
  };

  // Handle wallet connection with error handling
  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: 'Wallet connected',
        description: 'Your Stacks wallet has been connected successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: error.message || 'Failed to connect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle wallet disconnection
  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
      toast({
        title: 'Wallet disconnected',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Disconnection failed',
        description: error.message || 'Failed to disconnect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleViewOnExplorer = () => {
    if (!account) return;
    window.open(`https://explorer.stacks.co/address/${account}`, '_blank');
  };

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
            aria-label="notifications"
            color="gray.400"
            _hover={{ bg: 'gray.700' }}
            icon={<FiBell />}
          />
          <IconButton
            size="md"
            variant="ghost"
            aria-label="settings"
            color="gray.400"
            _hover={{ bg: 'gray.700' }}
            icon={<FiSettings />}
          />
          
          {account ? (
            <Menu>
              <MenuButton
                as={Button}
                size="sm"
                rounded="md"
                colorScheme="sonic"
                leftIcon={<Icon as={FiUser} />}
              >
                {formatAddress(account)}
              </MenuButton>
              <MenuList bg="gray.800" borderColor="gray.700">
                <MenuItem 
                  icon={<FiCopy />} 
                  onClick={copyAddress}
                  _hover={{ bg: 'gray.700' }}
                >
                  Copy Address
                </MenuItem>
                <MenuItem 
                  icon={<FiExternalLink />} 
                  onClick={viewInExplorer}
                  _hover={{ bg: 'gray.700' }}
                >
                  View in Explorer
                </MenuItem>
                <MenuDivider borderColor="gray.700" />
                <MenuItem 
                  icon={<FiLogOut />} 
                  onClick={handleDisconnectWallet}
                  _hover={{ bg: 'gray.700' }}
                >
                  Disconnect
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                colorScheme="sonic"
                leftIcon={<Icon as={FiShield} />}
              >
                Connect Wallet
              </MenuButton>
              <MenuList>
                <MenuItem
                  colorScheme="sonic"
                  onClick={handleConnectWallet}
                  isLoading={isConnecting}
                  loadingText="Connecting"
                >
                  Connect Wallet
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar; 