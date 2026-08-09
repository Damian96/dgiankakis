import './style.css'
import '@mahozad/theme-switch/dist/theme-switch.min.js';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { SplitText } from "gsap/SplitText";

// animate with intersectionObserver only when the flag isMobile is false, i.e. on desktop and tablet, but not on mobile
let isMobile = window.matchMedia("(max-width: 768px)").matches || window.matchMedia("(max-height: 500px)").matches;

document.addEventListener('DOMContentLoaded', () => {
    // check if the user is on mobile or tablet
    isMobile = window.matchMedia("(max-width: 768px)").matches || window.matchMedia("(max-height: 500px)").matches;
});

// also add on resize event listener to update the isMobile flag
window.addEventListener('resize', () => {
    isMobile = window.matchMedia("(max-width: 768px)").matches || window.matchMedia("(max-height: 500px)").matches;
});

const shouldObserve = () => {
    return !isMobile;
};

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

// Home Hero SplitText GSAP Animation
gsap.registerPlugin(SplitText);
document.addEventListener('DOMContentLoaded', () => {
    const heroHeading = document.querySelector('#home-hero-caption > h1');
    if (!heroHeading) return;

    let split = SplitText.create(heroHeading, { type: "words, chars" });

    // now animate the words in a staggered fashion
    gsap.from(split.words, {
        duration: 1,
        y: 100,         // animate from 100px below
        autoAlpha: 0,   // fade in from opacity: 0 and visibility: hidden
        stagger: 0.05,  // 0.05 seconds between each
    });

    const heroSubheadings = document.querySelectorAll('#home-hero-caption > p');
    if (!heroSubheadings.length) return;

    Array.from(heroSubheadings).forEach(p => {
        let splitSub = SplitText.create(p, { type: "words, chars" });

        // now animate the words in a staggered fashion
        gsap.from(splitSub.words, {
            duration: 1,
            y: 100,         // animate from 100px below
            autoAlpha: 0,   // fade in from opacity: 0 and visibility: hidden
            stagger: 0.05,  // 0.05 seconds between each
            delay: 0.25      // start after a short delay
        });
    });

    // intersection observer to trigger the animation when the hero section comes into view
    const heroSection = document.querySelector('#home-hero');
    if (!heroSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const split = SplitText.create(heroHeading, { type: "words, chars" });

                // animate the hero heading and subheadings
                gsap.from(split.words, {
                    duration: 1,
                    y: 100,
                    autoAlpha: 0,
                    stagger: 0.05,
                });

                Array.from(heroSubheadings).forEach(p => {
                    let splitSub = SplitText.create(p, { type: "words, chars" });
                    gsap.from(splitSub.words, {
                        duration: 1,
                        y: 100,
                        autoAlpha: 0,
                        stagger: 0.05,
                        delay: 0.25
                    });
                });
            }
        });
    }, {
        threshold: 0.2,
    });

    if (shouldObserve()) {
        observer.observe(heroSection);
    }
});
// <-- Home Hero SplitText GSAP Animation

const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    const skillsHeading = skillsSection.querySelectorAll('h2');
    if (skillsHeading.length > 0) {
        skillsHeading.forEach(heading => {
            const splitHeading = SplitText.create(heading, { type: "words, chars" });

            const animateSkillsHeading = () => {
                gsap.killTweensOf(splitHeading.words);

                gsap.from(splitHeading.words, {
                    duration: 1,
                    y: 100,         // animate from 100px below
                    autoAlpha: 0,   // fade in from opacity: 0 and visibility: hidden
                    stagger: 0.05,  // 0.05 seconds between each
                });
            };

            const skillsObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateSkillsHeading();
                    }
                });
            }, {
                threshold: 0.2,
            });

            if (shouldObserve()) {
                skillsObserver.observe(skillsSection);
            }
        });
    }

    const skillsListElements = skillsSection.querySelectorAll('ul');
    if (skillsListElements.length > 0) {
        skillsListElements.forEach((skillsList) => {
            const skillsItems = skillsList.querySelectorAll('li');
            if (skillsItems.length > 0) {
                const animateSkillsItems = () => {
                    gsap.killTweensOf(skillsItems);

                    gsap.from(skillsItems, {
                        duration: 1,
                        y: 100,         // animate from 100px below
                        autoAlpha: 0,   // fade in from opacity: 0 and visibility: hidden
                        stagger: 0.05,  // 0.05 seconds between each
                    });
                };

                const skillsListObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            animateSkillsItems();
                        }
                    });
                }, {
                    threshold: 0.2,
                });
                if (shouldObserve()) {
                    skillsListObserver.observe(skillsList);
                }
            }
        });
    }

    // for the skills section's h1 and h1+p, we can use a similar approach to animate them when they come into view
    const skillsSectionHeading = skillsSection.querySelector('h1');
    const skillsSectionParagraph = skillsSection.querySelector('h1 + p');

    if (skillsSectionHeading) {
        const splitSkillsSectionHeading = SplitText.create(skillsSectionHeading, { type: "words" });

        const animateSkillsSectionHeading = () => {
            gsap.killTweensOf(splitSkillsSectionHeading.words);

            gsap.from(splitSkillsSectionHeading.words, {
                duration: 1,
                y: 100,
                autoAlpha: 0,
                stagger: 0.05,
            });
        };

        const skillsSectionHeadingObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateSkillsSectionHeading();
                }
            });
        }, {
            threshold: 0.2,
        });

        if (shouldObserve()) {
            skillsSectionHeadingObserver.observe(skillsSectionHeading);
        }
    }

    if (skillsSectionParagraph) {
        const splitSkillsSectionParagraph = SplitText.create(skillsSectionParagraph, { type: "words" });

        const animateSkillsSectionParagraph = () => {
            gsap.killTweensOf(splitSkillsSectionParagraph.words);

            gsap.from(splitSkillsSectionParagraph.words, {
                duration: 1,
                y: 100,
                autoAlpha: 0,
                stagger: 0.05,
            });
        };

        const skillsSectionParagraphObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateSkillsSectionParagraph();
                }
            });
        }, {
            threshold: 0.2,
        });

        if (shouldObserve()) {
            skillsSectionParagraphObserver.observe(skillsSectionParagraph);
        }
    }
}

