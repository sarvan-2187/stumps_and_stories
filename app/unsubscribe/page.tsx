"use client";

export const dynamic = "force-dynamic";


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
        <div className="flex flex-col gap-8 text-center py-12">
            <h1 className="text-3xl md:text-7xl">Unsubscribe</h1>

            <p>
                We’re sorry to see you go. Click the button below to unsubscribe from
                future emails.
            </p>

            <div>
                <button
                    onClick={handleUnsubscribe}
                    disabled={loading}
                    className="cursor-pointer bg-white/80 hover:bg-white text-black rounded-md p-2"
                >
                    {loading ? "Unsubscribing..." : "Unsubscribe"}
                </button>
            </div>
            <div className="bg-white p-2">
                {message && <p className="text-black">{message}</p>}
            </div>
        </div>
    );
}
