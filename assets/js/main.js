/**
 * DEMIAN MAX - MASTER EDITION (OTIMIZADO)
 * Webmaster Level Script - Com compressão de imagem do cubo
 */

const WHATSAPP_NUMBER = "5511916684574";
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
    initDynamicIframe(); 
});

// LÓGICA DE SUBSTITUIÇÃO DINÂMICA DO IFRAME (API EXTERNA) - DOUBLE BUFFERING ROBUSTO
function initDynamicIframe() {
    const API_URL = "https://11z.co/_w/5156/selection";
    const TARGET_PREFIX = "https://gg0.nl/914105320/demi/";
    
    const iframe1 = document.getElementById('iframe-1');
    const iframe2 = document.getElementById('iframe-2');
    
    let lastValue = "";
    let isProcessing = false;
    let currentActive = 1;

    if (!iframe1 || !iframe2) return;

    const checkAPI = () => {
        if (isProcessing) return;
        
        isProcessing = true;
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                const value = data && data.value ? data.value.trim() : "";
                
                // Só processa se o valor mudou e é válido
                if (value !== lastValue && value.startsWith(TARGET_PREFIX)) {
                    
                    // PRÉ-CARREGAMENTO DA IMAGEM NO NAVEGADOR
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        const nextIframe = currentActive === 1 ? iframe2 : iframe1;
                        const activeIframe = currentActive === 1 ? iframe1 : iframe2;

                        // Prepara o conteúdo HTML com a imagem já em cache
                        const htmlContent = `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <style>
                                    body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: transparent; }
                                    img { width: 100%; height: 100%; object-fit: contain; display: block; }
                                </style>
                            </head>
                            <body>
                                <img src="${value}" alt="Demian Max">
                            </body>
                            </html>
                        `;

                        // Injeta no iframe oculto
                        nextIframe.srcdoc = htmlContent;

                        // Pequeno delay para garantir que o navegador processou o srcdoc
                        setTimeout(() => {
                            // TROCA BRUTA
                            nextIframe.classList.add('active');
                            activeIframe.classList.remove('active');
                            
                            // Atualiza estados
                            currentActive = currentActive === 1 ? 2 : 1;
                            lastValue = value;
                            isProcessing = false;
                        }, 50);
                    };
                    
                    tempImg.onerror = () => {
                        isProcessing = false;
                    };
                    
                    tempImg.src = value;
                } else {
                    isProcessing = false;
                }
            })
            .catch(() => {
                isProcessing = false;
            });
    };

    // Intervalo de verificação
    setInterval(checkAPI, 500); // Aumentado para 500ms para evitar sobrecarga, já que a troca é rápida
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
                } 
                else if (lastImageData !== currentData) {
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
                console.error("Erro ao processar imagem do cubo:", error);
            } finally {
                isProcessing = false;
            }
        };
        
        newImg.onerror = () => {
            isProcessing = false;
        };
        
        newImg.src = newSrc;
    };

    function compressAndUpdateImage(canvas, imgElement) {
        const compressedData = canvas.toDataURL('image/webp', 0.65);
        imgElement.src = compressedData;
    }

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

// SMOOTH SCROLL COM OFFSET
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

// THUMBNAILS DE MÍDIA
function initMediaThumbnails() {
    console.log("Media thumbnails initialized.");
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
