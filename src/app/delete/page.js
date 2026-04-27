'use client';
import { useState } from 'react';
import Link from 'next/link';
import { serialRegex } from '../lib/validation';

export default function DeletePage() {

  const [serialInput, setSerialInput] =
   useState('');
  const [searchError, setSearchError] = 
  useState('');
  const [deleted, setDeleted] = 
  useState(false);
  // Delete confirmation state
  const [appliance, setAppliance] = 
  useState(null);  //storing found apppliance
  const [deleteError, setDeleteError] = 
  useState('');


  //searching appliance by serial number
  async function handleLookup(e) {
    e.preventDefault();

    // validating serial number
    if (!serialRegex.test(serialInput)) {
      setSearchError('Serial number invalid (3–50 characters)');
      return;
    }
    // clearing any previous errors
    setSearchError('');

    try {
      // searching applaince by serial number
      const response = await fetch(
        `/api/search?serial=${encodeURIComponent(serialInput)}`
      );
      const data = await response.json();

      // if appliance found, save data 
      if (response.ok && data.appliance) {
        setAppliance(data.appliance);  //stroing applaince to delete
      } else {
        setSearchError('Appliance not found');
      }
    } catch {
      setSearchError('Error. Please try again.');
    }
  }

  //deleting applaicne
  async function handleConfirmDelete() {
    //clearing previous 
    setDeleteError('');
    try {
    // sending delete request
    const response = await fetch('/api/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serial: appliance.SerialNumber }),
    });
    const data = await response.json();

    if (response.ok) {
      setDeleted(true);  
      setAppliance(null);  
    } else {
      setDeleteError(data.message || 'Could not delete. Please try again.');
    }
  } catch {
    setDeleteError('Error. Please try again.');
  }
  }
  return (
    <div className="option">
      <h1>Delete appliance</h1>

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
            {searchError && <span className="error">{searchError}</span>}
          </div>
          <button type="submit">
            <p>Submit</p>
          </button>
        </form>

        <div>
            {appliance && (
          <div className="form">
            <div className="input">
              <label>Serial number</label>
              <p>{appliance.SerialNumber}</p>
            </div>
            
            <div className="input">
              <label>Type</label>
              <p>{appliance.ApplianceType}</p>
            </div>
            
            <div className="input">
              <label>Brand</label>
              <p>{appliance.Brand}</p>
            </div>
            
            <div className="input">
              <label>Model number</label>
              <p>{appliance.ModelNumber}</p>
            </div>
            
            <div className="input">
              <label>Registered to</label>
              <p>{appliance.FirstName} {appliance.LastName}</p>
            </div>
            
            <div className="input">
              <label>Email</label>
              <p>{appliance.Email}</p>
            </div>
            
            <div className="input">
              <label>Purchase date</label>
              <p>{new Date(appliance.PurchaseDate).toLocaleDateString()}</p>
            </div>
            
            <div className="input">
              <label>Cost</label>
              <p>€{parseFloat(appliance.Cost).toFixed(2)}</p>
            </div>
          </div>
            )}
          {deleteError && <p> {deleteError}</p>}

        
          <button onClick={handleConfirmDelete}>
            <p>Delete</p>
          </button>
        
        </div>
       {deleted && (
        <p>Appliance deleted successfully<Link href="/">Return to Home</Link></p>
)}
      <Link href="/">Back to home</Link>
    </div>
  );
}

