"use client";

import { useRouter } from "next/navigation";

const LogoutButton = () => {

    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        router.push("/login");
    }

    return (
        <button
            onClick={logout}
            className="rounded bg-red-600 px-4 text-white hover:bg-red-700"
        >
            Logout
        </button>
    )
}

export default LogoutButton
