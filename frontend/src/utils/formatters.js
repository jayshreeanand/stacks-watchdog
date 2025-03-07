/**
 * Format an Ethereum address to a shortened form
 * @param {string} address - The Ethereum address to format
 * @returns {string} The formatted address
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Format a date string to a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Get badge props based on risk level
 * @param {string} riskLevel - The risk level (low, medium, high, critical)
 * @returns {object} The badge props
 */
export const getRiskBadgeProps = (riskLevel) => {
  switch (riskLevel) {
    case 'low':
      return { colorScheme: 'green', children: 'Low' };
    case 'medium':
      return { colorScheme: 'orange', children: 'Medium' };
    case 'high':
      return { colorScheme: 'red', children: 'High' };
    case 'critical':
      return { bg: 'red.900', color: 'white', children: 'Critical' };
    default:
      return { colorScheme: 'gray', children: 'Unknown' };
  }
}; 