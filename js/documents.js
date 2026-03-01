import { apiFetch, API_URL } from "./api.js";

export function loadDocumentsPage() {
    loadDocuments();
    setupUpload();
}

/* -------------------------------------------------------------
   CHARGEMENT DES DOCUMENTS
------------------------------------------------------------- */
async function loadDocuments() {
    const list = document.getElementById("documents-list");
    list.innerHTML = "<li>Chargement...</li>";

    try {
        const docs = await apiFetch("/documents/list", { method: "GET" });

        if (!docs || docs.length === 0) {
            list.innerHTML = "<li>Aucun document</li>";
            return;
        }

        list.innerHTML = "";

        docs.forEach(doc => {
            list.innerHTML += `
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title">${doc.fileName}</div>
                            <div class="item-after">
                                <a href="#" class="download-doc" data-id="${doc.id}" data-name="${doc.fileName}">⬇️</a>
                                <a href="#" class="delete-doc" data-id="${doc.id}">🗑️</a>
                            </div>
                        </div>
                    </div>
                </li>
            `;
        });

        setupActions();

    } catch (err) {
        console.error(err);
        list.innerHTML = "<li>Erreur de chargement</li>";
    }
}

/* -------------------------------------------------------------
   UPLOAD
------------------------------------------------------------- */
function setupUpload() {
    const btn = document.getElementById("btn-upload");
    const fileInput = document.getElementById("doc-file");

    btn.addEventListener("click", async () => {
        if (!fileInput.files.length) {
            app.dialog.alert("Choisissez un fichier.");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        try {
            await apiFetch("/documents/upload", {
                method: "POST",
                body: formData
            });

            app.dialog.alert("Document uploadé !");
            loadDocuments();

        } catch (err) {
            console.error(err);
            app.dialog.alert("Erreur lors de l'upload.");
        }
    });
}

/* -------------------------------------------------------------
   ACTIONS : SUPPRESSION + TÉLÉCHARGEMENT
------------------------------------------------------------- */
function setupActions() {

    // SUPPRESSION
    document.querySelectorAll(".delete-doc").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;

            try {
                await apiFetch(`/documents/delete/${id}`, { method: "DELETE" });
                loadDocuments();
            } catch (err) {
                console.error(err);
                app.dialog.alert("Erreur lors de la suppression.");
            }
        });
    });

    // TÉLÉCHARGEMENT + ENREGISTREMENT DU DERNIER DOCUMENT CONSULTÉ
    document.querySelectorAll(".download-doc").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const fileName = btn.dataset.name;

            const url = `${API_URL}/documents/download/${id}`;

            // Enregistrer le dernier document consulté pour la Home User
            localStorage.setItem("lastDocument", JSON.stringify({
                id,
                fileName,
                url,
                viewedAt: Date.now()
            }));

            window.open(url, "_blank");
        });
    });
}