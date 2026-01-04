import { redirect } from "next/navigation";

const authFetch = async (
    url: string,
    options: RequestInit = {}
) => {
    const token = localStorage.getItem("access");

    // Redirect to login page if not logged in
    if (!token) {
        sessionStorage.setItem(
            "auth_error",
            "Your session has expired. Please log in again."
        );
        redirect("/login");
    }

    const res = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
        }
    });

    // Redirect to log in page if token has expired
    if (res.status === 401) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        sessionStorage.setItem(
            "auth_error",
            "Your session has expired. Please log in again."
        );
        redirect("/login");
    }

    return res;
}

export default authFetch
