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
  const [serialInput,   setSerialInput]   = useState('');
  const [searchError,   setSearchError]   = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const [form,          setForm]          = useState(null);
  const [errors,        setErrors]        = useState({});
  const [status,        setStatus]        = useState(null);

  //searching appliance by serial num
  async function handleLookup(e) {
    e.preventDefault();

    //validating serial number
    if (!serialRegex.test(serialInput)) {
      setSearchError('Serial number invalid (3–50 characters)');
      return;
    }

    setSearchError('');

    try {
      //API call to search for appliance
      const response = await fetch(
        `/api/search?serial=${encodeURIComponent(serialInput)}`
      );
      const data = await response.json();

      //ia appliance found populating form
      if (response.ok && data.appliance) {
        const a = data.appliance;
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
    } 
  }

  //handling form
  function handleFieldChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
//validation form
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

    //sending updated appliacne data 
  async function handleUpdate(e) {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus(null);

    //sending put request
    try {
      const response = await fetch('/api/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: data.message });
      } else {
        setStatus({ type: 'error', message: data.message });
      }
  }catch {
    setStatus({ type: 'error', message: 'Error. Please try again.' });
  }
}

  return (
    <div className="option">
      <h1>Update appliance</h1>
      {/*Searching form */}
        <form onSubmit={handleLookup}>
          <div className="input">
            <label>Serial number</label>
            <input
              type="text"
              value={serialInput}
              onChange={(e) => { 
                setSerialInput(e.target.value); 
                setSearchError(''); 
              }}
              placeholder="SAMSUNG-S5"
              required
            />
            {/* Error*/}
            {searchError && <span className="error">{searchError}</span>}
          </div>
          <button type="submit">
            <p>Submit</p>
          </button>
        </form>

        <>
          {/* status message  */}
          {status && status.type === 'success' && (
            <p>{status.message} <Link href="/">Return to home</Link></p>
          )}
          {status && status.type === 'error' && (
            <p>{status.message}</p>
          )}

          <p>Editing: <strong>{form.serial}</strong> — serial number cannot be changed.</p>

          {/* editing form */}
          <form onSubmit={handleUpdate}>
            
            <h2>User</h2>
            <div className="form">

              <div className="input">
                <label>First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleFieldChange}
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
                  required
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

            </div>

            <h2>Appliance</h2>
            <div className="form">

              {/* appliance dropdown */}
              <div className="input">
                <label>Appliance type</label>
                <select
                  name="applianceType"
                  value={form.applianceType}
                  onChange={handleFieldChange}
                  required
                >
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
                  required
                />
                {errors.model && <span className="error">{errors.model}</span>}
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
                  required
                />
                {errors.cost && <span className="error">{errors.cost}</span>}
              </div>

            </div>

            <button type="submit">
              <p>Submit</p>
            </button>
          </form>
          <button onClick={() => {
            setForm(null); 
            setStatus(null); 
          }}>
            <p>Search again</p>
          </button>
        </>
      <Link href="/">Back to home</Link>
    </div>
  );
}
