"use client";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";

interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    avatar?: string;
    created_at: string;
}

export default function TestPage() {
    const [users, setUsers] = useState<UserProfile[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            const { data, error } = await supabase
                .from("users") 
                .select("*")

            if (error) {
                setError(error.message);
            } else {
                setUsers(data);
            }
        }

        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Supabase Users Test</h2>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {users ? (
                <pre>{JSON.stringify(users, null, 2)}</pre>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
}
