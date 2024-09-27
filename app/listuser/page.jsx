'use client'

import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect, Key } from "react";

export default function UsersList() {

    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    // Fetch data when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Make a GET request to the Next.js API route
                const response = await axios.get("/Api/getuser");
                setUsers(response.data); // Set the users data from the response
            } catch (error) {
                
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []); // Empty dependency array means this will only run once when the component mounts

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Users List</h1>
            {users.length > 0 ? (
                <ul>
                    {users.map((user) => (
                        <li key={user.UserID}>{user.username}------{user.Role}</li> // Assuming 'name' is a field in your Users table
                    ))}
                </ul>
            ) : (
                <p>No users found</p>
            )}

            {/* Add a Link component as an example */}
            <Link href="/">Go back to Home</Link>
        </div>
    );
}
