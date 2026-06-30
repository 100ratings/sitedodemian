/**
 * DEMIAN MAX - MASTER EDITION (VERSÃO INTEGRADA & CORRIGIDA)
 * Mágica + Performance + Usabilidade
 */

const WHATSAPP_NUMBER = "5511916684574";
const VIDEO_TV_1_URL = "https://youtu.be/Z0FNLVFJ7u8";
const VIDEO_TV_2_URL = "https://youtu.be/_DMpFkXgq84?t=21";
const VIDEO_TV_3_URL = "https://youtu.be/DjsEQ21bZ-M?t=24";
const INJECT_API_URL = "https://11z.co/_w/5156/selection";

let noSleep = null;
if (typeof NoSleep !== 'undefined') {
    noSleep = new NoSleep();
}

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    initHeader();
    initMobileMenu();
    initBriefingForm();
    initSmoothScroll();
    initCuboAutoUpdate();
    initCardAutoUpdate();
    initImageProtection();
    initTripleWakeLock();
});

/**
 * TRIPLE WAKE LOCK STRATEGY
 */
function initTripleWakeLock() {
    const heroVideo = document.getElementById('heroVideo');
    const silentAudio = document.getElementById('silentAudio');
    let isActivated = false;

    const activateAll = async () => {
        if (isActivated) return;
        if (noSleep) noSleep.enable();
        if (silentAudio) silentAudio.play().catch(() => {});
        if (heroVideo && heroVideo.paused) heroVideo.play().catch(() => {});
        isActivated = true;
    };

    ["click", "keydown", "touchstart"].forEach(evt => {
        document.addEventListener(evt, activateAll);
    });
}

/**
 * ATUALIZAÇÃO AUTOMÁTICA DO CUBO
 */
function initCuboAutoUpdate() {
    const cuboImg = document.getElementById('cubo-ranking-img');
    if (!cuboImg) return;

    const originalSrc = cuboImg.src;
    let lastImageData = null;
    let isProcessing = false;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const updateImage = () => {
        if (isProcessing) return;
        isProcessing = true;
        const newImg = new Image();
        newImg.crossOrigin = "Anonymous";
        const newSrc = `${originalSrc.split('?')[0]}?photo=3886&t=${new Date().getTime()}`;
        
        newImg.onload = () => {
            try {
                canvas.width = newImg.width;
                canvas.height = newImg.height;
                ctx.drawImage(newImg, 0, 0);
                const currentData = canvas.toDataURL('image/webp', 0.1);
                
                if (lastImageData !== currentData) {
                    lastImageData = currentData;
                    const compressedData = canvas.toDataURL('image/webp', 0.65);
                    cuboImg.src = compressedData;
                }
            } catch (e) {} finally { isProcessing = false; }
        };
        newImg.onerror = () => { isProcessing = false; };
        newImg.src = newSrc;
    };
    setInterval(updateImage, 2000);
}

/**
 * ATUALIZAÇÃO DA CARTA - LÓGICA DE PERSISTÊNCIA ABSOLUTA
 */
function initCardAutoUpdate() {
    const cardImg = document.getElementById('card-image');
    if (!cardImg) return;

    let isProcessing = false;

    const checkAPI = async () => {
        if (isProcessing) return;
        isProcessing = true;

        try {
            const response = await fetch(`${INJECT_API_URL}?t=${new Date().getTime()}`);
            if (!response.ok) throw new Error();
            
            const data = await response.json();
            const value = data.value;

            if (value && typeof value === 'string' && value.toLowerCase().endsWith('.jpg')) {
                const fileName = value.split('/').pop();
                const newSrc = `demian/${fileName}`;
                
                if (!cardImg.src.includes(fileName)) {
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        cardImg.src = newSrc;
                        localStorage.setItem('last_valid_card', newSrc);
                    };
                    tempImg.src = newSrc;
                }
            }
        } catch (e) {
        } finally {
            isProcessing = false;
        }
    };

    const savedCard = localStorage.getItem('last_valid_card');
    if (savedCard) {
        cardImg.src = savedCard;
    }

    setInterval(checkAPI, 800);
}

/**
 * HEADER & NAVIGATION
 */
function initHeader() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
}

function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const links = document.querySelectorAll('.nav-link');
    
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Fecha o menu ao clicar em qualquer link (Crucial para Mobile)
        links.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * FORMULÁRIO DE BRIEFING & PREENCHIMENTO AUTOMÁTICO
 */
function initBriefingForm() {
    const form = document.getElementById('briefingForm');
    if (!form) return;

    // Função para preencher o formato vindo da URL (ex: ?formato=Corporativo)
    function preencherFormato() {
        const urlParams = new URLSearchParams(window.location.search);
        let formato = urlParams.get('formato');
        
        if (!formato && window.location.hash) {
            const hashPart = window.location.hash.substring(1);
            if (hashPart.includes('?')) {
                const hashParams = new URLSearchParams(hashPart.substring(hashPart.indexOf('?') + 1));
                formato = hashParams.get('formato');
            }
        }

        if (formato) {
            const mensagemField = form.querySelector('[name="mensagem"]');
            if (mensagemField) {
                mensagemField.value = `Interesse no formato: ${formato}`;
                // Faz o scroll até o formulário para o usuário ver que foi preenchido
                setTimeout(() => {
                    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        }
    }

    preencherFormato();
    window.addEventListener('hashchange', preencherFormato);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        let msg = `Olá, Assessoria Comercial do Demian Max. Gostaria de solicitar uma proposta.\n\n*Nome:* ${data.nome}\n*WhatsApp:* ${data.whatsapp}\n*Mensagem:* ${data.mensagem}`;
        window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(msg)}`, '_blank');
    });
}

/**
 * PROTEÇÃO DE IMAGENS
 */
function initImageProtection() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
        img.setAttribute('draggable', 'false');
    });
    const cardImg = document.getElementById('card-image');
    if (cardImg) {
        cardImg.style.pointerEvents = 'none';
        const shield = document.createElement('div');
        Object.assign(shield.style, { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: '10' });
        cardImg.parentElement.style.position = 'relative';
        cardImg.parentElement.appendChild(shield);
    }
}

function openTVVideo(id) {
    const urls = [VIDEO_TV_1_URL, VIDEO_TV_2_URL, VIDEO_TV_3_URL];
    window.open(urls[id-1], '_blank');
}
