import { apiFetch } from "./api.js";
import { getRole } from "./auth.js";

export async function loadDocumentsPage(page) {
    const role = getRole();

    // Framework7 fournit la page dans page.detail.el
    const pageEl = page.detail.el;

    const addBtn = pageEl.querySelector("#btn-upload");
    const list = pageEl.querySelector("#documents-list");

    // Masquer upload si user
    if (role !== "admin" && addBtn) {
        addBtn.style.display = "none";
    }

    // Charger documents
    const docs = await apiFetch("/documents/list", { method: "GET" });

    list.innerHTML = "";

    docs.forEach(doc => {
        list.innerHTML += `
            <li>
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-title">${doc.fileName}</div>
                        <div class="item-after">
                            <a href="https://aivo-backend-jmyf.onrender.com/documents/download/${doc.id}" target="_blank">Télécharger</a>
                            ${role === "admin" ? `<button class="delete-doc" data-id="${doc.id}">Supprimer</button>` : ""}
                        </div>
                    </div>
                </div>
            </li>
        `;
    });

    // Suppression admin
    if (role === "admin") {
        pageEl.querySelectorAll(".delete-doc").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.id;
                await apiFetch(`/documents/delete/${id}`, { method: "DELETE" });
                loadDocumentsPage(page); // refresh
            });
        });
    }
}