// -------------------------------------------------------------
// IMPORTS
// -------------------------------------------------------------
import { login } from "./api.js";
import { saveSession, getRole } from "./auth.js";
import { loadAdminPage } from "./home-admin.js";
import { loadLogsPage } from "./logs.js";
import { loadDocumentsPage } from "./documents.js";
import { loadHomeUserPage } from "./home-user.js";

// -------------------------------------------------------------
// INITIALISATION FRAMEWORK7 — MODE STABLE (AUCUNE TRANSITION F7)
// -------------------------------------------------------------
var app = new Framework7({
    el: '#app',
    name: 'AIVO',
    theme: 'ios',

    animate: false,
    iosTranslucentBars: false,

    stackPages: true,
    preloadPreviousPage: true,
    removeElements: false,
    pushState: false,

    view: {
        animate: false,
        iosSwipeBack: false,
        browserHistoryAnimate: false,
        removeElements: false,
        transition: 'none'
    },

    router: {
        animate: false,
        removeElements: false
    },

    routes: [
        { path: '/', url: './pages/login.html' },
        { path: '/login/', url: './pages/login.html' },

        { 
            path: '/home-user/',
            url: './pages/home-user.html',
            on: { pageInit: loadHomeUserPage } 
        },

        {
            path: '/logs/',
            url: './pages/logs.html',
            on: { pageInit: loadLogsPage }
        },

        { 
            path: '/home-admin/', 
            url: './pages/home-admin.html',
            on : { pageInit: loadAdminPage }
        },

        {
            path: '/documents/',
            url: './pages/documents.html',
            on: { pageInit: loadDocumentsPage }
        },

        {
            path: '/settings/',
            url: './pages/settings.html'
        }
    ]
});

// -------------------------------------------------------------
// VUE PRINCIPALE — AUCUNE TRANSITION F7
// -------------------------------------------------------------
var mainView = app.views.create('.view-main', {
    animate: false,
    transition: 'none'
});

// -------------------------------------------------------------
// AIVO — HOOKS POUR LE SLIDE CUSTOM (CSS)
// -------------------------------------------------------------
app.on('page:beforein', (page) => {
    const el = page.el;
    el.classList.remove('page-leave');
    el.classList.add('page-current');
});

app.on('page:beforeout', (page) => {
    const el = page.el;
    el.classList.add('page-leave');
});

// -------------------------------------------------------------
// REDIRECTION AUTOMATIQUE AU DÉMARRAGE
// -------------------------------------------------------------
const role = getRole();

if (role === "admin") {
    app.views.main.router.navigate('/home-admin/');
}
else if (role === "user") {
    app.views.main.router.navigate('/home-user/');
}
else {
    app.views.main.router.navigate('/login/');
}

// -------------------------------------------------------------
// AFFICHAGE DU LIEN ADMIN DANS LE PANEL
// -------------------------------------------------------------
if (role === "admin") {
    const adminLink = document.getElementById('admin-dashboard-link');
    if (adminLink) adminLink.style.display = 'block';
}

// -------------------------------------------------------------
// GESTION DU BOUTON DE CONNEXION
// -------------------------------------------------------------
document.addEventListener('click', async function (e) {
    if (e.target && e.target.id === 'login-btn') {

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const data = await login(username, password);

            saveSession(data);

            if (data.role === "admin") {
                app.views.main.router.navigate('/home-admin/');
            } else {
                app.views.main.router.navigate('/home-user/');
            }

        } catch (err) {
            app.dialog.alert("Identifiants incorrects");
        }
    }
});

// -------------------------------------------------------------
// PARAMÈTRES : EMAIL / MDP / SUPPORT / SUPPRESSION
// -------------------------------------------------------------
document.addEventListener('click', function(e) {

    if (e.target.id === 'btn-change-email') {
        app.dialog.prompt("Nouvel e-mail :", function(newEmail) {
            console.log("Email modifié :", newEmail);
        });
    }

    if (e.target.id === 'btn-change-password') {
        app.dialog.prompt("Nouveau mot de passe :", function(newPass) {
            console.log("Mot de passe modifié :", newPass);
        });
    }

    if (e.target.id === 'btn-support') {
        app.dialog.prompt("Message à l’administrateur :", function(msg) {
            console.log("Message envoyé :", msg);
        });
    }

    if (e.target.id === 'btn-delete-account') {
        app.dialog.confirm("Supprimer votre compte ?", function() {
            console.log("Compte supprimé");
        });
    }
});
// -------------------------------------------------------------
// DÉCONNEXION — BULLE AIVO + SUPPRESSION SESSION + RETOUR LOGIN
// -------------------------------------------------------------
document.addEventListener('click', function(e) {
    if (e.target.id === 'panel-logout') {

        aivoConfirm("Voulez-vous vraiment vous déconnecter ?", function () {

            // Supprime la session
            localStorage.removeItem("aivo-session");

            // Redirige vers la page login
            app.views.main.router.navigate('/login/');

            // Ferme le panel
            app.panel.close();
        });
    }
});

function aivoConfirm(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'aivo-confirm-overlay';

    overlay.innerHTML = `
        <div class="aivo-confirm-box">
            <div class="aivo-confirm-message">${message}</div>
            <div class="aivo-confirm-buttons">
                <div class="aivo-confirm-btn aivo-confirm-cancel">Annuler</div>
                <div class="aivo-confirm-btn aivo-confirm-ok">OK</div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('.aivo-confirm-cancel').onclick = () => {
        overlay.remove();
    };

    overlay.querySelector('.aivo-confirm-ok').onclick = () => {
        overlay.remove();
        onConfirm();
    };
}
