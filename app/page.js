"use client";

import { useState, useEffect } from "react";
import styles from './MyForm.module.css';
import Link from "next/link";


export default function HomePage() {
    const [name, setName] = useState("");
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingName, setEditingName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name) return;

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                setName("");
                fetchUsers(); // Refresh user list after adding
            } else {
                const errorData = await response.json();
                alert(`Error adding user: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/users");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleEdit = (user) => {
        setEditingUserId(user._id);
        setEditingName(user.name);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!editingName) return;

        try {
            const response = await fetch("/api/users", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: editingUserId, name: editingName }),
            });

            if (response.ok) {
                setEditingUserId(null);
                setEditingName("");
                fetchUsers(); // Refresh user list after updating
            } else {
                const errorData = await response.json();
                alert(`Error updating user: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCancel = () => {
        setEditingUserId(null);
        setEditingName("");
    };

    // Function to handle deletion
    const handleDelete = async (id) => {
        const res = await fetch('/api/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
    
        if (res.ok) {
          fetchUsers();
        }
      };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className={styles.border} style={{padding: "20px", maxWidth: "600px", margin: "0 auto", marginTop: "20px", borderRadius: "5px" }}>
            <h1 className="font-bold text-3xl mb-1">Thursday Club</h1>
            <h1 className="ml-3 font-bold text-xl mb-3">Event Registration</h1>
            <p className="ml-3 text-sm">Venue: <span className="font-bold">TBA</span></p>
            <p className="ml-3 text-sm ">Date: <span className="font-bold mr-4">TBA</span>Time: <span className="font-bold mr-4">TBA</span></p>
            <Link className="ml-3 text-xs mt-2 cursor-pointer" href="https://thursday-club-blog.vercel.app/">Back to blog</Link>
           
            <p className="ml-3 font-bold text-sm mt-4">Attendee Registration</p>
            <form className="flex flex-col ml-3" onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                />
                <button className="bg-black text-white rounded-md w-fit" type="submit" style={{ padding: "6px 10px" }}>Submit</button>
            </form>

            <h2 className="text-xl mt-10 mb-6 font-bold ml-3">Users List</h2>
            <ul className="ml-3" style={{ listStyle: "none", padding: 0 }}>
                {users.map((user) => (
                    <li key={user._id} style={{ marginBottom: "10px" }}>
                        {editingUserId === user._id ? (
                            <form onSubmit={handleUpdate} style={{ display: "flex", alignItems: "center" }}>
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    style={{ padding: "6px", width: "150px", marginRight: "10px"}}
                                />
                                <button className="text-white rounded-md" type="submit" style={{ padding: "2px 2px", marginRight: "5px" }}>
                                    👍
                                </button>
                                <button className="text-white rounded-md" type="button" onClick={handleCancel} style={{ padding: "2px 2px" }}>
                                    ❌
                                </button>
                            </form>
                            
                        ) : (
                            <>
                            <div className="flex items-center justify-between">
                                <span style={{ marginRight: "20px" }}>{user.name}</span>
                                <div className="flex items-center justify-end">
                                    <button className="text-black rounded-md mr-5" onClick={() => handleEdit(user)} style={{ padding: "2px 2px" }}>
                                        ✏️
                                    </button>
                                    <button className="text-red-500 rounded-md mr-10" onClick={() => handleDelete(user._id)} style={{ padding: "2px 2px" }}>
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
