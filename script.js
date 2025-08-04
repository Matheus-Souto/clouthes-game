// Lista de roupas com imagens reais (pode trocar as URLs por outras de sua preferência)
const clothes = [
  {
    name: 'Scarf',
    translation: 'Cachecol',
    img: 'cachecol.png',
  },
  {
    name: 'Shirt',
    translation: 'Camisa',
    img: 'blusa.png',
  },
  {
    name: 'Flip-flops',
    translation: 'Chinelo',
    img: 'chinelo.png',
  },
  {
    name: 'Dress',
    translation: 'Vestido',
    img: 'vestido.png',
  },
  {
    name: 'Pants',
    translation: 'Calça',
    img: 'calca.png',
  },
  {
    name: 'Sandals',
    translation: 'Sandália',
    img: 'sandalia.png',
  },
  {
    name: 'Coat',
    translation: 'Casaco',
    img: 'casaco.png',
  },
  {
    name: 'Hat',
    translation: 'Touca',
    img: 'touca.png',
  },
  {
    name: 'Boots',
    translation: 'Botas',
    img: 'bota.png',
  },
  {
    name: 'Socks',
    translation: 'Meias',
    img: 'meias.png',
  },
  {
    name: 'Tank Top',
    translation: 'Camiseta',
    img: 'camiseta.png',
  },
];

const clothesList = document.getElementById('clothesList');
const dropArea = document.getElementById('dropArea');
const restartBtn = document.getElementById('restartBtn');
const fireworksContainer = document.getElementById('fireworks');
const congratulationsText = document.getElementById('congratulations');

let dropped = [];

// Variáveis para controle do touch (mobile)
let isDragging = false;
let draggedElement = null;
let touchOffset = { x: 0, y: 0 };
let originalParent = null;
let dragData = {};

// Detectar se é dispositivo móvel
function isMobileDevice() {
  return (
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || 'ontouchstart' in window
  );
}

function renderClothesList() {
  clothesList.innerHTML = '';
  clothes.forEach((item, idx) => {
    // Se já foi dropada, não mostra na lista
    if (dropped.find(d => d.name === item.name)) return;
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.name;
    img.className = 'clothing-img';
    img.draggable = true;
    img.title = `${item.name} (${item.translation})`;
    img.dataset.idx = idx;
    img.addEventListener('dragstart', handleDragStart);
    img.addEventListener('click', () => speakWord(item.name));

    // Touch events para mobile
    img.addEventListener('touchstart', handleTouchStart, { passive: false });
    img.addEventListener('touchmove', handleTouchMove, { passive: false });
    img.addEventListener('touchend', handleTouchEnd, { passive: false });
    clothesList.appendChild(img);
  });
}

function renderDroppedClothes() {
  dropArea.innerHTML = '';
  dropped.forEach((item, index) => {
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.name;
    img.className = 'clothing-img dropped';
    img.style.left = item.position.x + 'px';
    img.style.top = item.position.y + 'px';
    img.title = `${item.name} (${item.translation})`;
    img.draggable = true;
    img.dataset.droppedIndex = index;

    // Eventos para reposicionamento
    img.addEventListener('dragstart', handleDroppedDragStart);
    img.addEventListener('click', () => speakWord(item.name));

    // Touch events para mobile
    img.addEventListener('touchstart', handleTouchStart, { passive: false });
    img.addEventListener('touchmove', handleTouchMove, { passive: false });
    img.addEventListener('touchend', handleTouchEnd, { passive: false });

    dropArea.appendChild(img);
  });
}

function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.idx);
  e.dataTransfer.setData('source', 'clothesList');
}

function handleDroppedDragStart(e) {
  e.dataTransfer.setData('droppedIndex', e.target.dataset.droppedIndex);
  e.dataTransfer.setData('source', 'dropArea');
}

