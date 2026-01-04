import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // Extracts the email to variable
        const { email } = await req.json();

        // Email validation purpose
        if (!email) {
            return NextResponse.json(
                { error: "email is required" },
                { status: 400 }
            );
        }

        // Insertion into the databse
        const query = `
            INSERT INTO subscribers (email, is_active)
            VALUES ($1, true)
            ON CONFLICT (email)
            DO UPDATE SET is_active = true
        `;

        await pool.query(query, [email]);

        // Success message
        return NextResponse.json({ success: true });
    } catch (err) {
        // Error Handling
        console.error(err);
        return NextResponse.json(
            { error: "Failed to Subscribe!" },
            { status: 500}
        )
    }
}