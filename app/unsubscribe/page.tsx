"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function UnsubscribePage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleUnsubscribe = async () => {
        if (!token) {
            setMessage("Invalid unsubscribe link");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch(`/api/unsubscribe?token=${token}`);
            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Failed to unsubscribe");
            } else {
                setMessage("You have been unsubscribed successfully.");
            }
        } catch (err) {
            setMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 500, margin: "4rem auto", textAlign: "center" }}>
            <h1>Unsubscribe</h1>

            <p>
                We’re sorry to see you go. Click the button below to unsubscribe from
                future emails.
            </p>

            <button
                onClick={handleUnsubscribe}
                disabled={loading}
                style={{ padding: "10px 20px", marginTop: "20px" }}
            >
                {loading ? "Unsubscribing..." : "Unsubscribe"}
            </button>

            {message && <p style={{ marginTop: "20px" }}>{message}</p>}
        </div>
    );
}
