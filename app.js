// === DOM Elements ===
const modalOverlay = document.getElementById('channelModal');
const addChannelBtn = document.getElementById('addChannelBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const channelForm = document.getElementById('channelForm');
const modalTitle = document.getElementById('modalTitle');
const deleteChannelBtn = document.getElementById('deleteChannelBtn');
const monthSelect = document.getElementById('monthSelect');
const saveDataBtn = document.getElementById('saveDataBtn');
const exportDataBtn = document.getElementById('exportDataBtn');
const importDataBtn = document.getElementById('importDataBtn');
const importFileInput = document.getElementById('importFileInput');

// Form inputs
const canalIdInput = document.getElementById('canalId');
const canalFotoInput = document.getElementById('canalFoto'); // hidden input for base64
const canalNombreInput = document.getElementById('canalNombre');
const canalNichoInput = document.getElementById('canalNicho');
const canalSubsInput = document.getElementById('canalSubs');

// Photo upload elements
const photoUploadArea = document.getElementById('photoUploadArea');
const photoUploadPrompt = document.getElementById('photoUploadPrompt');
const photoPreviewContainer = document.getElementById('photoPreviewContainer');
const photoPreview = document.getElementById('photoPreview');
const removePhotoBtn = document.getElementById('removePhotoBtn');
const canalFotoFile = document.getElementById('canalFotoFile');

// === State Management ===
let channels = [];

// Default avatar as a tiny SVG data URL so we never rely on external URLs
const DEFAULT_AVATAR = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="#3a3a3c"/><text x="50" y="58" text-anchor="middle" fill="#8e8e93" font-family="sans-serif" font-size="36">?</text></svg>`)}`;

// Load from LocalStorage
function loadChannels() {
  const saved = localStorage.getItem('ios26_tierlist_channels');
  if (saved) {
    try {
      channels = JSON.parse(saved);
    } catch (e) {
      channels = [];
    }
  }
}

function saveChannels() {
  localStorage.setItem('ios26_tierlist_channels', JSON.stringify(channels));
}

// === Toast Notification ===
function showToast(message, type = 'success') {
  // Remove any existing toast
  const existing = document.querySelector('.save-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'save-toast';
  toast.innerHTML = `<i class="ri-checkbox-circle-line"></i> ${message}`;
  
  if (type === 'error') {
    toast.style.background = 'rgba(255, 69, 58, 0.2)';
    toast.style.borderColor = 'rgba(255, 69, 58, 0.4)';
    toast.innerHTML = `<i class="ri-error-warning-line"></i> ${message}`;
  }
  
  document.body.appendChild(toast);
  
  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });
  });
  
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// === Photo Upload Logic ===
function handlePhotoFile(file) {
  if (!file) return;
  
  // Validate file type
  if (!file.type.match(/image\/(png|jpeg|webp)/)) {
    showToast('Solo se permiten imágenes PNG, JPG o WebP', 'error');
    return;
  }
  
  // Validate file size (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    showToast('La imagen no puede superar los 2MB', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Data = e.target.result;
    canalFotoInput.value = base64Data;
    
    // Show preview
    photoPreview.src = base64Data;
    photoPreviewContainer.style.display = 'flex';
    photoUploadPrompt.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function resetPhotoUpload() {
  canalFotoInput.value = '';
  canalFotoFile.value = '';
  photoPreviewContainer.style.display = 'none';
  photoUploadPrompt.style.display = 'flex';
}

// Click to upload
photoUploadArea.addEventListener('click', (e) => {
  if (e.target.closest('.remove-photo-btn')) return; // Don't trigger file dialog when clicking remove
  canalFotoFile.click();
});

canalFotoFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handlePhotoFile(file);
});

// Drag and drop on upload area
photoUploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  photoUploadArea.classList.add('drag-active');
});

photoUploadArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  e.stopPropagation();
  photoUploadArea.classList.remove('drag-active');
});

photoUploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  photoUploadArea.classList.remove('drag-active');
  
  const file = e.dataTransfer.files[0];
  if (file) handlePhotoFile(file);
});

// Remove photo button
removePhotoBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  resetPhotoUpload();
});


// === Rendering Logic ===
function renderChannels() {
  // Clear all dropzones
  document.querySelectorAll('.tier-dropzone').forEach(zone => {
    zone.innerHTML = '';
  });

  const selectedMonth = monthSelect.value;
  const currentMonthChannels = channels.filter(c => c.month === selectedMonth);

  currentMonthChannels.forEach(channel => {
    const card = createChannelCard(channel);
    
    let dropzoneId = channel.tier === 'unranked' ? 'zone-unranked' : `zone-${channel.tier}`;
    let dropzone = document.getElementById(dropzoneId);
    
    if (dropzone) {
      dropzone.appendChild(card);
    }
  });
}

