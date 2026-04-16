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
const toastEl = document.getElementById('toast');

// Form inputs
const canalIdInput = document.getElementById('canalId');
const canalFotoInput = document.getElementById('canalFoto');
const canalNombreInput = document.getElementById('canalNombre');
const canalNichoInput = document.getElementById('canalNicho');
const canalSubsInput = document.getElementById('canalSubs');

// Photo upload
const photoUploadArea = document.getElementById('photoUploadArea');
const photoUploadPrompt = document.getElementById('photoUploadPrompt');
const photoPreviewContainer = document.getElementById('photoPreviewContainer');
const photoPreview = document.getElementById('photoPreview');
const removePhotoBtn = document.getElementById('removePhotoBtn');
const canalFotoFile = document.getElementById('canalFotoFile');

// === State ===
let channels = [];

const DEFAULT_AVATAR = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="#e0e0e0"/><text x="50" y="58" text-anchor="middle" fill="#9aa0a6" font-family="sans-serif" font-size="36">?</text></svg>')}`;

function loadChannels() {
  const saved = localStorage.getItem('ios26_tierlist_channels');
  if (saved) {
    try { channels = JSON.parse(saved); } catch(e) { channels = []; }
  }
}

function saveChannels() {
  localStorage.setItem('ios26_tierlist_channels', JSON.stringify(channels));
}

// === Toast ===
let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.add('visible');
  toastTimer = setTimeout(() => toastEl.classList.remove('visible'), 2500);
}

// === Photo Upload ===
function handlePhotoFile(file) {
  if (!file) return;
  if (!file.type.match(/image\/(png|jpeg|webp)/)) {
    showToast('Solo PNG, JPG o WebP');
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    showToast('Máximo 2MB');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    canalFotoInput.value = e.target.result;
    photoPreview.src = e.target.result;
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

photoUploadArea.addEventListener('click', (e) => {
  if (e.target.closest('.remove-photo')) return;
  canalFotoFile.click();
});

canalFotoFile.addEventListener('change', (e) => {
  if (e.target.files[0]) handlePhotoFile(e.target.files[0]);
});

photoUploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  photoUploadArea.classList.add('drag-active');
});
photoUploadArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  photoUploadArea.classList.remove('drag-active');
});
photoUploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  photoUploadArea.classList.remove('drag-active');
  if (e.dataTransfer.files[0]) handlePhotoFile(e.dataTransfer.files[0]);
});

removePhotoBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  resetPhotoUpload();
});

// === Render ===
function renderChannels() {
  document.querySelectorAll('.tier-dropzone').forEach(z => z.innerHTML = '');
  const month = monthSelect.value;
  channels.filter(c => c.month === month).forEach(ch => {
    const card = createCard(ch);
    const zoneId = ch.tier === 'unranked' ? 'zone-unranked' : `zone-${ch.tier}`;
    const zone = document.getElementById(zoneId);
    if (zone) zone.appendChild(card);
  });
}

function createCard(data) {
  const card = document.createElement('div');
  card.className = 'channel-card';
  card.draggable = true;
  card.id = `channel-${data.id}`;

  const img = data.foto || DEFAULT_AVATAR;

  card.innerHTML = `
    <button class="edit-btn" onclick="openEditModal('${data.id}')">
      <span class="material-symbols-rounded">edit</span>
    </button>
    <img src="${img}" alt="${data.nombre}" class="channel-avatar" onerror="this.src='${DEFAULT_AVATAR}'">
    <div class="channel-info">
      <span class="channel-name" title="${data.nombre}">${data.nombre}</span>
      ${data.nicho ? `<span class="channel-niche">${data.nicho}</span>` : ''}
    </div>
    ${data.subs ? `<span class="channel-subs"><span class="material-symbols-rounded">group</span>${data.subs}</span>` : ''}
  `;

  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', data.id);
    card.classList.add('dragging');
    setTimeout(() => card.style.opacity = '0.4', 0);
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    card.style.opacity = '1';
    document.querySelectorAll('.tier-dropzone').forEach(z => z.classList.remove('drag-over'));
  });

  return card;
}

// === Drag & Drop ===
document.querySelectorAll('.tier-dropzone').forEach(zone => {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const id = e.dataTransfer.getData('text/plain');
    const idx = channels.findIndex(c => c.id == id);
    if (idx > -1) {
      channels[idx].tier = zone.dataset.zone;
      saveChannels();
      renderChannels();
    }
  });
});

// === Modal ===
addChannelBtn.addEventListener('click', () => {
  channelForm.reset();
  canalIdInput.value = '';
  resetPhotoUpload();
  modalTitle.textContent = 'Agregar Canal';
  deleteChannelBtn.style.display = 'none';
  modalOverlay.classList.add('active');
});

closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) modalOverlay.classList.remove('active');
});

window.openEditModal = (id) => {
  const ch = channels.find(c => c.id == id);
  if (!ch) return;
  canalIdInput.value = ch.id;
  canalNombreInput.value = ch.nombre;
  canalNichoInput.value = ch.nicho || '';
  canalSubsInput.value = ch.subs || '';
  if (ch.foto) {
    canalFotoInput.value = ch.foto;
    photoPreview.src = ch.foto;
    photoPreviewContainer.style.display = 'flex';
    photoUploadPrompt.style.display = 'none';
  } else {
    resetPhotoUpload();
  }
  modalTitle.textContent = 'Editar Canal';
  deleteChannelBtn.style.display = 'block';
  modalOverlay.classList.add('active');
};

channelForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = canalIdInput.value;
  const data = {
    foto: canalFotoInput.value.trim(),
    nombre: canalNombreInput.value.trim(),
    nicho: canalNichoInput.value.trim(),
    subs: canalSubsInput.value.trim(),
    month: monthSelect.value,
  };
  if (id) {
    const idx = channels.findIndex(c => c.id == id);
    if (idx > -1) channels[idx] = { ...channels[idx], ...data };
  } else {
    data.id = Date.now().toString();
    data.tier = 'unranked';
    channels.push(data);
  }
  saveChannels();
  renderChannels();
  modalOverlay.classList.remove('active');
  showToast('Canal guardado');
});

deleteChannelBtn.addEventListener('click', () => {
  const id = canalIdInput.value;
  if (id) {
    channels = channels.filter(c => c.id != id);
    saveChannels();
    renderChannels();
    modalOverlay.classList.remove('active');
    showToast('Canal eliminado');
  }
});

monthSelect.addEventListener('change', () => renderChannels());

// === Save / Export / Import ===
saveDataBtn.addEventListener('click', () => {
  saveChannels();
  showToast(`Guardado: ${channels.length} canales`);
});

exportDataBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ version: 1, channels }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `tierlist_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Exportado');
});

importDataBtn.addEventListener('click', () => importFileInput.click());

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
        showToast(`Importado: ${channels.length} canales`);
      } else {
        showToast('Archivo inválido');
      }
    } catch { showToast('Error al leer archivo'); }
  };
  reader.readAsText(file);
  importFileInput.value = '';
});

// === Init ===
loadChannels();
if (channels.length === 0) {
  channels = [
    { id: '1', nombre: 'Canal Ejemplo', nicho: 'General', subs: '1K', month: 'Abril', tier: 'unranked', foto: '' },
  ];
  saveChannels();
}
renderChannels();
