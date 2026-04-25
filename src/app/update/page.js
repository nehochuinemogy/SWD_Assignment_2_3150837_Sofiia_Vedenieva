'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  nameRegex, addressRegex, mobileRegex, emailRegex, eircodeRegex,
  typeRegex, brandRegex, modelRegex, serialRegex, costRegex,
} from '../lib/validation';

const APPLIANCE_TYPES = [
  'Oven', 'Dishwasher', 'Refrigerator', 'Freezer', 'Microwave',
  'Vacuum cleaner', 'Air conditioner', 'Water heater', 'Other',
];

export default function UpdatePage() {
  //searching serial number
  const [serialInput,   setSerialInput]   = useState('');
  const [searchError,   setSearchError]   = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Editing form
  const [form,          setForm]          = useState(null);
  const [errors,        setErrors]        = useState({});
  const [status,        setStatus]        = useState(null);

  //finding applaince
  async function handleLookup(e) {
    e.preventDefault();

    if (!serialRegex.test(serialInput)) {
      setSearchError('Serial number invalid (3–50 characters)');
      return;
    }

    setSearchError('');

    try {
      const response = await fetch(
        `/api/search?serial=${encodeURIComponent(serialInput)}`
      );
      const data = await response.json();

      if (response.ok && data.appliance) {
        const a = data.appliance;
        //pre filling form 
        setForm({
          applianceID:   a.ApplianceID,
          userID:        a.UserID,
          serial:        a.SerialNumber,
          applianceType: a.ApplianceType,
          brand:         a.Brand,
          model:         a.ModelNumber,
          purchase:      a.PurchaseDate?.split('T')[0] || '',
          warranty:      a.WarrantyExpirationDate?.split('T')[0] || '',
          cost:          a.Cost,
          firstName:     a.FirstName,
          lastName:      a.LastName,
          address:       a.Address,
          mobile:        a.Mobile,
          email:         a.Email,
          eircode:       a.Eircode,
        });
      } else {
        setSearchError('Appliance not found');
      }
    } catch {
      setSearchError('Error. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  }

  // update one field and clear its error
  function handleFieldChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }

  //client side validation
  function validateForm() {
    const fieldErrors = {};

    if (!nameRegex.test(form.firstName))
      fieldErrors.firstName = 'First name is not valid, please try again';
    if (!nameRegex.test(form.lastName))
      fieldErrors.lastName = 'Last name is not valid, please try again';
    if (!addressRegex.test(form.address))
      fieldErrors.address = 'Address is not valid, please try again';
    if (!mobileRegex.test(form.mobile))
      fieldErrors.mobile = 'Mobile number is not valid, please try again';
    if (!emailRegex.test(form.email))
      fieldErrors.email = 'Email is not valid, please try again';
    if (!eircodeRegex.test(form.eircode))
      fieldErrors.eircode = 'Eircode is not valid, please try again';
    if (!typeRegex.test(form.applianceType))
      fieldErrors.applianceType = 'Please select a type';
    if (!brandRegex.test(form.brand))
      fieldErrors.brand = 'Brand is not valid, please try again';
    if (!modelRegex.test(form.model))
      fieldErrors.model = 'Please enter a valid model number';
    if (!form.purchase)
      fieldErrors.purchase = 'Please enter the purchase date';
    if (!form.warranty)
      fieldErrors.warranty = 'Please enter the warranty date';
    if (form.purchase && form.warranty &&
        new Date(form.warranty) <= new Date(form.purchase))
      fieldErrors.warranty = "Warranty can't be earlier than purchase date";
    if (!costRegex.test(String(form.cost)))
      fieldErrors.cost = 'Cost is not valid, please try again';

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  }

  // sending data
  async function handleUpdate(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      //status messages
      if (response.ok) {
        setStatus({ type: 'success', message: data.message });
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch {
      setStatus({ type: 'error', message: 'Error. Please try again.' });
    } 
  }

}