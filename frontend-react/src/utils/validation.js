/**
 * Email validation utility functions
 */

/**
 * Validates an email address format
 * @param {string} email - The email address to validate
 * @returns {string} - Empty string if valid, error message if invalid
 */
export const validateEmail = (email) => {
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return 'Email is required';
  }
  
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  // Check for common invalid patterns
  if (email.startsWith('.') || email.endsWith('.') || email.includes('..')) {
    return 'Email address contains invalid characters';
  }
  
  if (email.length > 254) {
    return 'Email address is too long';
  }
  
  // Check for common disposable email domains (optional)
  const disposableDomains = [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'yopmail.com'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (disposableDomains.includes(domain)) {
    return 'Please use a valid email address';
  }
  
  return '';
};

/**
 * Checks if an email is valid (returns boolean)
 * @param {string} email - The email address to check
 * @returns {boolean} - True if valid, false if invalid
 */
export const isEmailValid = (email) => {
  return validateEmail(email) === '';
};

/**
 * Formats an email for display (masks part of the email for privacy)
 * @param {string} email - The email address to format
 * @returns {string} - Formatted email (e.g., "u***@example.com")
 */
export const formatEmailForDisplay = (email) => {
  if (!email || !email.includes('@')) {
    return email;
  }
  
  const [username, domain] = email.split('@');
  if (username.length <= 2) {
    return email;
  }
  
  return `${username.charAt(0)}***@${domain}`;
};
