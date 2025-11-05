/**
 * Formatea un número como precio en pesos colombianos
 * @param amount - El monto a formatear
 * @returns String formateado como precio en COP
 */
export const formatCOP = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Convierte un precio de USD a COP (aproximadamente)
 * Tasa de cambio aproximada: 1 USD = 4,000 COP
 * @param usdAmount - Monto en USD
 * @returns Monto convertido a COP
 */
export const convertUSDToCOP = (usdAmount: number): number => {
  const exchangeRate = 4000; // Tasa aproximada USD a COP
  return Math.round(usdAmount * exchangeRate);
};

/**
 * Formatea un precio que originalmente estaba en USD a COP
 * @param usdAmount - Monto original en USD
 * @returns String formateado como precio en COP
 */
export const formatUSDToCOP = (usdAmount: number): string => {
  const copAmount = convertUSDToCOP(usdAmount);
  return formatCOP(copAmount);
};