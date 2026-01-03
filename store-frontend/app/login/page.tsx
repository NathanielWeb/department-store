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
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h1>
                {error && <p className="mb-4 rounded bg-red-100 p-2 text-center text-red-700">{error}</p>}
                
                <form onSubmit={submit} className="flex flex-col gap-4">

                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={event => setUsername(event.target.value)} 
                        className="w-full rounded border border-gray-300 p-3 
                                   text-gray-700 focus:border-blue-500 focus:ring-1 
                                   focus:ring-blue-500"
                        required
                    />

                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={event => setPassword(event.target.value)}
                        className="w-full rounded border border-gray-300 p-3 
                                   text-gray-700 focus:border-blue-500 focus:ring-1 
                                   focus:ring-blue-500"
                        required 
                    />

                    <button
                        type="submit"
                        className="w-full rounded bg-blue-600 p-3 font-semibold text-white 
                                   hover:bg-blue-700 focus:outline-none focus:ring-2 
                                   focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">Don't have an account?</p>
                    <button 
                        onClick={() => router.push("/register")}
                        className="mt-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 
                                focus:outline-none foucs:ring-2 focus:ring-green-500"
                    >
                        Register here!
                    </button>
                </div>
            </div>
            
            
        </main>
    );
}

export default Login