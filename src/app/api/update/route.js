import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { checkUser, checkAppliance, cleanInput } from '../../../lib/validation';

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
}catch {
}
}