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
// INITIALISATION FRAMEWORK7 — SLIDES PREMIUM ACTIVÉS
// -------------------------------------------------------------
var app = new Framework7({
    el: '#app',
    name: 'AIVO',
    theme: 'ios',

    // Animations activées
    animate: true,
    iosTranslucentBars: false,

    // On garde ton comportement propre
    stackPages: false,
    preloadPreviousPage: false,
    removeElements: true,
    pushState: false,

    view: {
        animate: true,              // Active les transitions
        iosSwipeBack: false,        // Pas de swipe-back iOS (bug visuel)
        browserHistoryAnimate: true,
        removeElements: true,
        transition: 'f7-cover'      // SLIDE HORIZONTAL PREMIUM
    },

    router: {
        animate: true,
        removeElements: true
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
// VUE PRINCIPALE — AVEC SLIDE PREMIUM
// -------------------------------------------------------------
var mainView = app.views.create('.view-main', {
    animate: true,
    transition: 'f7-cover'   // Slide horizontal fluide
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