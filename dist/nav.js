export function highlightActiveNav() {
    const links = document.querySelectorAll('.nav a.nav-item');
    const current = location.pathname.split('/').pop() || 'index.html';
    links.forEach((a) => {
        if (a.getAttribute('href') === current)
            a.classList.add('active');
    });
}
