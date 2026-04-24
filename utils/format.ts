
export const formatNumber = (num: any): string => {
  // Force numeric conversion and handle NaN/falsy values
  let value = typeof num === 'number' ? num : parseFloat(num);
  if (isNaN(value) || value === null || value === undefined) {
    value = 0;
  }
  
  try {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (e) {
    // Fallback for environments where Intl might fail
    return value.toFixed(2);
  }
};
