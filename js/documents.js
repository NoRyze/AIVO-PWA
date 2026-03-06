import { apiFetch } from "./api.js";
import { getRole } from "./auth.js";

const BACKEND_BASE = "https://aivo-backend-jmyf.onrender.com";

export async function loadDocumentsPage(page) {
    const role = getRole();
    const pageEl = page.detail.el;
    const container = pageEl.querySelector("#categories-list");

    // Charger les catégories
    const categories = await apiFetch("/categories", { method: "GET" });

    container.innerHTML = "";

    categories.forEach(cat => {
        const card = document.createElement("div");
        card.className = "category-card";

        card.innerHTML = `
            <div class="category-header">
                <div class="category-title">${cat.name}</div>
                ${role === "admin" ? `
                    <button class="btn-add-subdoc" data-id="${cat.id}">Ajouter</button>
                ` : ""}
            </div>
            <div class="subdocs"></div>
        `;

        container.appendChild(card);

        const subdocsContainer = card.querySelector(".subdocs");

        (cat.subDocuments || cat.subdocs || []).forEach(sub => {
            const div = document.createElement("div");
            div.className = "subdoc-item";

            const hasFile = !!sub.filePath;

            div.innerHTML = `
                <span>${sub.label}</span>
                ${hasFile ? `
                    <a href="${BACKEND_BASE}/subdocs/${sub.id}/download" target="_blank">Télécharger</a>
                ` : role === "admin" ? `
                    <input type="file" class="upload-file" data-id="${sub.id}" />
                ` : `
                    <span style="opacity:0.6;">(non disponible)</span>
                `}
            `;

            subdocsContainer.appendChild(div);
        });
    });

    // ADMIN : upload fichier
    if (role === "admin") {
        container.querySelectorAll(".upload-file").forEach(input => {
            input.addEventListener("change", async () => {
                const id = input.dataset.id;
                const file = input.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                await fetch(`${BACKEND_BASE}/subdocs/${id}/upload`, {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                });

                loadDocumentsPage(page);
            });
        });

        // ADMIN : ajouter un sous-document
        container.querySelectorAll(".btn-add-subdoc").forEach(btn => {
            btn.addEventListener("click", async () => {
                const catId = btn.dataset.id;
                const label = prompt("Nom du sous-document :");
                if (!label) return;

                await apiFetch(`/categories/${catId}/subdocs`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ label })
                });

                loadDocumentsPage(page);
            });
        });
    }
}