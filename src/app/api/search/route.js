import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { serialRegex, cleanInput } from '../../../lib/validation';

export async function GET(request) {
  try {
    // serial num in URL for GET
    const { searchParams } = new URL(request.url);
    const serial = cleanInput(searchParams.get('serial') || '');

    // validation format before database interaction
    if (!serialRegex.test(serial)) {
      return NextResponse.json({ message: 'Invalid format, please try again' }, { status: 400 });
    }

    //appliance and user together (JOIN)
  const [rows] = await pool.execute(
      `SELECT
         a.ApplianceID, a.UserID,
         a.ApplianceType, a.Brand, a.ModelNumber, a.SerialNumber,
         a.PurchaseDate, a.WarrantyExpirationDate, a.Cost,
         u.FirstName, u.LastName, u.Address, u.Mobile, u.Email, u.Eircode
       FROM Appliances a
       JOIN Users u ON a.UserID = u.UserID
       WHERE a.SerialNumber = ?`,
      [serialNumber]
    );
    if (rows.length === 0) {
      return NextResponse.json({ message: 'Appliance not found,please try again' }, { status: 404 });
    }
    return NextResponse.json({ appliance: rows[0] }, { status: 200 });

  } catch (error) {
    console.error('error');
    return NextResponse.json({ message: 'Erro, please try again.' }, { status: 500 });
  }
}