"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/interfaces/product";

import LogoutButton from "@/components/LogoutButton";

const Shop = () => {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]); 
    const [error, setError] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const [quantities, setQuantities] = useState<Record<number, number>>({})

    useEffect(() => {
        const storedToken = localStorage.getItem("access");

        if(!storedToken) {
            setError("You must be logged in")
            router.push("/login");
            return;
        }

        setToken(storedToken);
    }, [router])

    useEffect(() => {
        if (!token) {
            return;
        }

        (
            async () => {
                const res = await fetch("https://dummyjson.com/products");
                if (!res.ok) {
                    setError("Failed to load products");
                    return;
                }

                const data = await res.json();
                setProducts(data.products);

            }

        )();
    }, [token]);

    // Logic for add to cart button 
    const addToCart = async (productId: number) => {
        const res = await fetch("http://localhost:8000/api/cart/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ product_id: productId })
        })

        if (!res.ok) {
            alert("Failed to add item");
            setError("Failed to add item");
        }
    }

    // Logic for add to favourites button
    const addToFavourites = async (productId: number) => {
        const res = await fetch("http://localhost:8000/api/favourites/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ product_id: productId })
        })

        if (!res.ok) {
            alert("Failed to add favourites");
            setError("Failed to add favourites");
        }
    }

    return (
        <main className="pt-20">
            <nav className="w-full top-0 left-0 z-50 mb-3 bg-green-300 text-center fixed flex py-3 justify-evenly">
                <button 
                    onClick={() => router.push("/cart")}
                    className="rounded bg-yellow-600 px-4 text-white hover:bg-yellow-700"
                >
                    Cart
                </button>
                <button 
                    onClick={() => router.push("/favourites")}
                    className="rounded bg-lime-600 px-4 text-white hover:bg-lime-700"
                >
                    Favourites
                </button>
                <LogoutButton />
            </nav>

            <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Shop</h1>

            {error && <p className="mb-4 rounded bg-red-100 p-2 text-center text-red-700">{error}</p>}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="rounded border border-gray-200 p-4 shadow-sm"
                    >
                        <img 
                            src={product.thumbnail} 
                            alt={product.title}
                            className="mb-3 h-40 w-full object-cover" 
                        />

                        <h3 className="text-lg font-semibold">{product.title}</h3>
                        <p className="mb-3 text-gray-700">{product.title}</p>
                        <p className="mb-3 text-gray-700">{product.rating}</p>

                        <button
                            onClick={() => addToCart(product.id)}
                            className="w-full rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                        >
                            Add to Cart
                        </button>

                        <button
                            onClick={() => addToFavourites(product.id)}
                            className="mt-2 w-full rounded bg-pink-600 px-3 py-2 text-white hover:bg-pink-700"
                        >
                            Add to Favourites
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default Shop;
