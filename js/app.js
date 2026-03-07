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
// INITIALISATION FRAMEWORK7 — SLIDE CUSTOM
// -------------------------------------------------------------
var app = new Framework7({
    el: '#app',
    name: 'AIVO',
    theme: 'ios',

    animate: true,
    iosTranslucentBars: false,

    // ⭐ IMPORTANT : on garde les pages dans le DOM
    stackPages: true,
    preloadPreviousPage: true,
    removeElements: false,
    pushState: false,

    view: {
        animate: true,
        iosSwipeBack: false,
        browserHistoryAnimate: true,

        // ⭐ Transition minimale pour forcer F7 à générer les classes
        transition: 'f7-fade'
    },

    router: {
        animate: true,
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
// VUE PRINCIPALE — TRANSITION MINIMALE (slide custom via CSS)
// -------------------------------------------------------------
var mainView = app.views.create('.view-main', {
    animate: true,
    transition: 'f7-fade'
});

// -------------------------------------------------------------
// AIVO — HOOKS POUR LE SLIDE CUSTOM IDENTIQUE AU PANEL
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
