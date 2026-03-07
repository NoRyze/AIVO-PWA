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
// INITIALISATION FRAMEWORK7
// -------------------------------------------------------------
var app = new Framework7({
    el: '#app',
    name: 'AIVO',
    theme: 'ios',

    view: {
        animate: true,
        iosSwipeBack: true,
        browserHistoryAnimate: true
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
            url: './page/logs.html',
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
// GESTION DU THÈME JOUR / NUIT
// -------------------------------------------------------------

// Appliquer le thème automatique basé sur l'heure
function applyAutoTheme() {
    const hour = new Date().getHours();

    if (hour >= 20 || hour < 7) {
        // Nuit
        document.documentElement.classList.add('theme-dark');
        document.documentElement.classList.remove('theme-light');
        localStorage.setItem('aivo-theme', 'dark');
    } else {
        // Jour
        document.documentElement.classList.add('theme-light');
        document.documentElement.classList.remove('theme-dark');
        localStorage.setItem('aivo-theme', 'light');
    }
}

// Charger le thème sauvegardé
const savedTheme = localStorage.getItem('aivo-theme');

if (savedTheme === 'dark') {
    document.documentElement.classList.add('theme-dark');
} 
else if (savedTheme === 'light') {
    document.documentElement.classList.add('theme-light');
} 
else {
    // Si aucun thème choisi → mode auto
    applyAutoTheme();
}

// -------------------------------------------------------------
// SYNCHRONISER LE SWITCH DANS LA PAGE PARAMÈTRES
// -------------------------------------------------------------
document.addEventListener('page:init', function(e) {
    if (e.target.dataset.name === 'settings') {

        const toggle = document.getElementById('toggle-theme');
        const currentTheme = localStorage.getItem('aivo-theme');

        if (currentTheme === 'dark') toggle.checked = true;
        if (currentTheme === 'light') toggle.checked = false;

        // Si aucun thème → appliquer auto
        if (!currentTheme) applyAutoTheme();
    }
});

// -------------------------------------------------------------
// SWITCH JOUR / NUIT (action utilisateur)
// -------------------------------------------------------------
document.addEventListener('change', function(e) {
    if (e.target.id === 'toggle-theme') {

        if (e.target.checked) {
            document.documentElement.classList.add('theme-dark');
            document.documentElement.classList.remove('theme-light');
            localStorage.setItem('aivo-theme', 'dark');
        } else {
            document.documentElement.classList.add('theme-light');
            document.documentElement.classList.remove('theme-dark');
            localStorage.setItem('aivo-theme', 'light');
        }
    }
});

// -------------------------------------------------------------
// VUE PRINCIPALE
// -------------------------------------------------------------
var mainView = app.views.create('.view-main');

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