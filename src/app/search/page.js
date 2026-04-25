'use client';
import { useState } from 'react';
import Link from 'next/link';
import { serialRegex } from '../lib/validation';

export default function SearchPage() {
  const [serialInput, setSerialInput] = useState('');
  const [inputError,  setInputError]  = useState('');
  const [result,      setResult]      = useState(null);
  const [notFound,    setNotFound]    = useState(false);


  async function handleSearch(e) {
    e.preventDefault();

    if (!serialRegex.test(serialInput)) {
      setInputError('Serial number ivalid. (3–50  characters)');
      return;
    }

    setInputError('');
    setResult(null);
    setNotFound(false);

    try {
      const response = await fetch(
        `/api/search?serial=${encodeURIComponent(serialInput)}`
      );
      const data = await response.json();

      if (response.ok && data.appliance) {
        setResult(data.appliance);
      } else if (response.status === 404) {
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
          {inputError && <span className="error">{inputError}</span>}
        </div>

        <button type="submit" >
         <p>Submit</p>
        </button>
      </form>

      {notFound && (
        <p>No appliance found <Link href="/">Return to home</Link></p>
      )}

      {result && (
        <div>
          <p>Appliance found.</p>

          <h2>Appliance : </h2>
          <div className="form">
            <div className="input"><label>Type</label><p>{result.applianceType}</p></div>
            <div className="input"><label>Brand</label><p>{result.brand}</p></div>
            <div className="input"><label>Model number</label><p>{result.model}</p></div>
            <div className="input"><label>Serial number</label><p>{result.serial}</p></div>
            <div className="input"><label>Purchase date</label><p>{new Date(result.purchase).toLocaleDateString()}</p></div>
            <div className="input"><label>Warranty exipy date</label><p>{new Date(result.warranty).toLocaleDateString()}</p></div>
            <div className="input"><label>Cost</label><p>€{parseFloat(result.cost).toFixed(2)}</p></div>
          </div>

          <h2>Registered Owner</h2>
          <div className="form">
            <div className="input"><label>Name</label><p>{result.firstName} {result.lastName}</p></div>
            <div className="input"><label>Address</label><p>{result.address}</p></div>
            <div className="input"><label>Mobile</label><p>{result.mobile}</p></div>
            <div className="input"><label>Email</label><p>{result.email}</p></div>
            <div className="input"><label>Eircode</label><p>{result.eircode}</p></div>
          </div>
        </div>
      )}

      <Link href="/">Back to Home</Link>
    </div>
  );
}
