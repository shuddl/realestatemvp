/**
 * Formats a number as a currency string.
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '$0';
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(value);
}

/**
 * Calculates monthly mortgage payment.
 * @param price - Property price
 * @param downPaymentPercent - Down payment percentage (0.2 = 20%)
 * @param interestRate - Annual interest rate (0.07 = 7%)
 * @param loanTermYears - Loan term in years
 * @returns Monthly mortgage payment (principal and interest only)
 */
export function calculateMortgagePayment(
  price: number,
  downPaymentPercent: number = 0.2,
  interestRate: number = 0.07,
  loanTermYears: number = 30
): number {
  const loanAmount = price * (1 - downPaymentPercent);
  const monthlyInterestRate = interestRate / 12;
  const loanTermMonths = loanTermYears * 12;
  
  const mortgagePayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
  
  return Math.round(mortgagePayment);
}

/**
 * Calculates total monthly payment including taxes and insurance.
 * @param price - Property price
 * @param downPaymentPercent - Down payment percentage (0.2 = 20%)
 * @param interestRate - Annual interest rate (0.07 = 7%)
 * @param loanTermYears - Loan term in years
 * @param taxRate - Annual property tax rate (0.01 = 1%)
 * @param insuranceRate - Annual insurance rate (0.005 = 0.5%)
 * @returns Total monthly payment (PITI)
 */
export function calculateMonthlyPayment(
  price: number,
  downPaymentPercent: number = 0.2,
  interestRate: number = 0.07,
  loanTermYears: number = 30,
  taxRate: number = 0.01,
  insuranceRate: number = 0.005
): number {
  const principalAndInterest = calculateMortgagePayment(price, downPaymentPercent, interestRate, loanTermYears);
  const monthlyTaxes = (price * taxRate) / 12;
  const monthlyInsurance = (price * insuranceRate) / 12;
  
  return Math.round(principalAndInterest + monthlyTaxes + monthlyInsurance);
}

/**
 * Truncates text to a specified length and adds ellipsis if needed.
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + '...';
}

/**
 * Formats a date string or timestamp to a readable format.
 */
export function formatDate(date: string | number | Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Formats a number with commas (e.g., 1,000,000).
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Generates a slug from a string.
 */
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}