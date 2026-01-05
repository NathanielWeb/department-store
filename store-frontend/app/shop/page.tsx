"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/interfaces/product";

import LogoutButton from "@/components/LogoutButton";
import authFetch from "@/lib/authFetch";

const Shop = () => {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]); 
    const [error, setError] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [cartProductIds, setCartProductIds] = useState<Number[]>([]);
    const [favouriteroductIds, setFavouriteProductIds] = useState<Number[]>([]);

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

    // Grab the products from dummyjson
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

    // Grab the product ids of the items in the cart and in favourite products
    useEffect(() => {
        if (!token) {
            return;
        }

        (
            async () => {
                try {
                    const cartRes = await authFetch("http://localhost:8000/api/cart/", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (cartRes.ok) {
                        const cartData = await cartRes.json();

                        setCartProductIds(
                            cartData.map((item: any) => item.product_id)
                        )
                    }

                    const favRes = await authFetch("http://localhost:8000/api/favourites/", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (favRes.ok) {
                        const favData = await favRes.json();

                        setFavouriteProductIds(
                            favData.map((item: any) => item.product_id)
                        )
                    }
                } catch {
                    setError("Failed to load cart or favourites");
                }
            }

        )();
    }, [token]);

    // Logic for add to cart button 
    const addToCart = async (product: Product) => {
        const quantity = quantities[product.id] ?? 1;

        const res = await authFetch("http://localhost:8000/api/cart/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ 
                product_id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                rating: product.rating,
                quantity: quantity
            })
        })

        if (!res.ok) {
            alert("Failed to add item");
            setError("Failed to add item");
        }

        // Immediately updating state so the button becomes disabled
        setCartProductIds([...cartProductIds, product.id]);
    }

    // Logic for add to favourites button
    const addToFavourites = async (product: Product) => {
        const res = await authFetch("http://localhost:8000/api/favourites/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                product_id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                rating: product.rating,
            })
        })

        if (!res.ok) {
            alert("Failed to add favourites");
            setError("Failed to add favourites");
        }

        // Immediately updating state so the button becomes disabled
        setFavouriteProductIds([...favouriteroductIds, product.id]);
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
                {products.map((product) => {
                    const isInCart = cartProductIds.includes(product.id);
                    const isInFavourites = favouriteroductIds.includes(product.id);

                    return (
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
                            <p className="mb-1 text-gray-700">Price: ${product.price}</p>
                            <p className="mb-3 text-gray-700">Rating: {product.rating}</p>
                            
                            {/* Select quantity option*/}
                            <p>
                                Quantity: 
                                <select
                                    value={quantities[product.id] ?? 1}
                                    onChange={(event) => 
                                        setQuantities({
                                            ...quantities,
                                            [product.id]: Number(event.target.value)
                                        })
                                    }
                                    className="mb-2 w-full rounded border border-gray-300 p-2"
                                >
                                    {[...Array(10)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    )
                                    )}
                                </select> 
                            </p>

                            <button
                                disabled={isInCart}
                                onClick={() => addToCart(product)}
                                className={`w-full rounded px-3 py-2 text-white ${
                                    isInCart ? 
                                    "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {isInCart ? "Already in Cart" : "Add to Cart"}
                            </button>

                            <button
                                onClick={() => addToFavourites(product)}
                                className={`mt-2 w-full rounded px-3 py-2 text-white ${
                                    isInFavourites ? 
                                    "bg-gray-400 cursor-not-allowed"
                                    : "bg-pink-600 hover:bg-pink-700"
                                }`}
                            >
                                {isInFavourites ? "Already in Favourites" : "Add to Favourites"}
                            </button>
                        </div>
                )})}
            </div>
        </main>
    );
}

export default Shop;
