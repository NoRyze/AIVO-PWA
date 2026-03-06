import { login } from "./api.js";
import { saveSession, getRole } from "./auth.js";
import { loadAdminPage } from "./home-admin.js";
import { loadLogsPage } from "./logs.js";
import { loadDocumentsPage } from "./documents.js";
import { loadHomeUserPage } from "./home-user.js";

var app = new Framework7({
    el: '#app',
    name: 'AIVO',
    theme: 'ios',

    view: {
        animate: true,
        iosSwipeBack: true,
        stackPages: false
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
            path: '/documents/',
            url: './pages/documents.html',
            on: { pageInit: loadDocumentsPage }
        },

        {
            path: '/logs/',
            url: './pages/logs.html',
            on: { pageInit: loadLogsPage }
        },

        {
            path: '/home-admin/',
            url: './pages/home-admin.html',
            on: { pageInit: loadAdminPage }
        },

        {
            path: '/settings/',
            url: './pages/settings.html'
        }
    ]
});

var mainView = app.views.create('.view-main');

// Redirection auto
const role = getRole();
if (role === "admin") app.views.main.router.navigate('/home-admin/');
else if (role === "user") app.views.main.router.navigate('/home-user/');
else app.views.main.router.navigate('/login/');

// Login
document.addEventListener('click', async function (e) {
    if (e.target && e.target.id === 'login-btn') {

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const data = await login(username, password);
            saveSession(data);

            if (data.role === "admin") app.views.main.router.navigate('/home-admin/');
            else app.views.main.router.navigate('/home-user/');

        } catch (err) {
            app.dialog.alert("Identifiants incorrects");
        }
    }
});
