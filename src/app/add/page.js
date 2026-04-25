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
      const response = await fetch('/api/add', {
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
        type: 'error', message: 'error. Please try again.' });
    }
  } 
//JSX
  return (
  <div className="option">
    <h1>Add appliance</h1>
        {status && status.type === 'success' && (
        <p>{status.message} <Link href="/">Return to Home</Link></p>)}        {status && status.type === 'error' &&
        (<p>{status.message}</p> )}

    <form onSubmit={handleSubmit}>
      <h2>User</h2>
      <div className="form">
        <div className="input">
          <label>First name</label>
          <input 
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleFieldChange}
            placeholder="Sofiia"
            required
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>

        <div className="input">
          <label>Last name</label>
          <input 
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleFieldChange}
            placeholder="Vedenieva"
            required
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>

        <div className="input">
          <label>Home address</label>
          <input 
            type="text"
            name="address"
            value={form.address}
            onChange={handleFieldChange}
            placeholder="South Circular Road, Dublin 8"
            required
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>

        <div className="input">
          <label>Mobile number</label>
          <input 
            type="tel"
            name="mobile"
            value={form.mobile}
            onChange={handleFieldChange}
            placeholder="080 000 0000"
            required
          />
          {errors.mobile && <span className="error">{errors.mobile}</span>}
        </div>

        <div className="input">
          <label>Eircode</label>
          <input 
            type="text"
            name="eircode"
            value={form.eircode}
            onChange={handleFieldChange}
            placeholder="D00 AB00"
            required
          />
          {errors.eircode && <span className="error">{errors.eircode}</span>}
        </div>

        <div className="input">
          <label>Email address</label>
          <input 
            type="email"
            name="email"
            value={form.email}
            onChange={handleFieldChange}
            placeholder="hello@gmail.com"
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

      </div>

      <h2>Appliance </h2>
      <div className="form">

        <div className="input">
          <label>Appliance type</label>
          <select 
            name="applianceType"
            value={form.applianceType}
            onChange={handleFieldChange}
            required
          >
            <option value="">Select:</option>
            {APPLIANCE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.applianceType && <span className="error">{errors.applianceType}</span>}
        </div>

        <div className="input">
          <label>Brand</label>
          <input 
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleFieldChange}
            placeholder="Lenovo"
            required
          />
          {errors.brand && <span className="error">{errors.brand}</span>}
        </div>

        <div className="input">
          <label>Model number</label>
          <input 
            type="text"
            name="model"
            value={form.model}
            onChange={handleFieldChange}
            placeholder="ABCD12345"
            required
          />
          {errors.model && <span className="error">{errors.model}</span>}
        </div>

        <div className="input">
          <label>Serial Number</label>
          <input 
            type="text"
            name="serial"
            value={form.serial}
            onChange={handleFieldChange}
            placeholder="SAMSUNG-S5"
            required
          />
          {errors.serial && <span className="error">{errors.serial}</span>}
        </div>

        <div className="input">
          <label>Purchase date</label>
          <input 
            type="date"
            name="purchase"
            value={form.purchase}
            onChange={handleFieldChange}
            required
          />
          {errors.purchase && <span className="error">{errors.purchase}</span>}
        </div>

        <div className="input">
          <label>Warranty expiry date</label>
          <input 
            type="date"
            name="warranty"
            value={form.warranty}
            onChange={handleFieldChange}
            required
          />
          {errors.warranty && <span className="error">{errors.warranty}</span>}
        </div>

        <div className="input">
          <label>Cost (€)</label>
          <input 
            type="number"
            step="0.01"
            min="0"
            name="cost"
            value={form.cost}
            onChange={handleFieldChange}
            placeholder="e.g. 599.99"
            required
          />
          {errors.cost && <span className="error">{errors.cost}</span>}
        </div>

      </div>

      <button type="submit">
       <p>submit</p>
      </button>

    </form>

    <Link href="/">Back to home</Link>
  </div>
);
}