import React from 'react';
import { Link, Icon, Flex, Text, Tooltip } from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { getAddressUrl, getTransactionUrl, getTokenUrl, getExplorerUrl } from '../utils/apiService';
import { useDataSource } from '../context/DataSourceContext';

/**
 * BlockExplorerLink component for linking to the Stacks block explorer
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Type of link: 'address', 'transaction', 'token', or 'explorer'
 * @param {string} props.value - The value to link to (address, transaction hash, token address)
 * @param {string} props.label - Optional label to display instead of the value
 * @param {boolean} props.showExternalIcon - Whether to show the external link icon
 * @param {boolean} props.truncate - Whether to truncate the displayed value
 * @param {Object} props.linkProps - Additional props to pass to the Link component
 * @param {Object} props.iconProps - Additional props to pass to the Icon component
 */
const BlockExplorerLink = ({ 
  type = 'address', 
  value, 
  label, 
  showExternalIcon = true,
  truncate = true,
  linkProps = {},
  iconProps = {},
  ...rest
}) => {
  const { dataSource } = useDataSource();
  
  if (!value) return null;
  
  // Get the appropriate URL based on the type
  let url;
  switch (type) {
    case 'address':
      url = getAddressUrl(value);
      break;
    case 'transaction':
    case 'tx':
      url = getTransactionUrl(value);
      break;
    case 'token':
      url = getTokenUrl(value);
      break;
    case 'explorer':
      url = getExplorerUrl();
      break;
    default:
      url = getAddressUrl(value);
  }
  
  // Format the display value if needed
  const displayValue = label || (truncate ? formatValue(value, type) : value);
  
  // Get the network name for the tooltip
  const networkName = dataSource === 'mainnet' ? 'Mainnet' : 'Testnet';
  
  return (
    <Tooltip label={`View on Stacks ${networkName} Explorer`} hasArrow>
      <Flex align="center" display="inline-flex" {...rest}>
        <Link
          href={url}
          isExternal
          color="sonic.400"
          fontWeight="medium"
          _hover={{ textDecoration: 'underline', color: 'sonic.500' }}
          {...linkProps}
        >
          {displayValue}
        </Link>
        {showExternalIcon && (
          <Icon 
            as={FiExternalLink} 
            ml={1} 
            boxSize={3} 
            color="gray.500" 
            _groupHover={{ color: 'sonic.400' }}
            {...iconProps}
          />
        )}
      </Flex>
    </Tooltip>
  );
};

// Helper function to format values for display
const formatValue = (value, type) => {
  if (!value) return '';
  
  // For addresses and tokens, truncate the middle
  if (type === 'address' || type === 'token') {
    return `${value.substring(0, 6)}...${value.substring(value.length - 4)}`;
  }
  
  // For transactions, truncate the end
  if (type === 'transaction' || type === 'tx') {
    return `${value.substring(0, 10)}...`;
  }
  
  return value;
};

export default BlockExplorerLink; 