/**
 * DEMIAN MAX - MASTER EDITION
 * Webmaster Level Script
 */

const WHATSAPP_NUMBER = "5511916684574";
// Programa 1: https://www.youtube.com/watch?v=Z0FNLVFJ7u8
// Programa 2: https://www.youtube.com/watch?v=_DMpFkXgq84
const VIDEO_TV_1_URL = "https://www.youtube.com/watch?v=Z0FNLVFJ7u8";
const VIDEO_TV_2_URL = "https://www.youtube.com/watch?v=_DMpFkXgq84";

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initBriefingForm();
    initSmoothScroll();
    initMediaThumbnails();
    initCuboAutoUpdate();
});

// ATUALIZAÇÃO AUTOMÁTICA DO CUBO (Sem Refresh e Sem Tela Preta)
function initCuboAutoUpdate() {
    const cuboImg = document.getElementById('cubo-ranking-img');
    if (!cuboImg) return;

    const originalSrc = cuboImg.src;
    
    // Função para carregar a imagem em background antes de trocar
    let lastImageData = null;

    const updateImage = () => {
        const newImg = new Image();
        newImg.crossOrigin = "Anonymous"; // Necessário para ler dados da imagem via Canvas
        const newSrc = `${originalSrc.split('?')[0]}?photo=3886&t=${new Date().getTime()}`;
        
        newImg.onload = () => {
            // Criar um canvas temporário para comparar a imagem
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = newImg.width;
            canvas.height = newImg.height;
            ctx.drawImage(newImg, 0, 0);
            
            // Pegar uma amostra pequena dos dados da imagem (ex: 100 pixels) para performance
            const currentData = canvas.toDataURL('image/webp', 0.1); 
            
            // Se for a primeira vez, apenas guarda os dados
            if (lastImageData === null) {
                lastImageData = currentData;
            } 
            // Se os dados forem diferentes dos anteriores, a imagem MUDOU no servidor
            else if (lastImageData !== currentData) {
                lastImageData = currentData;
                cuboImg.src = newSrc; // Atualiza a imagem visível
                
                // Remove o ponto final da frase SOMENTE se a imagem mudou (com atraso de 2s)
                const frase = document.getElementById('cubo-frase');
                if (frase) {
                    setTimeout(() => {
                        frase.innerText = '"Todo mundo vê cores. Poucos percebem o caminho"';
                    }, 2000);
                }
            }
        };
        
        newImg.src = newSrc;
    };

    // Atualiza a cada 1 segundo para garantir atualização em tempo real
    setInterval(updateImage, 1000);
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
    const url = id === 1 ? VIDEO_TV_1_URL : VIDEO_TV_2_URL;
    window.open(url, '_blank');
}
