"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/interfaces/product";
import { CartItem } from "@/interfaces/cartItem"

import LogoutButton from "@/components/LogoutButton";
import BackToShopButton from "@/components/BackToShopButton";
import authFetch from "@/lib/authFetch";

const TAX_RATE = 0.13;

import React from 'react'

const Cart = () => {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

    // Fetch cart items
    useEffect(() => {
        if (!token) {
            return;
        }

        (
            async () => {
                
                const res = await authFetch("http://localhost:8000/api/cart/");
                if (!res.ok) {
                    setError("Failed to load cart items");
                    return;
                }
                const data = await res.json();
                setCartItems(data);
            }
        )();
    }, [token]);

    // Remove item from cart
    const removeItem = async (cartItemId: number) => {
        const res = await authFetch(`http://localhost:8000/api/cart/${cartItemId}/`, {
            method: "DELETE"
        });

        if (res.ok) {
            setCartItems(cartItems.filter(item => item.id !== cartItemId));
        }


    }   

    // Update quantity
    const updateQuantity = async (id: number, quantity: number) => {
        const res = await authFetch(`http://localhost:8000/api/cart/${id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity })
        });

        if (res.ok) {
            // Update the quantity of the item that matches the given id
            setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
        }
    }

    // Purchase logic
    const purchase = async () => {
        const confirmed = confirm("Are you sure you want to purchase?");
        if (!confirmed) {
            return;
        }

        for (const item of cartItems) {
            await authFetch(`http://localhost:8000/api/cart/${item.id}/`, {
                method: "DELETE"
            });
        }

        setCartItems([]);
        alert("Purchase successful!");
    }

    // Calculations for price
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const tax = Math.round((subtotal * TAX_RATE * 100)) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;
    
    return (
        <main className = "min-h-screen bg-gray-100 pt-20">
            <nav className="fixed top-0 left-0 z-50 flex w-full justify-evenly bg-green-300 px-6 py-3">
               <BackToShopButton />
               <LogoutButton /> 
            </nav>

            <h1 className="mb-6 text-center text-4xl font-bold text-gray-800">
                Your Cart
            </h1>

            {error && <p className="mb-4 rounded bg-red-100 p-2 text-center text-red-700">{error}</p>}

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
                {/* Left side: cart items */} 
                {cartItems.length === 0 ? (
                    <h1 className="md:col-span-2 space-y-4 text-3xl text-center text-gray-600">You have no items in your cart</h1>
                ) : (
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 rounded bg-white p-4 shadow"
                            >
                                <img 
                                    src={item.thumbnail} 
                                    alt={item.title}
                                    className="h-20 w-20 rounded object-cover"
                                />

                                <div className="flex-1">
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <p className="text-sm text-gray-600">${item.price}</p>

                                    <div className="mt-2 flex items-center gap-2">
                                        <select
                                            value={item.quantity}
                                            onChange={event => 
                                                updateQuantity(
                                                    item.id,
                                                    Number(event.target.value)
                                                )
                                            }
                                            className="rounded border p-1"
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-sm text-red-600 hovermt-2 w-full rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                                        >
                                            Remove
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                )}
                

                {/* Right side: price */}
                <div className="rounded bg-white p-4 shadow">
                    <h2 className="mb-4 text-xl font-bold">Cost Summary</h2>

                    <ul className="list-none space-y-2 text-sm">
                        {cartItems.map(item => (
                            <li
                                key={item.id}
                                className="flex justify-between"
                            >
                                <span>
                                    {item.title} x {item.quantity}
                                </span>
                                <span>
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </li>
                        ))}

                    </ul>

                    <hr className="my-3" />

                    <div className="flex justify-between text-sm">
                        <span>Tax (13%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>

                    <div className="mt-2 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={purchase}
                        disabled={cartItems.length === 0}
                        className="mt-4 w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
                    >
                        Purchase
                    </button>
                </div>
            </div>
        </main>
    )
}

export default Cart
