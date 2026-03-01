import { apiFetch } from "./api.js";

export async function loadAdminPage() {
    await loadStats();
    await loadUsers();
    setupActions();
}

async function loadStats() {
    const stats = await apiFetch("/admin/stats", { method: "GET" });

    document.getElementById("stat-users").textContent = stats.users;
    document.getElementById("stat-sessions").textContent = stats.sessions;
    document.getElementById("stat-suspicious").textContent = stats.suspicious;
}

async function loadUsers() {
    const users = await apiFetch("/admin/users", { method: "GET" });

    const list = document.getElementById("admin-users-list");
    list.innerHTML = "";

    users.forEach(u => {
        list.innerHTML += `
            <li>
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-title">${u.username}</div>
                        <div class="item-after">${u.role}</div>
                    </div>
                </div>
            </li>
        `;
    });
}

function setupActions() {
    document.getElementById("btn-revoke-all").addEventListener("click", async () => {
        await apiFetch("/admin/revoke-all", { method: "POST" });
        app.dialog.alert("Toutes les sessions ont été révoquées.");
    });

    document.getElementById("btn-view-logs").addEventListener("click", () => {
        window.location.href = "/pages/logs.html";
    });
}