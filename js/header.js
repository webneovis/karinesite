(function () {
    const header = document.querySelector('.site-header');
    const burger = document.querySelector('.site-burger');
    const drawer = document.querySelector('.site-drawer');
    const langDrawer = document.querySelector('.site-lang--drawer');

    if (header) {
        const onScroll = () => {
            if (window.scrollY > 8) header.classList.add('is-scrolled');
            else header.classList.remove('is-scrolled');
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    if (burger && drawer) {
        const close = () => {
            burger.classList.remove('is-open');
            drawer.classList.remove('is-open');
            if (langDrawer) langDrawer.classList.remove('is-open');
            burger.setAttribute('aria-expanded', 'false');
        };

        burger.addEventListener('click', () => {
            const open = drawer.classList.toggle('is-open');
            burger.classList.toggle('is-open', open);
            if (langDrawer) langDrawer.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        drawer.querySelectorAll('a').forEach((a) =>
            a.addEventListener('click', close)
        );

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    }
})();
