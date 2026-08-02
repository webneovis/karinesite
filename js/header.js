/* ==================== HEADER + BURGER MENU ==================== */
(function () {
    'use strict';

    var header  = document.querySelector('.site-header');
    var burger  = document.querySelector('.site-burger');
    var drawer  = document.querySelector('.site-drawer');
    var overlay = document.querySelector('.site-drawer-overlay');
    var root    = document.documentElement;
    var body    = document.body;

    /* ---------- Sticky header state ---------- */
    if (header) {
        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Header slide-in reveal (1s after site becomes visible) ---------- */
    if (header) {
        window.addEventListener('load', function () {
            var restoreScroll = function () {
                if (location.hash) {
                    var target = document.querySelector(location.hash);
                    if (target) {
                        target.scrollIntoView();
                        return;
                    }
                }

                var savedY = sessionStorage.getItem('scrollY');
                if (savedY !== null) {
                    window.scrollTo(0, parseInt(savedY, 10));
                }
            };

            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    restoreScroll();
                    document.body.classList.add('ready');

                    window.setTimeout(function () {
                        header.classList.add('is-visible');
                    }, 200);
                });
            });
        });
    }

    if (!burger || !drawer) return;

    var isOpen = false;
    var savedScrollY = 0;

    function lockScroll() {
        savedScrollY = window.scrollY || window.pageYOffset || 0;
        var gap = window.innerWidth - root.clientWidth;
        root.style.setProperty('--drawer-scrollbar-gap', (gap > 0 ? gap : 0) + 'px');
        root.style.setProperty('--drawer-scroll-top', -savedScrollY + 'px');
        root.classList.add('is-drawer-open');
        body.classList.add('is-drawer-open');
    }

    function unlockScroll() {
        root.classList.remove('is-drawer-open');
        body.classList.remove('is-drawer-open');
        root.style.removeProperty('--drawer-scrollbar-gap');
        root.style.removeProperty('--drawer-scroll-top');
        window.scrollTo(0, savedScrollY);
    }

    function setState(open) {
        open = !!open;
        if (open === isOpen) return;
        isOpen = open;

        burger.classList.toggle('is-open', open);
        drawer.classList.toggle('is-open', open);

        if (overlay) {
            if (open) overlay.removeAttribute('hidden');
            /* force style flush so the fade-in always runs */
            void drawer.offsetWidth;
            overlay.classList.toggle('is-open', open);
        }

        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        drawer.setAttribute('aria-hidden', open ? 'false' : 'true');

        if (open) {
            lockScroll();
        } else {
            unlockScroll();
            if (overlay) {
                window.setTimeout(function () {
                    if (!isOpen) overlay.setAttribute('hidden', '');
                }, 300);
            }
        }
    }

    var close = function () { setState(false); };

    /* ---------- Events ---------- */
    burger.addEventListener('click', function (e) {
        e.preventDefault();
        setState(!isOpen);
    });

    if (overlay) overlay.addEventListener('click', close);

    drawer.addEventListener('click', function (e) {
        if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
        if (isOpen && (e.key === 'Escape' || e.key === 'Esc')) close();
    });

    var onViewportChange = function () {
        if (isOpen && window.innerWidth > 1000) close();
    };
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('orientationchange', function () {
        window.setTimeout(onViewportChange, 100);
    });

    window.addEventListener('pageshow', function () {
        if (!isOpen) {
            root.classList.remove('is-drawer-open');
            body.classList.remove('is-drawer-open');
        }
    });
})();
