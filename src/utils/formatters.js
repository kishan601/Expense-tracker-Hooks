export const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};

export const getCategoryKey = (category) => {
  return category.toLowerCase();
};