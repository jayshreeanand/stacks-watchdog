import React from 'react';
import { Box, Button, Text, VStack, Icon } from '@chakra-ui/react';
import { FaTelegram } from 'react-icons/fa';

const SimpleTelegramConnect = () => {
  const handleConnect = () => {
    alert('Connect Telegram button clicked!');
  };

  return (
    <Box
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      width="100%"
    >
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" fontSize="lg">Simple Telegram Connect</Text>
        
        <Text>
          Connect your Telegram account to receive security alerts.
        </Text>
        
        <Button
          leftIcon={<Icon as={FaTelegram} />}
          colorScheme="telegram"
          onClick={handleConnect}
          size="lg"
        >
          Connect Telegram
        </Button>
      </VStack>
    </Box>
  );
};

export default SimpleTelegramConnect; 