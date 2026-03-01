import { apiFetch } from "./api.js";

export async function loadLogsPage() {
    const logs = await apiFetch("/admin/logs", { method: "GET" });

    const list = document.getElementById("logs-list");
    list.innerHTML = "";

    logs.forEach(log => {
        list.innerHTML += `
            <li>
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-title">${log.message}</div>
                        <div class="item-after">${log.timestamp}</div>
                    </div>
                </div>
            </li>
        `;
    });
}