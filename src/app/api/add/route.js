import { NextResponse } from 'next/server';
import pool from '../../lib/db';
import { checkUser, checkAppliance, cleanInput } from '../../lib/validation';

export async function POST(request) {
  try {
    //reading JSON data sent from form 
    const body = await request.json();

    // cleaning every string field
    const cleanData = {
      firstName:cleanInput(body.firstName),
      lastName:cleanInput(body.lastName),
      address:cleanInput(body.address),
      mobile:cleanInput(body.mobile),
      email:cleanInput(body.email),
      eircode:cleanInput(body.eircode),
      applianceType:cleanInput(body.applianceType),
      brand:cleanInput(body.brand),
      model:cleanInput(body.model),
      serial:cleanInput(body.serial),
      purchase: cleanInput(body.purchase),
      warranty: cleanInput(body.warranty),
      cost:body.cost, 
    }

    //cheking if input is valid
    const userValid = checkUser(cleanData);
    if (!userValid.valid)
      return NextResponse.json({ message: userValid.message }, { status: 400 });

    const applianceValid = checkAppliance(cleanData);
    if (!applianceValid.valid)
      return NextResponse.json({ message: applianceValid.message }, { status: 400 });
    
    //connection pool
    const conn = await pool.getConnection();
    
    try {
      // checking is serial number already exists
      const [existAppliances] = await conn.execute(
        'SELECT ApplianceID FROM Appliances WHERE SerialNumber = ?',
        [cleanData.serial]
      );

      //showing message 
      if (existAppliances.length > 0) {
        conn.release();
        return NextResponse.json({ message: 'Appliance exists' }, { status: 409 });
      }

      //checking if email exists
      const [existUsers] = await conn.execute(
        'SELECT UserID FROM Users WHERE Email = ?',
        [cleanData.email]
      );

      let userId;

      if (existUsers.length > 0) {
        // if exists- reusing id
        userId = existUsers[0].UserID;
      } else {
        // inserting user data
        const [insertResult] = await conn.execute(
          `INSERT INTO Users (FirstName, LastName, Address, Mobile, Email, Eircode)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [cleanData.firstName, cleanData.lastName, cleanData.address,
           cleanData.mobile, cleanData.email, cleanData.eircode]
        );
        userId = insertResult.insertId;
      }

      //inserting appliance data with user data connected by user id
      await conn.execute(
        `INSERT INTO Appliances
           (UserID, ApplianceType, Brand, ModelNumber, SerialNumber,
            PurchaseDate, WarrantyExpirationDate, Cost)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          cleanData.applianceType,
          cleanData.brand,
          cleanData.model,
          cleanData.serial,
          cleanData.purchase,
          cleanData.warranty,
          parseFloat(cleanData.cost),
        ]
      );

      conn.release();
      return NextResponse.json({ message: 'Appliance added successfully' }, { status: 201 });

    } catch (dbError) {
      conn.release();
      throw dbError;
    }

  } catch(error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
