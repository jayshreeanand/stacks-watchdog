import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <Flex h="100vh">
      <Sidebar />
      <Box flex="1" ml={{ base: 0, md: "240px" }} overflow="auto">
        <Navbar />
        <Box as="main" p={4} maxW="1600px" mx="auto">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default Layout; 