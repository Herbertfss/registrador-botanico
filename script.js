// Registrador Botânico - Guia Inteligente de Botânica
// Script básico de inicialização

document.addEventListener('DOMContentLoaded', function () {
  console.log('🌿 Registrador Botânico - Guia Inteligente de Botânica');
  console.log('Sistema inicializado com sucesso!');

  // Animação simples para os cards
  const featureCards = document.querySelectorAll('.feature-card');

  featureCards.forEach((card, index) => {
    // Adiciona um delay para cada card aparecer
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    setTimeout(
      () => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        // Adiciona classe para animação de entrada (mantém compatibilidade)
        card.classList.add('animate-in');
      },
      200 + index * 100
    );
  });

  // Adiciona interação aos cards
  featureCards.forEach((card) => {
    card.addEventListener('click', function () {
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });

  // Verifica se o navegador suporta recursos modernos
  if ('querySelector' in document && 'addEventListener' in window) {
    console.log('✅ Navegador compatível com recursos modernos');
  }

  // Toggle menu mobile
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('nav__menu--open');
    });

    // Fechar menu ao clicar em um link
    navLinks.forEach((link) => {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('nav__menu--open');
      });
    });
  }

  // Botão voltar ao topo
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'inline-flex';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });
  }
});

// Função simples para simular upload de imagem
function simulateImageUpload() {
  alert('Funcionalidade de upload de imagem em desenvolvimento... 🌱');
}

// Função para simular diagnóstico
function simulateDiagnosis() {
  alert('Diagnóstico inteligente em desenvolvimento... 🔍');
}

// Função para lidar com upload de imagem
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    simulateImageUpload();
    // Reset do input para permitir upload do mesmo arquivo novamente
    event.target.value = '';
  }
}

// Função para scroll suave ao topo
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
