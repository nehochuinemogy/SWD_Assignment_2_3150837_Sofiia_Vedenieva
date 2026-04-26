import { NextResponse } from 'next/server';
import pool from '../../lib/db';
import { serialRegex, cleanInput } from '../../lib/validation';

export async function DELETE(request) {
    try {
        const body = await request.json();
        const serial = cleanInput(body.serial || '');

        if (!serialRegex.test(serial)) {
            return NextResponse.json({ message: 'Invalid serial number format' }, { status: 400 });
        }

        // checking if apliance exists
        const [foundRows] = await pool.execute(
            'SELECT ApplianceID FROM Appliances WHERE SerialNumber = ?',
            [serial]
        );

        if (foundRows.length === 0) {
            return NextResponse.json({ message: 'Apppliacne not found' }, { status: 404 });
        }
        //deleting appliance 
        await pool.execute(
            'DELETE FROM Appliances WHERE SerialNumber = ?',
            [serial]
        );

        return NextResponse.json({ message: 'Appliance deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error('error');
        return NextResponse.json({ message: 'Error' }, { status: 500 });
    }
}
