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
                try {
                    
                } catch {

                }
            }
        )();
    })

    return (
        <div>
            
        </div>
    )
}

export default Cart
