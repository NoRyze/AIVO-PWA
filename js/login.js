import { login } from "../api.js";
import { saveSession } from "../auth.js";

export default function (page) {

    const usernameInput = page.el.querySelector("#login-username");
    const passwordInput = page.el.querySelector("#login-password");
    const errorBox = page.el.querySelector("#login-error");
    const loginBtn = page.el.querySelector("#login-btn");

    loginBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        errorBox.textContent = "";

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            errorBox.textContent = "Veuillez remplir tous les champs.";
            return;
        }

        try {
            const data = await login(username, password);
            saveSession(data);
            page.router.navigate("/home-user/");
        } catch (err) {
            errorBox.textContent = "Identifiants incorrects.";
        }
    });
}