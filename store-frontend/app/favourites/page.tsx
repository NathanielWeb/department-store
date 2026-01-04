"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/interfaces/product";

import LogoutButton from "@/components/LogoutButton";
import authFetch from "@/lib/authFetch";

const Favourites = () => {
    const router = useRouter();
    const [favourites, setFavourites] = useState<Product[]>([]);
    const [error, setError] = useState("");
    const [token, setToken] = useState<string | null>(null);

    // Grab JWT token
    useEffect(() => {
        const storedToken = localStorage.getItem("access");

        if(!storedToken) {
            setError("You must be logged in")
            router.push("/login");
            return;
        }

        setToken(storedToken);
    }, [router]);

    // Fetch user's favourite products
    useEffect(() => {
        if (!token) {
            return;
        }

        (
            async () => {
                try {
                    const res = await authFetch("http://localhost:8000/api/favourites/", {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    if (!res.ok) {
                        setError("Failed to load favourites");
                        return;
                    }
                    
                    const data = await res.json();
                    setFavourites(data);
                } catch {
                    setError("Failed to load favourites");
                }
            }
        )();
    }, [token]);


    return (
        <div>
            
        </div>
    )
}

export default Favourites
