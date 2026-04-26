import { NextResponse } from 'next/server';
import pool from '../../lib/db';
import { checkUser, checkAppliance, cleanInput } from '../../lib/validation';

export async function PUT(request) {
  try {
    const body = await request.json();

    const data = {
      applianceID:parseInt(body.applianceID),//creating primary key
      userID:parseInt(body.userID),//foreign key
      serial:cleanInput(body.serial), 
      applianceType:cleanInput(body.applianceType),
      brand:cleanInput(body.brand),
      model:cleanInput(body.model),
      purchase:cleanInput(body.purchase),
      warranty: cleanInput(body.warranty),
      cost:body.cost,
      firstName:cleanInput(body.firstName),
      lastName:cleanInput(body.lastName),
      address:cleanInput(body.address),
      mobile:cleanInput(body.mobile),
      email:cleanInput(body.email),
      eircode:cleanInput(body.eircode),
    };
    //checking if data is valid
    if (!(data.applianceID) || !(data.userID)) {
      return NextResponse.json({ message: 'Invalid appliance or user ID.' }, { status: 400 });
    }

     const userCheck = checkUser(data);
    if (!userCheck.valid)
      return NextResponse.json({ message: userCheck.message }, { status: 400 });

    const applianceCheck = checkAppliance(data);
    if (!applianceCheck.valid)
      return NextResponse.json({ message: applianceCheck.message }, { status: 400 });

    const conn = await pool.getConnection();
    
    try {
      // updating appliance data 
      await conn.execute(
        `UPDATE Appliances
         SET ApplianceType = ?, Brand = ?, ModelNumber = ?,
             PurchaseDate = ?, WarrantyExpirationDate = ?, Cost = ?
         WHERE ApplianceID = ?`,
        [
          data.applianceType, data.brand, data.model,
          data.purchase, data.warranty,
          parseFloat(data.cost), data.applianceID,
        ]
      );

      // updating user 
      await conn.execute(
        `UPDATE Users
         SET FirstName = ?, LastName = ?, Address = ?,
             Mobile = ?, Email = ?, Eircode = ?
         WHERE UserID = ?`,
        [
          data.firstName, data.lastName, data.address,
          data.mobile, data.email, data.eircode, data.userID,
        ]
      );

      conn.release();
      return NextResponse.json({ message: 'Appliance updated successfully' }, { status: 200 });

    } catch (dbError) {
      conn.release();
      throw dbError;
    }

  } catch (error) {
    console.error('error');
    return NextResponse.json({ message: 'error' }, { status: 500 });
  }
}
