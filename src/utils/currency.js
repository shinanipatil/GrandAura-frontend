/** Format amount in Indian Rupees (INR) */
export function formatINR(amount) {
  const value = parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
