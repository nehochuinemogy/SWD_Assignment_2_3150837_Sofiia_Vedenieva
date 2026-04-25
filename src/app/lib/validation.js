//user info validation

//validation for name
export const nameRegex = /^[A-Za-z\s'-]{2,50}$/;

//validation for address
export const addressRegex = /^[A-Za-z0-9\s,.-]{5,150}$/;

//validation for irish mobile number
export const numberRegex = /^(\+353|0)(8[3-9])\d{7}$/;

//validatioon for email
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//calidation for eircode
export const eircodeRegex = /^[A-Z0-9]{3}\s[A-Z0-9]{4}$/;

//appliance info validation 

//validation for appliance type
export const typeRegex = /^[A-Za-z\s]{2,50}$/;

//validation for brand
export const brandRegex = /^[A-Za-z0-9\s\-&.]{1,50}$/;

//model validaton
export const modelRegex = /^[A-Za-z0-9\s,.-]{5,150}$/;

//validation for serial number
export const serialRegex = /^[A-Za-z0-9\-_]{3,50}$/;

//cost validation
export const costRegex = /^\d{1,7}(\.\d{1,2})?$/;

//function for validation
export function checkUser(data) {
  if (!nameRegex.test(data.firstName))
    return { valid: false, message: 'First name is not valid, please try again' };
  if (!nameRegex.test(data.lastName))
    return { valid: false, message: 'First name is not valid, please try again' };
  if (!addressRegex.test(data.address))
    return { valid: false, message: 'Address is not valid, please try again' };
  if (!numberRegex.test(data.mobile))
    return { valid: false, message: 'Mobile number is not valid, please try again' };
  if (!emailRegex.test(data.email))
    return { valid: false, message: 'Email address is not valid, please try again' };
  if (!eircodeRegex.test(data.eircode))
    return { valid: false, message: 'Eircode is not vaalid ,please try again' };
  return { valid: true };
}

//checking all appliance fields
export function checkAppliance(data) {
  if (!typeRegex.test(data.applianceType))
    return { valid: false, message: 'Appliance type is not valid, please try again' };
  if (!brandRegex.test(data.brand))
    return { valid: false, message: 'Brand name is not valid, please try again' };
  if (!modelRegex.test(data.model))
    return { valid: false, message: 'Model number is not valid, please try again' };
  if (!serialRegex.test(data.serial))
    return { valid: false, message: 'Serial number is not valid , please try again' };
  if (!data.purchase)
    return { valid: false, message: 'Please enter the purchase date' };
  if (!data.warranty)
    return { valid: false, message: 'Please enter the warranty expiry date' };
  if (new Date(data.warranty) <= new Date(data.purchase))
    return { valid: false, message: 'Warranty expiry date can`t be earlier than purchase date, please try again' };
  if (!costRegex.test(String(data.cost)))
    return { valid: false, message: 'Cost is not valid, please try again' };
  return { valid: true };
}

// Preventing XSS attcks by removing HTML tags and triming whitespace 
export function cleanInput(value) {
  if (typeof value !== 'string') return value;
  return value
    .trim()
    .replace(/<[^>]*>/g, '')   // html tags
    .replace(/['\"\\]/g, '');  // backslashes
}