// Touch events para mobile
function handleTouchStart(e) {
  e.preventDefault();
  isDragging = true;
  draggedElement = e.target.cloneNode(true);
  originalParent = e.target.parentNode;

  // Configurar dados do drag
  if (e.target.dataset.idx !== undefined) {
    dragData = {
      idx: e.target.dataset.idx,
      source: 'clothesList',
    };
  } else if (e.target.dataset.droppedIndex !== undefined) {
    dragData = {
      droppedIndex: e.target.dataset.droppedIndex,
      source: 'dropArea',
    };
  }

  const touch = e.touches[0];
  const rect = e.target.getBoundingClientRect();
  touchOffset.x = touch.clientX - rect.left;
  touchOffset.y = touch.clientY - rect.top;

  // Estilizar elemento arrastado
  draggedElement.style.position = 'fixed';
  draggedElement.style.zIndex = '9999';
  draggedElement.style.pointerEvents = 'none';
  draggedElement.style.opacity = '0.8';
  draggedElement.style.transform = 'scale(1.1)';
  draggedElement.style.left = touch.clientX - touchOffset.x + 'px';
  draggedElement.style.top = touch.clientY - touchOffset.y + 'px';

  document.body.appendChild(draggedElement);

  // Adicionar visual feedback no elemento original
  e.target.style.opacity = '0.5';
}

function handleTouchMove(e) {
  if (!isDragging || !draggedElement) return;
  e.preventDefault();

  const touch = e.touches[0];
  draggedElement.style.left = touch.clientX - touchOffset.x + 'px';
  draggedElement.style.top = touch.clientY - touchOffset.y + 'px';

  // Verificar se está sobre a drop area
  const dropAreaRect = dropArea.getBoundingClientRect();
  const isOverDropArea =
    touch.clientX >= dropAreaRect.left &&
    touch.clientX <= dropAreaRect.right &&
    touch.clientY >= dropAreaRect.top &&
    touch.clientY <= dropAreaRect.bottom;

  if (isOverDropArea) {
    dropArea.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
    dropArea.style.transform = 'scale(1.02)';
  } else {
    dropArea.style.backgroundColor = 'transparent';
    dropArea.style.transform = 'scale(1)';
  }
}

function handleTouchEnd(e) {
  if (!isDragging || !draggedElement) return;
  e.preventDefault();

  const touch = e.changedTouches[0];
  const dropAreaRect = dropArea.getBoundingClientRect();
  const isOverDropArea =
    touch.clientX >= dropAreaRect.left &&
    touch.clientX <= dropAreaRect.right &&
    touch.clientY >= dropAreaRect.top &&
    touch.clientY <= dropAreaRect.bottom;

  if (isOverDropArea) {
    // Simular drop
    const x = ((touch.clientX - dropAreaRect.left) / dropAreaRect.width) * 100;
    const y = ((touch.clientY - dropAreaRect.top) / dropAreaRect.height) * 100;

    if (dragData.source === 'clothesList') {
      const idx = dragData.idx;
      if (idx !== undefined) {
        const droppedItem = {
          ...clothes[idx],
          position: { x, y },
        };

        dropped.push(droppedItem);
        playPlimSound();
        renderClothesList();
        renderDroppedClothes();
        updateButtonVisibility();
      }
    } else if (dragData.source === 'dropArea') {
      const droppedIndex = dragData.droppedIndex;
      if (droppedIndex !== undefined) {
        dropped[droppedIndex].position = { x, y };
        renderDroppedClothes();
      }
    }
  }

  // Cleanup
  if (draggedElement) {
    draggedElement.remove();
  }

  // Restaurar elemento original
  const originalElement = document.querySelector(
    `[data-idx="${dragData.idx}"], [data-dropped-index="${dragData.droppedIndex}"]`,
  );
  if (originalElement) {
    originalElement.style.opacity = '1';
  }

  // Restaurar drop area
  dropArea.style.backgroundColor = 'transparent';
  dropArea.style.transform = 'scale(1)';

  // Reset variáveis
  isDragging = false;
  draggedElement = null;
  originalParent = null;
  dragData = {};
}

dropArea.addEventListener('dragover', e => {
  e.preventDefault();
});

dropArea.addEventListener('drop', e => {
  e.preventDefault();
  const source = e.dataTransfer.getData('source');
  const rect = dropArea.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (source === 'clothesList') {
    // Nova roupa sendo adicionada
    const idx = e.dataTransfer.getData('text/plain');
    if (idx !== undefined) {
      const droppedItem = {
        ...clothes[idx],
        position: { x, y },
      };

      dropped.push(droppedItem);
      playPlimSound(); // Toca o som quando nova roupa é adicionada
      renderClothesList();
      renderDroppedClothes();
      updateButtonVisibility();
    }
  } else if (source === 'dropArea') {
    // Reposicionando roupa existente
    const droppedIndex = e.dataTransfer.getData('droppedIndex');
    if (droppedIndex !== undefined) {
      dropped[droppedIndex].position = { x, y };
      renderDroppedClothes();
    }
  }
});

