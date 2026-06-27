/**
 * DEMIAN MAX - MASTER EDITION (OTIMIZADO)
 * Webmaster Level Script - Com compressão de imagem do cubo
 */

const WHATSAPP_NUMBER = "5511916684574";
// Programa 1: https://www.youtube.com/watch?v=Z0FNLVFJ7u8
// Programa 2: https://www.youtube.com/watch?v=_DMpFkXgq84
// Programa 3: https://www.youtube.com/watch?v=DjsEQ21bZ-M
const VIDEO_TV_1_URL = "https://youtu.be/Z0FNLVFJ7u8";
const VIDEO_TV_2_URL = "https://youtu.be/_DMpFkXgq84?t=21";
const VIDEO_TV_3_URL = "https://youtu.be/DjsEQ21bZ-M?t=24";

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initBriefingForm();
    initSmoothScroll();
    initMediaThumbnails();
    initCuboAutoUpdate();
    initHeroVideoWakeLock();
});

// Garante que o vídeo do Hero toque e ajude no Wake Lock
function initHeroVideoWakeLock() {
    const video = document.getElementById('heroVideo');
    if (!video) return;

    // Tenta dar play em qualquer interação caso o autoplay falhe
    const forcePlay = () => {
        if (video.paused) {
            video.play().catch(err => console.log("Aguardando interação para vídeo:", err));
        }
    };

    ["click", "touchstart", "pointerdown", "scroll"].forEach(evt => {
        document.addEventListener(evt, forcePlay, { once: true });
    });
}

// ATUALIZAÇÃO AUTOMÁTICA DO CUBO (Otimizado com compressão)
function initCuboAutoUpdate() {
    const cuboImg = document.getElementById('cubo-ranking-img');
    if (!cuboImg) return;

    const originalSrc = cuboImg.src;
    let lastImageData = null;
    let isProcessing = false; // Evita múltiplas requisições simultâneas

    const updateImage = () => {
        if (isProcessing) return; // Pula se já está processando
        
        isProcessing = true;
        const newImg = new Image();
        newImg.crossOrigin = "Anonymous";
        const newSrc = `${originalSrc.split('?')[0]}?photo=3886&t=${new Date().getTime()}`;
        
        newImg.onload = () => {
            try {
                // Criar um canvas para comparação e compressão
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = newImg.width;
                canvas.height = newImg.height;
                ctx.drawImage(newImg, 0, 0);
                
                // Pegar uma amostra pequena dos dados da imagem para comparação
                const currentData = canvas.toDataURL('image/webp', 0.1);
                
                // Se for a primeira vez, apenas guarda os dados
                if (lastImageData === null) {
                    lastImageData = currentData;
                    // Aplicar compressão na primeira carga
                    compressAndUpdateImage(canvas, cuboImg);
                } 
                // Se os dados forem diferentes dos anteriores, a imagem MUDOU no servidor
                else if (lastImageData !== currentData) {
                    lastImageData = currentData;
                    compressAndUpdateImage(canvas, cuboImg);
                    
                    // Remove o ponto final da frase SOMENTE se a imagem mudou (com atraso de 2s)
                    const frase = document.getElementById('cubo-frase');
                    if (frase) {
                        setTimeout(() => {
                            frase.innerText = '"Todo mundo vê cores. Poucos percebem o caminho"';
                        }, 1000);
                    }
                }
            } catch (error) {
                console.error("Erro ao processar imagem do cubo:", error);
            } finally {
                isProcessing = false;
            }
        };
        
        newImg.onerror = () => {
            console.error("Erro ao carregar imagem do cubo");
            isProcessing = false;
        };
        
        newImg.src = newSrc;
    };

    // Função para comprimir e atualizar a imagem
    function compressAndUpdateImage(canvas, imgElement) {
        // Converter para WebP com qualidade reduzida (mais eficiente)
        const compressedData = canvas.toDataURL('image/webp', 0.65);
        imgElement.src = compressedData;
    }

    // Atualiza a cada 2 segundos (reduzido de 1s para menos requisições)
    setInterval(updateImage, 2000);
}

// HEADER SCROLL
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

// MOBILE MENU
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

// SMOOTH SCROLL COM OFFSET (Resolve o problema de cortar títulos)
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
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// THUMBNAILS DE MÍDIA — usa as imagens locais personalizadas
function initMediaThumbnails() {
    // Mantido apenas para garantir a estrutura, mas sem substituir as imagens locais
    console.log("Media thumbnails initialized with custom local images.");
}

// BRIEFING FORM
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
