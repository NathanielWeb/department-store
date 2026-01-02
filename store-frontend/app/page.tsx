"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


const Main = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");

    // If user is not logged in, redirect to login page
    if (!token) {
      router.push("/login");
    } else {
      router.push("/shop");
    }
  }, [router]);

  return null;
}

export default Main