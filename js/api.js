// -------------------------------------------------------------
// API.JS — Version adaptée à TON backend actuel
// -------------------------------------------------------------

import {
    getToken,
    getRefreshToken,
    isTokenExpired,
    saveSession,
    clearSession,
    getRole
} from "./auth.js";

export const API_URL = "https://aivo-backend-jmyf.onrender.com";

// -------------------------------------------------------------
// Fonction générique API
// -------------------------------------------------------------
export async function apiFetch(endpoint, options = {}) {

    // 1. Token expiré → refresh
    if (isTokenExpired()) {
        const ok = await refreshSession();
        if (!ok) {
            clearSession();
            window.location.href = "/pages/login.html";
            return;
        }
    }

    // 2. Ajouter token
    const token = getToken();
    options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    // 3. Appel API
    let response = await fetch(API_URL + endpoint, options);

    // 4. Si 401 → refresh
    if (response.status === 401) {
        const ok = await refreshSession();
        if (!ok) {
            clearSession();
            window.location.href = "/pages/login.html";
            return;
        }

        // Rejouer la requête
        const newToken = getToken();
        options.headers["Authorization"] = `Bearer ${newToken}`;
        response = await fetch(API_URL + endpoint, options);
    }

    return response.json();
}

// -------------------------------------------------------------
// Refresh adapté à ton backend
// -------------------------------------------------------------
export async function refreshSession() {
    const refreshToken = getRefreshToken();
    const role = getRole();

    if (!refreshToken || !role) return false;

    const response = await fetch(API_URL + "/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: role,
            role: role,
            refreshToken: refreshToken
        })
    });

    if (!response.ok) return false;

    const data = await response.json();
    saveSession(data);
    return true;
}

// -------------------------------------------------------------
// LOGIN
// -------------------------------------------------------------
export async function login(username, password) {
    const response = await fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) throw new Error("Login failed");

    return response.json();
}