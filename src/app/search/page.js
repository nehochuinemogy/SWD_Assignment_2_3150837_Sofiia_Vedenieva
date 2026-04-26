'use client';
import { useState } from 'react';
import Link from 'next/link';
import { serialRegex } from '../lib/validation';

export default function SearchPage() {
  const [serialInput, setSerialInput] = useState('');
  const [inputError,  setInputError]  = useState('');
  const [result,      setResult]      = useState(null);
  const [notFound,    setNotFound]    = useState(false);

  // searching appliance by serial number
  async function handleSearch(e) {
    e.preventDefault();

    // validating serial number format
    if (!serialRegex.test(serialInput)) {
      setInputError('Serial number invalid. (3–50 characters)');
      return;
    }

    setInputError('');
    setResult(null);
    setNotFound(false);

    try {
      // API call to search for appliance
      const response = await fetch(
        `/api/search?serial=${encodeURIComponent(serialInput)}`
      );
      const data = await response.json();

      // if appliance found set result
      if (response.ok && data.appliance) {
        setResult(data.appliance);
      } else if (response.status === 404) {
        // appliance not found
        setNotFound(true);
      } else {
        setInputError(data.message || 'Error');
      }
    } catch {
      setInputError('Error. Please try again.');
    }
  }

  return (
    <div className="option">
      <h1>Search appliance</h1>

      {/* search form */}
      <form onSubmit={handleSearch}>
        <div className="input">
          <label>Serial number</label>
          <input 
            type="text"
            value={serialInput}
            onChange={(e) => { setSerialInput(e.target.value); setInputError(''); }}
            placeholder="SAMSUNG-S5"
            required
          />
          {/* error message */}
          {inputError && <span className="error">{inputError}</span>}
        </div>

        <button type="submit">
          <p>Submit</p>
        </button>
      </form>

      {/* not found message */}
      {notFound && (
        <p>No appliance found <Link href="/">Return to home</Link></p>
      )}

      {/* result section - shown when appliance is found */}
      {result && (
        <div>
          <p>Appliance found.</p>

          {/* appliance details */}
          <h2>Appliance : </h2>
          <div className="form">
            <div className="input"><label>Type</label><p>{result.ApplianceType}</p></div>
            <div className="input"><label>Brand</label><p>{result.Brand}</p></div>
            <div className="input"><label>Model number</label><p>{result.ModelNumber}</p></div>
            <div className="input"><label>Serial number</label><p>{result.SerialNumber}</p></div>
            <div className="input"><label>Purchase date</label><p>{new Date(result.PurchaseDate).toLocaleDateString()}</p></div>
            <div className="input"><label>Warranty expiry date</label><p>{new Date(result.WarrantyExpirationDate).toLocaleDateString()}</p></div>
            <div className="input"><label>Cost</label><p>€{parseFloat(result.Cost).toFixed(2)}</p></div>
          </div>

          {/* user details */}
          <h2>User: </h2>
          <div className="form">
            <div className="input"><label>Name</label><p>{result.FirstName} {result.LastName}</p></div>
            <div className="input"><label>Address</label><p>{result.Address}</p></div>
            <div className="input"><label>Mobile</label><p>{result.Mobile}</p></div>
            <div className="input"><label>Email</label><p>{result.Email}</p></div>
            <div className="input"><label>Eircode</label><p>{result.Eircode}</p></div>
          </div>
        </div>
      )}

      <Link href="/">Back to home</Link>
    </div>
  );
}