restartBtn.addEventListener('click', async () => {
  if (dropped.length > 0) {
    // Se há roupas na mala, mostra fogos e depois reinicia
    await showFireworks();
    resetGame();
  } else {
    // Se não há roupas, reinicia imediatamente
    resetGame();
  }
});

function updateButtonVisibility() {
  if (dropped.length > 0) {
    restartBtn.classList.add('visible');
  } else {
    restartBtn.classList.remove('visible');
  }
}

function resetGame() {
  dropped = [];
  renderClothesList();
  renderDroppedClothes();
  hideFireworks();
  updateButtonVisibility();
}

function speakWord(word) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = 'en-US';
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
  }
}

function playPlimSound() {
  const audio = new Audio('plim.mp3');
  audio.volume = 1; // Volume a 100%
  audio.play().catch(error => {
    console.log('Não foi possível reproduzir o som:', error);
  });

  // Vibração para dispositivos móveis
  if (isMobileDevice() && 'vibrate' in navigator) {
    navigator.vibrate(100); // Vibrar por 100ms
  }
}

function playFireworksSound() {
  const fireworksAudio = new Audio('fireworks.mp3');
  fireworksAudio.volume = 1; // Volume a 80%
  fireworksAudio.play().catch(error => {
    console.log('Não foi possível reproduzir fireworks.mp3:', error);
  });
}

function playApplausesSound() {
  const applausesAudio = new Audio('applauses.mp3');
  applausesAudio.volume = 0.7; // Volume a 70%
  applausesAudio.play().catch(error => {
    console.log('Não foi possível reproduzir applauses.mp3:', error);
  });
}

function showFireworks() {
  return new Promise(resolve => {
    fireworksContainer.style.display = 'block';
    congratulationsText.style.display = 'block';

    // Tocar os sons da celebração
    playFireworksSound();
    playApplausesSound();

    // Criar múltiplos fogos em intervalos
    const fireworkInterval = setInterval(() => {
      // Criar 2-3 fogos simultaneamente
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        setTimeout(() => createFirework(), i * 100);
      }
    }, 400);

    // Parar após 5 segundos e aguardar mais 2.5 segundos para todas as partículas desaparecerem
    setTimeout(() => {
      clearInterval(fireworkInterval);
      // Aguardar as partículas finalizarem (2.5s de duração da animação das partículas)
      setTimeout(() => {
        resolve();
      }, 2500);
    }, 5000);
  });
}

function hideFireworks() {
  fireworksContainer.style.display = 'none';
  congratulationsText.style.display = 'none';
  fireworksContainer.innerHTML = '';
}

function createFirework() {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  // Posição concentrada no centro da tela (50% +/- 25%)
  const centerX = window.innerWidth * 0.5;
  const variation = window.innerWidth * 0.25;
  const x = centerX + (Math.random() - 0.5) * variation;

  // Altura concentrada no centro-superior (onde está a mala)
  const explosionHeight = 0.15 + Math.random() * 0.3; // Entre 15% e 45% da tela

  // Criar o fogo principal
  const firework = document.createElement('div');
  firework.className = `firework ${color}`;
  firework.style.left = x + 'px';
  firework.style.bottom = '0px';

  fireworksContainer.appendChild(firework);

  // Criar partículas após 0.3 segundos (quando o fogo explode)
  setTimeout(() => {
    createParticles(x, window.innerHeight * explosionHeight, color);
    firework.remove();
  }, 300);
}

function createParticles(x, y, color) {
  const particleCount = 35; // Ainda mais partículas

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = `particle ${color}`;
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';

    // Direção aleatória para as partículas (alcance muito maior)
    const angle = (Math.PI * 2 * i) / particleCount;
    const distance = 150 + Math.random() * 200; // Distância ainda maior
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    particle.style.setProperty('--x', dx + 'px');
    particle.style.setProperty('--y', dy + 'px');
    particle.style.background = getComputedStyle(
      document.querySelector(`.firework.${color}`),
    ).background;
    particle.style.boxShadow = getComputedStyle(
      document.querySelector(`.firework.${color}`),
    ).boxShadow;

    fireworksContainer.appendChild(particle);

    // Remover partícula após animação
    setTimeout(() => {
      particle.remove();
    }, 2500);
  }
}

// Inicialização
renderClothesList();
renderDroppedClothes();
updateButtonVisibility();