// For the hero's section (#home-hero-atomsvg) just animate the svg when it comes into view, via a simple fade-in
const heroSection = document.querySelector('#home-hero-atomsvg');
if (heroSection) {
    const animateHeroSection = () => {
        gsap.killTweensOf(heroSection);

        gsap.from(heroSection, {
            duration: 1,
            y: 100,
            autoAlpha: 0,
        });
    };

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateHeroSection();
            }
        });
    }, {
        threshold: 0.2,
    });

    if (shouldObserve()) {
        heroObserver.observe(heroSection);
    }
}

// For the "Contact" section, we can use a similar approach to animate the heading(.home-contact__left h2)
// and the paragraphs(.home-contact__left p) and the .home-contact__left button
// when they come into view. Same goes for the .home-contact__right h3 and the ul inside it.
const contactSection = document.querySelector('#contact');
if (contactSection) {
    const contactLeftHeading = contactSection.querySelector('.home-contact__left h2');
    const contactLeftParagraphs = contactSection.querySelectorAll('.home-contact__left p');
    const contactLeftButton = contactSection.querySelector('.home-contact__left button');

    const contactRightHeading = contactSection.querySelector('.home-contact__right h3');
    const contactRightListItems = contactSection.querySelectorAll('.home-contact__right ul li');

    if (contactLeftHeading) {
        const splitContactLeftHeading = SplitText.create(contactLeftHeading, { type: "words, chars" });

        const animateContactLeftHeading = () => {
            gsap.killTweensOf(splitContactLeftHeading.words);

            gsap.from(splitContactLeftHeading.words, {
                duration: 1,
                y: 100,
                autoAlpha: 0,
                stagger: 0.05,
            });
        };

        const contactLeftObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateContactLeftHeading();
                }
            });
        }, {
            threshold: 0.2,
        });

        if (shouldObserve()) {
            contactLeftObserver.observe(contactLeftHeading);
        }
    }

    if (contactLeftParagraphs.length > 0) {
        const contactLeftContent = contactSection.querySelector('.home-contact__left');

        const animateContactLeftParagraphs = () => {
            gsap.killTweensOf(contactLeftParagraphs);

            gsap.fromTo(contactLeftParagraphs, {
                y: 100,
                autoAlpha: 0,
            }, {
                duration: 1,
                y: 0,
                autoAlpha: 1,
                stagger: 0.05,
                overwrite: 'auto',
            });
        };

        const contactLeftParagraphsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateContactLeftParagraphs();
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px',
        });

        if (contactLeftContent) {
            if (shouldObserve()) {
                contactLeftParagraphsObserver.observe(contactLeftContent);
            }
        }
    }

    if (contactLeftButton) {
        const animateContactLeftButton = () => {
            gsap.killTweensOf(contactLeftButton);

            gsap.from(contactLeftButton, {
                duration: 1,
                y: 100,
                autoAlpha: 0,
            });
        };

        const contactLeftButtonObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateContactLeftButton();
                }
            });
        }, {
            threshold: 0.2,
        });

        if (shouldObserve()) {
            contactLeftButtonObserver.observe(contactLeftButton);
        }
    }

    if (contactRightHeading) {
        const splitContactRightHeading = SplitText.create(contactRightHeading, { type: "words, chars" });

        const animateContactRightHeading = () => {
            gsap.killTweensOf(splitContactRightHeading.words);

            gsap.from(splitContactRightHeading.words, {
                duration: 1,
                y: 100,
                autoAlpha: 0,
                stagger: 0.05,
            });
        };

        const contactRightObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateContactRightHeading();
                }
            });
        }, {
            threshold: 0.2,
        });

        if (shouldObserve()) {
            contactRightObserver.observe(contactRightHeading);
        }
    }

    if (contactRightListItems.length > 0) {
        const contactRightList = contactSection.querySelector('.home-contact__right ul');

        const animateContactRightListItems = () => {
            gsap.killTweensOf(contactRightListItems);

            gsap.fromTo(contactRightListItems, {
                y: 100,
                autoAlpha: 0,
            }, {
                duration: 1,
                y: 0,
                autoAlpha: 1,
                stagger: 0.05,
                overwrite: 'auto',
            });
        };

        const contactRightListItemsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateContactRightListItems();
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px',
        });

        if (contactRightList) {
            if (shouldObserve()) {
                contactRightListItemsObserver.observe(contactRightList);
            }
        }
    }
}