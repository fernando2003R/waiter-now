import { CustomValidator } from 'express-validator';

/**
 * Validates if a string is a valid CUID
 * CUIDs are 25 characters long and start with 'c'
 * Format: c[a-z0-9]{24}
 */
export const isCuid: CustomValidator = (value: string) => {
  if (typeof value !== 'string') {
    throw new Error('Value must be a string');
  }
  
  // CUID regex pattern: starts with 'c' followed by 24 alphanumeric characters
  const cuidRegex = /^c[a-z0-9]{24}$/;
  
  if (!cuidRegex.test(value)) {
    throw new Error('Invalid CUID format');
  }
  
  return true;
};

/**
 * Express-validator custom validation for CUID
 */
export const validateCuid = (fieldName: string = 'ID') => {
  return {
    custom: isCuid,
    errorMessage: `${fieldName} inválido`
  };
};