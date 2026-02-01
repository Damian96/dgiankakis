import './style.css'
import '@mahozad/theme-switch/dist/theme-switch.min.js';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

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

    if (theme === 'auto' && !document.documentElement.classList.contains('dark')) {
        (document.querySelector('theme-switch') as any)?.click();
    }
});

document.addEventListener("themeToggle", (event: any) => {
    // console.log(`Old theme: ${event.detail.oldState}`);
    // console.log(`New theme: ${event.detail.newState}`);

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

// Home Hero GSAP 3D Animation
gsap.registerPlugin(MotionPathPlugin);

document.addEventListener('DOMContentLoaded', () => {
    const elipses = document.querySelectorAll<SVGEllipseElement>('#home-hero svg ellipse[id^="orbit"]');
    const electrons = document.querySelectorAll<SVGCircleElement>('#home-hero svg circle[class^="e"]');
    const paths: SVGPathElement[][] = [];

    elipses.forEach((ellipse, _) => {
        paths.push(MotionPathPlugin.convertToPath(ellipse));
    });

    // Ellipsis may have >1 electron, so group them accordingly
    const electronsMap: { [key: number]: SVGCircleElement[] } = {};
    electrons.forEach((electron, _) => {
        const ellipseIndex = parseInt(electron.classList[0].replace('e', '')) - 1;
        if (!electronsMap[ellipseIndex]) {
            electronsMap[ellipseIndex] = [];
        }
        electronsMap[ellipseIndex].push(electron);
    });

    // Animate each electron along its corresponding path
    elipses.forEach((_, index) => {
        const path = paths[index];
        const electronsForEllipse = electronsMap[index];

        if (!path || !electronsForEllipse) return;

        electronsForEllipse.forEach((electron, electronIndex) => {
            // const dir = Math.random() > 0.5 ? 1 : -1;

            const jitter = gsap.utils.random(-0.05, 0.05);
            const start = electronIndex / electronsForEllipse.length + jitter;


            gsap.to(electron, {
                duration: gsap.utils.random(4, 6), // slightly different durations for each electron
                repeat: -1,
                yoyo: true,
                ease: 'none',
                motionPath: {
                    path: path[0],
                    align: path[0],
                    alignOrigin: [0.5, 0.5],
                    autoRotate: false,
                    start,
                    end: start + 1
                }
            });
        });
    });
});
// <-- Home Hero GSAP 3D Animation