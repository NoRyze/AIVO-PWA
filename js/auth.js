// -------------------------------------------------------------
// AUTH.JS — Gestion de la session & tokens (version backend actuel)
// -------------------------------------------------------------

export function saveSession(data) {
    // Ton backend ne renvoie pas expiresIn → on met 1h par défaut
    const expiration = Date.now() + 3600 * 1000;

    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("role", data.role);
    localStorage.setItem("expiration", expiration);
}

export function getToken() {
    return localStorage.getItem("token");
}

export function getRefreshToken() {
    return localStorage.getItem("refreshToken");
}

export function getRole() {
    return localStorage.getItem("role");
}

export function isTokenExpired() {
    const exp = localStorage.getItem("expiration");
    if (!exp) return true;
    return Date.now() > parseInt(exp);
}

export function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("expiration");
}