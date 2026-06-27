/**
 * DEMIAN MAX - MASTER EDITION (OTIMIZADO)
 * Webmaster Level Script - Com compressão de imagem do cubo
 * Wake Lock Triple Layer: Video + Silent Audio + Native API
 */

const WHATSAPP_NUMBER = "5511916684574";
const VIDEO_TV_1_URL = "https://youtu.be/Z0FNLVFJ7u8";
const VIDEO_TV_2_URL = "https://youtu.be/_DMpFkXgq84?t=21";
const VIDEO_TV_3_URL = "https://youtu.be/DjsEQ21bZ-M?t=24";

// Instância Global do NoSleep
let noSleep = null;
if (typeof NoSleep !== 'undefined') {
    noSleep = new NoSleep();
}

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initBriefingForm();
    initSmoothScroll();
    initMediaThumbnails();
    initCuboAutoUpdate();
    initTripleWakeLock();
});

/**
 * TRIPLE WAKE LOCK STRATEGY
 * Camada 1: Native Wake Lock API
 * Camada 2: NoSleep.js (Invisible Video)
 * Camada 3: Silent Audio Loop
 */
function initTripleWakeLock() {
    const heroVideo = document.getElementById('heroVideo');
    const silentAudio = document.getElementById('silentAudio');
    let wakeLockSentinel = null;

    // Função para ativar tudo
    const activateAll = async () => {
        console.log("🚀 Ativando Triple Wake Lock...");

        // 1. Native Wake Lock API
        if ('wakeLock' in navigator) {
            try {
                wakeLockSentinel = await navigator.wakeLock.request('screen');
                console.log("✅ Native Wake Lock Ativo");
            } catch (err) {
                console.warn("❌ Falha Native Wake Lock:", err);
            }
        }

        // 2. NoSleep.js (Vídeo Invisível)
        if (noSleep) {
            try {
                noSleep.enable();
                console.log("✅ NoSleep.js Ativo");
            } catch (err) {
                console.warn("❌ Falha NoSleep.js:", err);
            }
        }

        // 3. Silent Audio Loop
        if (silentAudio) {
            silentAudio.play().then(() => {
                console.log("✅ Silent Audio Ativo");
            }).catch(err => {
                console.warn("❌ Falha Silent Audio:", err);
            });
        }

        // 4. Hero Video (Reforço)
        if (heroVideo && heroVideo.paused) {
            heroVideo.play().catch(err => console.log("Hero Video aguardando...", err));
        }

        // 5. Sinal Visual (Terceira linha do menu)
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.classList.add('wake-lock-active');
        }
    };

    // Ativa apenas em interações diretas (ignora scroll)
    ["click", "touchstart", "pointerdown", "keydown"].forEach(evt => {
        document.addEventListener(evt, activateAll, { once: false });
    });

    // Reativa quando a página volta a ficar visível
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            activateAll();
        }
    });
}

// ATUALIZAÇÃO AUTOMÁTICA DO CUBO (Otimizado com compressão)
function initCuboAutoUpdate() {
    const cuboImg = document.getElementById('cubo-ranking-img');
    if (!cuboImg) return;

    const originalSrc = cuboImg.src;
    let lastImageData = null;
    let isProcessing = false;

    const updateImage = () => {
        if (isProcessing) return;
        isProcessing = true;
        const newImg = new Image();
        newImg.crossOrigin = "Anonymous";
        const newSrc = `${originalSrc.split('?')[0]}?photo=3886&t=${new Date().getTime()}`;
        
        newImg.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = newImg.width;
                canvas.height = newImg.height;
                ctx.drawImage(newImg, 0, 0);
                const currentData = canvas.toDataURL('image/webp', 0.1);
                
                if (lastImageData === null) {
                    lastImageData = currentData;
                    compressAndUpdateImage(canvas, cuboImg);
                } else if (lastImageData !== currentData) {
                    lastImageData = currentData;
                    compressAndUpdateImage(canvas, cuboImg);
                    const frase = document.getElementById('cubo-frase');
                    if (frase) {
                        setTimeout(() => {
                            frase.innerText = '"Todo mundo vê cores. Poucos percebem o caminho"';
                        }, 1000);
                    }
                }
            } catch (error) {
                console.error("Erro cubo:", error);
            } finally {
                isProcessing = false;
            }
        };
        newImg.onerror = () => { isProcessing = false; };
        newImg.src = newSrc;
    };

    function compressAndUpdateImage(canvas, imgElement) {
        const compressedData = canvas.toDataURL('image/webp', 0.65);
        imgElement.src = compressedData;
    }
    setInterval(updateImage, 2000);
}

function initHeader() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
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
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const header = document.querySelector('.header');
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

function initMediaThumbnails() {
    console.log("Media thumbnails initialized.");
}

function initBriefingForm() {
    const form = document.getElementById('briefingForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        let message = `Olá, Assessoria Comercial do Demian Max. Gostaria de solicitar uma proposta.\n\n`;
        message += `*Nome:* ${data.nome}\n`;
        message += `*Empresa:* ${data.empresa}\n`;
        message += `*WhatsApp:* ${data.whatsapp}\n`;
        message += `*E-mail:* ${data.email}\n`;
        message += `*Mensagem:* ${data.mensagem || 'Nenhuma'}`;
        window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`, '_blank');
    });
}

function openTVVideo(id) {
    let url;
    if (id === 1) url = VIDEO_TV_1_URL;
    else if (id === 2) url = VIDEO_TV_2_URL;
    else if (id === 3) url = VIDEO_TV_3_URL;
    window.open(url, '_blank');
}
