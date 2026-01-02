"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/interfaces/product";
import { setPriority } from "os";

const Shop = () => {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]); 
    const [error, setError] = useState("");

    const token = localStorage.getItem("access");

    if(!token) {
        setError("You must be logged in")
        router.push("/login");
        return;
    }

    useEffect(() => {
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
    }, []);

    const addToCart = async (productId: number) => {
        const res = await fetch("http://localhost:8000/api/cart/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ product_id: productId })
        })
    }

    return (
        <main>
            <nav>
                <button onClick={() => router.push("/cart")}>Cart</button>
                <button onClick={() => router.push("/favourites")}>Favourites</button>
            </nav>

            <h1>Shop</h1>

            {error && <p style={{color : "red"}}>{error}</p>}

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
                            className=""
                        >

                        </button>
                    </div>
                ))}
            </div>

        </main>
    )
}

export default Shop;
