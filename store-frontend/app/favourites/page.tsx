"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/interfaces/product";

import LogoutButton from "@/components/LogoutButton";
import BackToShopButton from "@/components/BackToShopButton";
import authFetch from "@/lib/authFetch";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
                    const res = await authFetch(`${BASE_URL}/api/favourites/`, {
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


    // Remove from favourites
    const removeFromFavourites = async (productId: number) => {
        const res = await authFetch(`${BASE_URL}/api/favourites/${productId}/`, {
            method: "DELETE"
        });

        if (!res.ok) {
            setError("Failed to remove from favourites");
            return;
        }

        setFavourites(favourites.filter((item) => item.id !== productId));
    };


    return (
        <main className="pt-20 bg-green-50 min-h-screen">
            <nav className="fixed top-0 left-0 z-50 w-full flex justify-between items-center bg-green-300 py-3 px-6 shadow-md">
                <BackToShopButton />
                <LogoutButton />
            </nav>

            <h1 className="mb-6 mt-6 text-3xl font-bold text-center text-green-800">My Favourties</h1>

            {error && <p className="mb-4 rounded bg-red-100 p-2 text-center text-red-700">{error}</p>}

            {
                favourites.length === 0 ? (
                    <p className="text-center text-gray-600">You have no favourite products</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4">
                        {favourites.map((product) => (
                            <div
                                key={product.id}
                                className="rounded border border-green-200 bg-white p-4 shadow-lg hover:shadow-xl transition"
                            >
                                <img 
                                    src={product.thumbnail} 
                                    alt={product.title}
                                    className="mb-3 h-40 w-full object-cover" 
                                />

                                <h3 className="text-lg font-semibold">{product.title}</h3>
                                <p className="mb-1 text-gray-700">Price: ${product.price}</p>
                                <p className="mb-3 text-gray-700">Rating: {product.rating}</p>

                                <button
                                    onClick={() => removeFromFavourites(product.id)}
                                    className="mt-2 w-full rounded bg-pink-600 px-3 py-2 text-white hover:bg-pink-700"
                                >
                                    Remove from Favourites
                                </button>
                            </div>
                        ))}
                    </div>
                )

            }
        </main>
    );
}

export default Favourites
