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
    setLoading(true);

    try {
      const response = await fetch(
        `/api/appliances/search?serial=${encodeURIComponent(serialInput)}`
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
}