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
    const updateImage = () => {
        const newImg = new Image();
        // Adiciona um timestamp para evitar cache do navegador
        const newSrc = `${originalSrc.split('?')[0]}?photo=3886&t=${new Date().getTime()}`;
        
        newImg.onload = () => {
            cuboImg.src = newSrc; // Só troca quando a nova estiver pronta
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
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 40;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// THUMBNAILS DE MÍDIA — substitui imagens estáticas por thumbnails do YouTube com play overlay
function initMediaThumbnails() {
    const mediaItems = document.querySelectorAll('[data-video-id]');
    mediaItems.forEach(item => {
        const videoId = item.getAttribute('data-video-id');
        if (!videoId) return;
        const img = item.querySelector('img');
        if (img) {
            img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
    });
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
