import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { checkUserData, checkApplianceData, cleanInput } from '../../../lib/validation';

export async function POST(request) {
  try {
    //reading JSON data sent from form 
    const body = await request.json();

    // cleaning every string field
    const cleanData = {
      firstName:              cleanInput(body.firstName),
      lastName:               cleanInput(body.lastName),
      address:                cleanInput(body.address),
      mobile:                 cleanInput(body.mobile),
      email:                  cleanInput(body.email),
      eircode:                cleanInput(body.eircode),
      applianceType:          cleanInput(body.applianceType),
      brand:                  cleanInput(body.brand),
      model:            cleanInput(body.model),
      serial:           cleanInput(body.serial),
      purchase:           cleanInput(body.purchase),
      warranty: cleanInput(body.warranty),
      cost:                   body.cost, 
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
    
}catch {

}
}