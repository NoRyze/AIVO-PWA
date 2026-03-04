export default [
    {
        path: '/login/',
        url: './pages/login.html',
        async: function (routeTo, routeFrom, resolve) {
            import('./pages/login.js').then((module) => {
                resolve({ url: './pages/login.html' });
                module.default(routeTo);
            });
        }
    },

    {
        path: '/home-user/',
        url: './pages/home-user.html',
    },

    {
        path: '/documents/',
        url: './pages/documents.html',
    },

    {
        path: '/messages/',
        url: './pages/messages.html',
    },

    {
        path: '/change-password/',
        url: './pages/change-password.html',
    },

    {
        path: '(.*)',
        url: './pages/404.html',
    }
];