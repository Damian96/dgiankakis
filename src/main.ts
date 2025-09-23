import './style.css'
import '@mahozad/theme-switch/dist/theme-switch.min.js';

/* Theme-related */
document.addEventListener('DOMContentLoaded', () => {
    // // Whenever the user explicitly chooses light mode
    // localStorage.theme = "light";
    // // Whenever the user explicitly chooses dark mode
    // localStorage.theme = "dark";
    // // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem("theme");

    const theme = localStorage.getItem('theme') ?? 'light';

    // initialize theme based on local storage or default to light
    // but tailwind was already setting it to dark because of system preference
    if (theme === 'light' && document.documentElement.classList.contains('dark')) {
        (document.querySelector('theme-switch') as any)?.click();
    }

    if (theme === 'light' && !document.documentElement.classList.contains('dark')
        && !document.documentElement.classList.contains('light')) {
        document.documentElement.classList.add('light');
    }
});

document.addEventListener("themeToggle", (event: any) => {
    console.log(`Old theme: ${event.detail.oldState}`);
    console.log(`New theme: ${event.detail.newState}`);

    if (event.detail.oldState === "auto") {
        document.documentElement.classList.remove("dark");
    } else {
        document.documentElement.classList.remove(event.detail.oldState);
    }

    if (event.detail.newState === "auto") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.add(event.detail.newState);
    }
});
// <./-- Theme-related

// Decrypt email
var decryptEmail = (encoded: string) => {
    const address = atob(encoded);
    window.open("mailto:" + address);
};

document.getElementById('email-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    const encoded = (e.target as HTMLAnchorElement).getAttribute('data-encoded-email');
    if (encoded) {
        decryptEmail(encoded);
    }
});
// <-- Decrypt email

// Sticky header
const onWindowScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const header = document.getElementById('header');
    header?.classList.toggle('sticky-top', scrollTop > 100);
};

const debounce = (func: () => void, wait: number) => {
    let timeout: number | undefined;
    return () => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            func();
        }, wait);
    };
};

document.addEventListener('scroll', debounce(onWindowScroll, 15));
// <-- Sticky header