function createChannelCard(data) {
  const card = document.createElement('div');
  card.className = 'channel-card';
  card.draggable = true;
  card.id = `channel-${data.id}`;
  card.style.position = 'relative';
  
  // Anti-gravity animation random delay
  const rndDelay = Math.random() * 2;
  card.style.animation = `float ${3 + Math.random()}s ease-in-out ${rndDelay}s infinite alternate`;

  // Use stored base64 or default avatar
  const imgUrl = data.foto || DEFAULT_AVATAR;

  card.innerHTML = `
    <button class="edit-btn" onclick="openEditModal('${data.id}')">
      <i class="ri-pencil-line"></i>
    </button>
    <img src="${imgUrl}" alt="${data.nombre}" class="channel-avatar" onerror="this.src='${DEFAULT_AVATAR}'">
    <div class="channel-info">
      <span class="channel-name" title="${data.nombre}">${data.nombre}</span>
      ${data.nicho ? `<span class="channel-niche">${data.nicho}</span>` : ''}
    </div>
    ${data.subs ? `<span class="channel-subs"><i class="ri-group-line"></i> ${data.subs}</span>` : ''}
  `;

  // Drag Events
  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', data.id);
    card.classList.add('dragging');
    setTimeout(() => card.style.opacity = '0.5', 0);
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    card.style.opacity = '1';
    document.querySelectorAll('.tier-dropzone').forEach(z => z.classList.remove('drag-over'));
  });

  return card;
}

// Float animation keyframe
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes float {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-4px); }
  }
`;
document.head.appendChild(styleSheet);


// === Drag and Drop Mechanics ===
document.querySelectorAll('.tier-dropzone').forEach(zone => {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drag-over');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    
    const channelId = e.dataTransfer.getData('text/plain');
    const newTier = zone.getAttribute('data-zone');
    
    const channelIndex = channels.findIndex(c => c.id == channelId);
    if (channelIndex > -1) {
      channels[channelIndex].tier = newTier;
      saveChannels();
      renderChannels();
    }
  });
});


// === Modal Actions ===
addChannelBtn.addEventListener('click', () => {
  channelForm.reset();
  canalIdInput.value = '';
  resetPhotoUpload();
  modalTitle.textContent = 'Agregar Canal';
  deleteChannelBtn.style.display = 'none';
  modalOverlay.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

// Close modal on overlay click
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
  }
});

window.openEditModal = (id) => {
  const channel = channels.find(c => c.id == id);
  if (channel) {
    canalIdInput.value = channel.id;
    canalNombreInput.value = channel.nombre;
    canalNichoInput.value = channel.nicho || '';
    canalSubsInput.value = channel.subs || '';
    
    // Load existing photo into preview
    if (channel.foto) {
      canalFotoInput.value = channel.foto;
      photoPreview.src = channel.foto;
      photoPreviewContainer.style.display = 'flex';
      photoUploadPrompt.style.display = 'none';
    } else {
      resetPhotoUpload();
    }
    
    modalTitle.textContent = 'Editar Canal';
    deleteChannelBtn.style.display = 'block';
    modalOverlay.classList.add('active');
  }
};

// Form submit handler
channelForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const idValue = canalIdInput.value;
  const channelData = {
    foto: canalFotoInput.value.trim(),
    nombre: canalNombreInput.value.trim(),
    nicho: canalNichoInput.value.trim(),
    subs: canalSubsInput.value.trim(),
    month: monthSelect.value,
  };
  
  if (idValue) {
    // Edit existing
    const index = channels.findIndex(c => c.id == idValue);
    if (index > -1) {
      channels[index] = { ...channels[index], ...channelData };
    }
  } else {
    // Add new
    channelData.id = Date.now().toString();
    channelData.tier = 'unranked';
    channels.push(channelData);
  }
  
  saveChannels();
  renderChannels();
  modalOverlay.classList.remove('active');
  showToast('Canal guardado correctamente');
});

deleteChannelBtn.addEventListener('click', () => {
  const idValue = canalIdInput.value;
  if (idValue) {
    channels = channels.filter(c => c.id != idValue);
    saveChannels();
    renderChannels();
    modalOverlay.classList.remove('active');
    showToast('Canal eliminado');
  }
});

// Month selection change
monthSelect.addEventListener('change', () => {
  renderChannels();
});


// === Save / Export / Import ===

// Explicit save button
saveDataBtn.addEventListener('click', () => {
  saveChannels();
  
  // Visual feedback
  saveDataBtn.classList.add('saved');
  setTimeout(() => saveDataBtn.classList.remove('saved'), 600);
  
  showToast(`Guardado: ${channels.length} canales almacenados`);
});

// Export as JSON file
exportDataBtn.addEventListener('click', () => {
  const data = {
    version: 1,
    exportDate: new Date().toISOString(),
    channels: channels,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `tierlist_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
  showToast('Archivo exportado correctamente');
});

// Import from JSON file
importDataBtn.addEventListener('click', () => {
  importFileInput.click();
});

importFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = JSON.parse(evt.target.result);
      
      if (data.channels && Array.isArray(data.channels)) {
        channels = data.channels;
        saveChannels();
        renderChannels();
        showToast(`Importado: ${channels.length} canales cargados`);
      } else {
        showToast('Archivo inválido: no contiene canales', 'error');
      }
    } catch (err) {
      showToast('Error al leer el archivo', 'error');
    }
  };
  reader.readAsText(file);
  
  // Reset so the same file can be selected again
  importFileInput.value = '';
});


// === Auto-save on tier drag ===
// Already handled in the drop event above


// === Initialization ===
loadChannels();

// Seed dummy data if completely empty
if (channels.length === 0) {
  channels = [
    { id: '1', nombre: 'Canal Ejemplo', nicho: 'General', subs: '1K', month: 'Abril', tier: 'unranked', foto: '' },
  ];
  saveChannels();
}

renderChannels();
