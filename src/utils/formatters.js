export const formatCurrency = (amount) => {
  // Handle undefined or null values
  if (amount === undefined || amount === null) {
    return '$0.00';
  }
  
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};