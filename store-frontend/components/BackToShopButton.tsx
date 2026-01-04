"use client";

import { useRouter } from "next/navigation";

const BackToShopButton = () => {
    const router = useRouter()
    return (
        <button
            onClick={() => router.push("/shop")}
            className="rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
        >
            Back to Shop
        </button>
    )
}

export default BackToShopButton
