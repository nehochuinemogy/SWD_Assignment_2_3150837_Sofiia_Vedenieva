'use client';
import { useState } from 'react';
import Link from 'next/link';
import { serialRegex } from '../lib/validation';

export default function DeletePage() {

  const [serialInput, setSerialInput] = useState('');
  const [searchError, setSearchError] = useState('');
  
  // Delete confirmation state
  const [appliance, setAppliance] = useState(null);  //storing found apppliance
  const [deleteError, setDeleteError] = useState('');


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

      if (!response.ok) {
        setDeleteError(data.message || 'Could not delete. Please try again.');
      }
    } catch {
      setDeleteError('Error. Please try again.');
    }
  }


}