'use client'

import { useState } from 'react';
import Link from 'next/link';
import {
  nameRegex, addressRegex, mobileRegex, emailRegex, eircodeRegex,
  typeRegex, brandRegex, modelRegex, serialRegex, costRegex,
} from '../lib/validation';

const APPLIANCE_TYPES = [
  'Oven', 
  'Dishwasher', 
  'Refrigerator',
  'Freezer',
  'Microwave',  
  'Vacuum cleaner', 
  'Air conditioner', 
  'Water heater', 
  'Other',
];
//all field are empty
const emptyForm = {
  firstName: '', 
  lastName: '', 
  address: '', 
  mobile: '', 
  email: '', 
  eircode: '',
  applianceType: '', 
  brand: '', 
  model: '', 
  serial: '',
  purchase: '', 
  warranty: '', 
  cost: '',
};

export default function AddPage() {
  const [form,    setForm]    = useState(emptyForm);
  const [errors,  setErrors]  = useState({});
  const [status,  setStatus]  = useState(null);  
  const [loading, setLoading] = useState(false);
}
// clearing error and updating feild
function handleFieldChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }

   function validateForm() {
    const fieldErrors = {};

    if (!nameRegex.test(form.firstName))     
         fieldErrors.firstName = 'First name is not valid, please try again (2-50 characters)';
    if (!nameRegex.test(form.lastName))        
        fieldErrors.lastName = 'Last name is not valid, please try again (2-50 characters)';
    if (!addressRegex.test(form.address))      
        fieldErrors.address = 'Address is not valid, please try again (5–150 characters)';
    if (!mobileRegex.test(form.mobile))        
        fieldErrors.mobile = 'Mobile number is not valid, please try again (080 000 0000)';
    if (!emailRegex.test(form.email))         
         fieldErrors.email = 'Email is not valid, please try again (hello@gmail.com)';
    if (!eircodeRegex.test(form.eircode))      
        fieldErrors.eircode = 'Eircode is not valid, please try again (D00 AB000)';
    if (!typeRegex.test(form.applianceType)) 
        fieldErrors.applianceType = 'Please select a type';
    if (!brandRegex.test(form.brand))          
        fieldErrors.brand = 'Brand is not valid, please try again (1-50 characters)';
    if (!modelRegex.test(form.model)) 
        fieldErrors.model = 'Please enter a valid model number';
    if (!serialRegex.test(form.serial)) 
        fieldErrors.serial = 'Serial number is not valid, please try again';
    if (!form.purchase)                    
        fieldErrors.purchase = 'Please enter the purchase date';
    if (!form.warranty)          
        fieldErrors.warranty = 'Please enter the warranty date';
    if (form.purchase && form.warranty &&
        new Date(form.warranty) <= new Date(form.purchase))
      fieldErrors.warranty = 'Warranty expiry date can`t be earlier than purchase date, please try again';
    if (!costRegex.test(form.cost))           
         fieldErrors.cost = 'Cost is not valid, please try again';
        setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
    }

    //form submission
      async function handleSubmit(e) {
    e.preventDefault();
    //if vallidation fails return;
    if (!validateForm()) 
        return;
     setStatus(null);
    try {
        //POSt rewurst for API
      const response = await fetch('/api/appliances/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      //json response
      const data = await response.json();
   if (response.ok) {
        setStatus({ type: 'success', message: data.message });
        setForm(emptyForm); // reset form on success
      } else {
        setStatus({ 
            type: 'error', message: data.message || 'Failed to add appliance.' });
      }
    } catch {
      setStatus({ 
        type: 'error', message: 'Network error. Please try again.' });
    }
}