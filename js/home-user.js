export function loadHomeUserPage() {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    document.getElementById("user-username").textContent = username;
    document.getElementById("user-role").textContent = role;

    // Dernier document consulté
    const lastDoc = JSON.parse(localStorage.getItem("lastDocument") || "null");

    if (lastDoc) {
        const hoursAgo = Math.floor((Date.now() - lastDoc.viewedAt) / (1000 * 60 * 60));

        document.getElementById("last-doc-text").textContent =
            `${lastDoc.fileName} — consulté il y a ${hoursAgo}h`;

        document.getElementById("btn-open-last-doc").onclick = () => {
            window.open(lastDoc.url, "_blank");
        };
    } else {
        document.getElementById("btn-open-last-doc").style.display = "none";
    }
}