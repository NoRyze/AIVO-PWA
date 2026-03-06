import { apiFetch } from "./api.js";
import { getRole } from "./auth.js";

export async function loadDocumentsPage(page) {
    const role = getRole();

    const addBtn = page.el.querySelector("btn-upload");
    const list = page.el.querySelector("#documents-list");
    
    // 1. Masquer le bouton d'ajout si user
    if (role !== "admin" && addBtn) {
        addBtn.style.display = "none";
    }
    
    // 2. Chargement des documents
    const docs = await apiFetch("/documents", { method: "GET"});

    list.innerHTML = "";

    docs.forEach(doc => {
        list.innerHTML += `
            <li>
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-title">${doc.fileName}</div>
                        <div class="item-after">
                            <a href="${doc.owner}" target="_blank">Télécharger</a>
                            ${role === "admin" ? `<button class="delete-doc" data-id"${doc.id}">Suprimer</button>` : ""}
                        </div>
                    </div>
                </div>
            </li>
        `;
    });

    // 3. Gestion supression (admin uniquement)
    if (role === "admin") {
       page.el.querySelectorAll(".delete-doc").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.id;
                await apiFetch(`/documents/${id}`, { method: "DELETE" });
                loadDocumentsPage(page); // refresh
            });
       });
            
    }
}