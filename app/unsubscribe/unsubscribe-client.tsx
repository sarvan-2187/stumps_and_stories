"use client";

import { useState } from "react";

export default function UnsubscribeClient({ token }: { token: string | null }) {
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
        } catch {
            setMessage("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-6">
            <h1 className="text-4xl font-bold">Unsubscribe</h1>

            <p>
                Click the button below to unsubscribe from future emails.
            </p>

            <button
                onClick={handleUnsubscribe}
                disabled={loading}
                className="px-6 py-2 hover:bg-gray-800 transition-all duration-500 border rounded cursor-pointer"
            >
                {loading ? "Unsubscribing..." : "Unsubscribe"}
            </button>

            {message && <p>{message}</p>}
        </div>
    );
}
