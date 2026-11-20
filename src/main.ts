import '@fontsource-variable/manrope/wght.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/sections.css';

import { initContactForm } from './client/contact-form.ts';
import { initHeroCanvas } from './client/hero-canvas.ts';
import { initParallax, initReveal } from './client/motion.ts';
import { initActiveSection, initHeader, initMobileMenu } from './client/navigation.ts';

initHeader();
initMobileMenu();
initActiveSection();
initReveal();
initParallax();
initContactForm();

const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
if (canvas) initHeroCanvas(canvas);
