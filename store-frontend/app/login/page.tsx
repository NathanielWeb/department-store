"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Define what should be done when form is submitted
    const submit = async (event: React.FormEvent) => {

        event.preventDefault();

        // Fetching from backend 
        const res = await fetch("http://localhost:8000/api/auth/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        });

        if (!res.ok) {
            setError("Invalid credentials");
            return;
        }

        // Set data to the JSON response
        const data = await res.json();

        // Save JWT
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        router.push("/shop");
    };

    return (
        <main>
            <form onSubmit={submit}>
                <h1>Login</h1>

                {error && <p style={{color : "red"}}>{error}</p>}

                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={event => setUsername(event.target.value)} 
                    required
                />

                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={event => setPassword(event.target.value)}
                    required 
                />

                <button>Login</button>
            </form>

            <h1>Don't have an account</h1>
            <button onClick={() => router.push("/register")}>Register here!</button>
        </main>
    );
}

export default Login