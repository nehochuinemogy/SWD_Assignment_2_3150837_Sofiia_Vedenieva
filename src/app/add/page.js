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
}