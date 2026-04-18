// ========================================
// SPLASH SCREEN
// ========================================
const splashScreen = document.getElementById('splashScreen');
setTimeout(() => {
  splashScreen.classList.add('fade-out');
  setTimeout(() => splashScreen.remove(), 700);
}, 2200);

// ========================================
// FIREBASE CONFIG
// ========================================

// ========================================
// TOOLS OVERLAY
// ========================================
const TOOLS = {
  pexels: { src: 'tools/pexels.html?v=v2', title: 'Clip Downloader — Pexels & Pixabay' },
  workflow: { src: 'tools/workflow.html?v=' + Date.now(), title: 'Flujo de Trabajo (En desarrollo)' }
};

window.openTool = function(toolId) {
  const tool = TOOLS[toolId];
  if (!tool) return;
  const overlay = document.getElementById('toolOverlay');
  const iframe = document.getElementById('toolIframe');
  const title = document.getElementById('toolOverlayTitle');
  title.textContent = tool.title;
  iframe.src = tool.src;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeTool = function() {
  const overlay = document.getElementById('toolOverlay');
  const iframe = document.getElementById('toolIframe');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { iframe.src = ''; }, 300);
};
const firebaseConfig = {
  apiKey: "AIzaSyAKH4fOfPYtREWpclB6bjVjTasIfhhbWTE",
  authDomain: "tierlist-proyects.firebaseapp.com",
  projectId: "tierlist-proyects",
  storageBucket: "tierlist-proyects.firebasestorage.app",
  messagingSenderId: "293664559604",
  appId: "1:293664559604:web:c0f768a41844e17bdfe9a1"
};

// ========================================
// FIREBASE INIT
// ========================================
let firebaseReady = false;
let db = null;
let auth = null;

try {
  if (firebaseConfig.apiKey !== "TU_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    firebaseReady = true;
  }
} catch (e) {
  console.warn("Firebase no configurado, usando modo local", e);
}

// ========================================
// DOM ELEMENTS
// ========================================
const authScreen = document.getElementById('authScreen');
const appShell = document.getElementById('appShell');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const userNameEl = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const toastEl = document.getElementById('toast');

// Tier list elements
const monthSelect = document.getElementById('monthSelect');
const addChannelBtn = document.getElementById('addChannelBtn');
const saveDataBtn = document.getElementById('saveDataBtn');
const exportDataBtn = document.getElementById('exportDataBtn');
const importDataBtn = document.getElementById('importDataBtn');
const importFileInput = document.getElementById('importFileInput');
const publishBtn = document.getElementById('publishBtn');

// Modal
const modalOverlay = document.getElementById('channelModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const channelForm = document.getElementById('channelForm');
const modalTitle = document.getElementById('modalTitle');
const deleteChannelBtn = document.getElementById('deleteChannelBtn');
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

// Community
const communityGrid = document.getElementById('communityGrid');
const communityEmpty = document.getElementById('communityEmpty');
const viewTierlistModal = document.getElementById('viewTierlistModal');
const closeViewModalBtn = document.getElementById('closeViewModalBtn');
const viewTierlistTitle = document.getElementById('viewTierlistTitle');
const viewTierlistContent = document.getElementById('viewTierlistContent');
const deletePubBtn = document.getElementById('deletePublicationBtn');
const downloadJpgBtn = document.getElementById('downloadJpgBtn');
const exportContainer = document.getElementById('exportContainer');
const commentsList = document.getElementById('commentsList');
const commentForm = document.getElementById('commentForm');
const commentInput = document.getElementById('commentInput');

// New Post
const addPostBtn = document.getElementById('addPostBtn');
const postModal = document.getElementById('postModal');
const closePostModalBtn = document.getElementById('closePostModalBtn');
const postForm = document.getElementById('postForm');
const postText = document.getElementById('postText');
const postLink = document.getElementById('postLink');
const postPhotoArea = document.getElementById('postPhotoArea');
const postPhotoPrompt = document.getElementById('postPhotoPrompt');
const postPhotoPreviewContainer = document.getElementById('postPhotoPreviewContainer');
const postPhotoPreview = document.getElementById('postPhotoPreview');
const removePostPhotoBtn = document.getElementById('removePostPhotoBtn');
const postPhotoFile = document.getElementById('postPhotoFile');
const postFotoBase64 = document.getElementById('postFotoBase64');

// Projects
const projectRecipient = document.getElementById('projectRecipient');
const projectMessageForm = document.getElementById('projectMessageForm');
const projectText = document.getElementById('projectText');
const projectLink = document.getElementById('projectLink');
const projectsList = document.getElementById('projectsList');
const projectFileArea = document.getElementById('projectFileArea');
const projectFilePrompt = document.getElementById('projectFilePrompt');
const projectFilePreview = document.getElementById('projectFilePreview');
const projectFileIcon = document.getElementById('projectFileIcon');
const projectFileName = document.getElementById('projectFileName');
const removeProjectFileBtn = document.getElementById('removeProjectFileBtn');
const projectFileInput = document.getElementById('projectFileInput');
const projectFileBase64 = document.getElementById('projectFileBase64');
const projectFileType = document.getElementById('projectFileType');

// ========================================
// STATE
// ========================================
let channels = [];
let currentUser = null; // { uid, email, displayName }
let currentViewingPubId = null;
let currentPublications = [];

const DEFAULT_AVATAR = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="#e0e0e0"/><text x="50" y="58" text-anchor="middle" fill="#9aa0a6" font-family="sans-serif" font-size="36">?</text></svg>')}`;

const TIER_COLORS = { S: '#ea4335', A: '#fa7b17', B: '#f9ab00', C: '#34a853', D: '#4285f4' };

// ========================================
// UTILS
// ========================================
let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.add('visible');
  toastTimer = setTimeout(() => toastEl.classList.remove('visible'), 2500);
}

function loadChannels() {
  const key = currentUser ? `tierlist_${currentUser.uid}` : 'tierlist_local';
  const saved = localStorage.getItem(key);
  if (saved) {
    try { channels = JSON.parse(saved); } catch(e) { channels = []; }
  } else {
    channels = [];
  }
}

function saveChannels() {
  const key = currentUser ? `tierlist_${currentUser.uid}` : 'tierlist_local';
  localStorage.setItem(key, JSON.stringify(channels));
}

// ========================================
// AUTH
// ========================================
const authTabs = document.querySelectorAll('.auth-tab');
authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    authTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const which = tab.dataset.tab;
    loginForm.style.display = which === 'login' ? 'flex' : 'none';
    registerForm.style.display = which === 'register' ? 'flex' : 'none';
    loginError.textContent = '';
    registerError.textContent = '';
  });
});

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (firebaseReady) {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      loginError.textContent = translateFirebaseError(err.code);
    }
  } else {
    // Local mode
    localLogin(email, email.split('@')[0]);
  }
});

// Register
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  registerError.textContent = '';
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;

  if (firebaseReady) {
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });
      // Save user doc
      await db.collection('users').doc(cred.user.uid).set({
        email: email,
        displayName: name,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (err) {
      registerError.textContent = translateFirebaseError(err.code);
    }
  } else {
    localLogin(email, name);
  }
});

function localLogin(email, name) {
  const uid = 'local_' + btoa(email).slice(0, 12);
  currentUser = { uid, email, displayName: name };
  localStorage.setItem('tierlist_local_user', JSON.stringify(currentUser));
  showApp();
}

function localLogout() {
  currentUser = null;
  localStorage.removeItem('tierlist_local_user');
  showAuth();
}

// Logout
logoutBtn.addEventListener('click', () => {
  if (firebaseReady) {
    auth.signOut();
  } else {
    localLogout();
  }
});

// Auth state observer
if (firebaseReady) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      currentUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0]
      };
      showApp();
    } else {
      currentUser = null;
      showAuth();
    }
  });
} else {
  // Check local session
  const localUser = localStorage.getItem('tierlist_local_user');
  if (localUser) {
    try {
      currentUser = JSON.parse(localUser);
      showApp();
    } catch(e) {
      showAuth();
    }
  } else {
    showAuth();
  }
}

function showAuth() {
  authScreen.style.display = 'flex';
  appShell.style.display = 'none';
}

function showApp() {
  authScreen.style.display = 'none';
  appShell.style.display = 'block';
  userNameEl.textContent = currentUser.displayName;
  loadChannels();
  loadProfile();
  if (channels.length === 0) {
    channels = [{ id: '1', nombre: 'Canal Ejemplo', nicho: 'General', subs: '1K', month: 'Abril', tier: 'unranked', foto: '' }];
    saveChannels();
  }
  renderChannels();
  loadCommunity();
}

function translateFirebaseError(code) {
  const errors = {
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'Este email ya está registrado',
    'auth/weak-password': 'La contraseña debe tener mínimo 6 caracteres',
    'auth/invalid-email': 'Email inválido',
    'auth/too-many-requests': 'Demasiados intentos, espera un momento',
  };
  return errors[code] || 'Error: ' + code;
}

// ========================================
// NAVIGATION
// ========================================
const navTabs = document.querySelectorAll('.nav-tab');
const views = { 
  tierlist: document.getElementById('viewTierlist'), 
  projects: document.getElementById('viewProjects'),
  community: document.getElementById('viewCommunity'),
  friends: document.getElementById('viewFriends'),
  tools: document.getElementById('viewTools')
};

navTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    navTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const view = tab.dataset.view;
    Object.entries(views).forEach(([key, el]) => {
      if (el) el.style.display = key === view ? 'block' : 'none';
    });
    if (view === 'community') loadCommunity();
    if (view === 'projects') loadProjects();
    if (view === 'friends') loadFriends();
  });
});

// ========================================
// PHOTO UPLOAD
// ========================================
function handlePhotoFile(file) {
  if (!file || !file.type.match(/image\/(png|jpeg|webp)/)) { showToast('Solo PNG, JPG o WebP'); return; }
  if (file.size > 2 * 1024 * 1024) { showToast('Máximo 2MB'); return; }
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
canalFotoFile.addEventListener('change', (e) => { if (e.target.files[0]) handlePhotoFile(e.target.files[0]); });
photoUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); photoUploadArea.classList.add('drag-active'); });
photoUploadArea.addEventListener('dragleave', (e) => { e.preventDefault(); photoUploadArea.classList.remove('drag-active'); });
photoUploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); photoUploadArea.classList.remove('drag-active');
  if (e.dataTransfer.files[0]) handlePhotoFile(e.dataTransfer.files[0]);
});
removePhotoBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); resetPhotoUpload(); });

// ========================================
// RENDER TIER LIST
// ========================================
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

// Drag & Drop
document.querySelectorAll('.tier-dropzone').forEach(zone => {
  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault(); zone.classList.remove('drag-over');
    const id = e.dataTransfer.getData('text/plain');
    const idx = channels.findIndex(c => c.id == id);
    if (idx > -1) {
      channels[idx].tier = zone.dataset.zone;
      saveChannels();
      renderChannels();
    }
  });
});

// ========================================
// MODAL — Add/Edit Channel
// ========================================
addChannelBtn.addEventListener('click', () => {
  channelForm.reset();
  canalIdInput.value = '';
  resetPhotoUpload();
  modalTitle.textContent = 'Agregar Canal';
  deleteChannelBtn.style.display = 'none';
  modalOverlay.classList.add('active');
});

closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) modalOverlay.classList.remove('active'); });

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
  } else { resetPhotoUpload(); }
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
    saveChannels(); renderChannels();
    modalOverlay.classList.remove('active');
    showToast('Canal eliminado');
  }
});

monthSelect.addEventListener('change', () => renderChannels());

// ========================================
// SAVE / EXPORT / IMPORT
// ========================================
saveDataBtn.addEventListener('click', () => { saveChannels(); showToast(`Guardado: ${channels.length} canales`); });

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
        saveChannels(); renderChannels();
        showToast(`Importado: ${channels.length} canales`);
      }
    } catch { showToast('Error al leer archivo'); }
  };
  reader.readAsText(file);
  importFileInput.value = '';
});

// ========================================
// PUBLISH TO COMMUNITY
// ========================================
publishBtn.addEventListener('click', async () => {
  const month = monthSelect.value;
  const monthChannels = channels.filter(c => c.month === month);
  const ranked = monthChannels.filter(c => c.tier !== 'unranked');

  if (ranked.length === 0) {
    showToast('Clasifica al menos un canal antes de publicar');
    return;
  }

  // Build tiers object
  const tiers = {};
  ['S', 'A', 'B', 'C', 'D'].forEach(t => {
    tiers[t] = monthChannels.filter(c => c.tier === t).map(c => ({
      nombre: c.nombre,
      nicho: c.nicho || '',
      subs: c.subs || '',
      foto: c.foto ? (c.foto.length > 200000 ? '' : c.foto) : ''
    }));
  });

  const publication = {
    userId: currentUser.uid,
    userName: currentUser.displayName,
    month: month,
    tiers: tiers,
    totalChannels: ranked.length,
    publishedAt: new Date().toISOString()
  };

  if (firebaseReady) {
    try {
      // Check if user already published for this month — update or create
      const existing = await db.collection('published_tierlists')
        .where('userId', '==', currentUser.uid)
        .where('month', '==', month)
        .get();

      if (!existing.empty) {
        await existing.docs[0].ref.update({ ...publication, publishedAt: firebase.firestore.FieldValue.serverTimestamp() });
      } else {
        publication.publishedAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection('published_tierlists').add(publication);
      }
      showToast('¡Publicado en la comunidad!');
      loadCommunity();
    } catch (err) {
      console.error(err);
      showToast('Error al publicar');
    }
  } else {
    // Local mode — store in localStorage
    let localCommunity = JSON.parse(localStorage.getItem('tierlist_community') || '[]');
    const existIdx = localCommunity.findIndex(p => p.userId === currentUser.uid && p.month === month);
    if (!publication.id) publication.id = 'loc_' + Date.now().toString();
    
    if (existIdx > -1) {
      publication.id = localCommunity[existIdx].id; // keep id
      localCommunity[existIdx] = publication;
    } else {
      localCommunity.push(publication);
    }
    localStorage.setItem('tierlist_community', JSON.stringify(localCommunity));
    showToast('¡Publicado en la comunidad!');
    loadCommunity();
  }
});

// ========================================
// COMMUNITY — Load & Render
// ========================================
async function loadCommunity() {
  let publications = [];

  if (firebaseReady) {
    try {
      const snap = await db.collection('published_tierlists')
        .orderBy('publishedAt', 'desc')
        .limit(50)
        .get();
      publications = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('Error loading community:', err);
    }
  } else {
    publications = JSON.parse(localStorage.getItem('tierlist_community') || '[]');
    publications.reverse(); // newest first
  }

  currentPublications = publications;
  renderCommunity(publications);
}

function renderCommunity(publications) {
  communityGrid.innerHTML = '';

  if (publications.length === 0) {
    communityGrid.innerHTML = `
      <div class="community-empty">
        <span class="material-symbols-rounded">groups</span>
        <p>Aún no hay tier lists publicadas</p>
        <small>Sé el primero en publicar la tuya</small>
      </div>`;
    return;
  }

  publications.forEach(pub => {
    const card = document.createElement('div');
    card.className = 'community-card';
    
    const initial = (pub.userName || '?')[0].toUpperCase();
    const dateStr = pub.publishedAt
      ? (typeof pub.publishedAt === 'string'
          ? new Date(pub.publishedAt).toLocaleDateString('es')
          : pub.publishedAt.toDate ? pub.publishedAt.toDate().toLocaleDateString('es') : '')
      : '';

    if (pub.type === 'post') {
      card.onclick = () => openViewPost(pub);
      let imageHtml = pub.image ? `<img src="${pub.image}" alt="Imagen aportada" class="post-image">` : '';
      let linkHtml = pub.link ? `<a href="${pub.link}" target="_blank" onclick="event.stopPropagation()" class="post-link"><span class="material-symbols-rounded" style="font-size:16px;">link</span> Enlace</a>` : '';
      
      card.innerHTML = `
        <div class="community-card-header">
          <div class="user-info">
            <div class="user-avatar">${initial}</div>
            <span>${pub.userName}</span>
          </div>
          <span class="month-badge" style="background:var(--primary-light); color:var(--primary);">Comunidad</span>
        </div>
        <div class="post-card-content">
          ${imageHtml}
          <div class="post-text">${pub.text}</div>
          ${linkHtml}
        </div>
        <div class="community-card-footer">${dateStr} · 0 canales</div>
      `;
    } else {
      card.onclick = () => openViewTierlist(pub);

      // Build mini tiers preview
      let tiersHtml = '';
      if (pub.tiers) {
        ['S', 'A', 'B', 'C', 'D'].forEach(tier => {
          const items = pub.tiers[tier] || [];
          if (items.length === 0) return;

          const maxShow = 5;
          let itemsHtml = items.slice(0, maxShow).map(ch => {
            const src = ch.foto || DEFAULT_AVATAR;
            return `<img class="mini-avatar" src="${src}" alt="${ch.nombre}" title="${ch.nombre}" onerror="this.src='${DEFAULT_AVATAR}'">`;
          }).join('');

          if (items.length > maxShow) {
            itemsHtml += `<span class="mini-count">+${items.length - maxShow}</span>`;
          }

          tiersHtml += `
            <div class="mini-tier">
              <div class="mini-tier-label" style="background:${TIER_COLORS[tier]}">${tier}</div>
              <div class="mini-tier-items">${itemsHtml}</div>
            </div>`;
        });
      }

      card.innerHTML = `
        <div class="community-card-header">
          <div class="user-info">
            <div class="user-avatar">${initial}</div>
            <span>${pub.userName}</span>
          </div>
          <span class="month-badge">${pub.month || ''}</span>
        </div>
        <div class="community-card-body">${tiersHtml}</div>
        <div class="community-card-footer">${dateStr} · ${pub.totalChannels || 0} canales</div>
      `;
    }

    communityGrid.appendChild(card);
  });
}

function openViewPost(pub) {
  currentViewingPubId = pub.id;
  viewTierlistTitle.textContent = `Publicación de ${pub.userName}`;
  
  if (currentUser && currentUser.uid === pub.userId) {
    deletePubBtn.style.display = 'flex';
  } else {
    deletePubBtn.style.display = 'none';
  }

  let html = `<div style="padding: 16px; background:var(--surface); border-radius:var(--radius); border:1px solid var(--border);">`;
  if (pub.image) {
    html += `<img src="${pub.image}" style="width:100%; max-height:400px; object-fit:contain; margin-bottom:16px; border-radius:var(--radius-sm);">`;
  }
  html += `<p style="font-size:1rem; line-height:1.6; white-space:pre-wrap; color:var(--text);">${pub.text}</p>`;
  if (pub.link) {
    html += `<div style="margin-top:12px;"><a href="${pub.link}" target="_blank" style="color:var(--primary); text-decoration:none; display:inline-flex; align-items:center; gap:4px; font-weight:500;"><span class="material-symbols-rounded" style="font-size:18px;">link</span> Abrir enlace</a></div>`;
  }
  html += `</div>`;

  viewTierlistContent.innerHTML = html;
  renderComments(pub.comments || []);
  viewTierlistModal.classList.add('active');
}

// View a community tier list in modal
function openViewTierlist(pub) {
  currentViewingPubId = pub.id;
  viewTierlistTitle.textContent = `${pub.userName} — ${pub.month}`;
  
  // Conditionally show delete button
  if (currentUser && currentUser.uid === pub.userId) {
    deletePubBtn.style.display = 'flex';
  } else {
    deletePubBtn.style.display = 'none';
  }

  let html = '';

  ['S', 'A', 'B', 'C', 'D'].forEach(tier => {
    const items = pub.tiers[tier] || [];
    if (items.length === 0) return;

    const itemsHtml = items.map(ch => {
      const src = ch.foto || DEFAULT_AVATAR;
      return `
        <div class="mini-channel">
          <img class="mini-avatar" src="${src}" alt="${ch.nombre}" onerror="this.src='${DEFAULT_AVATAR}'">
          <span class="mini-channel-name" title="${ch.nombre}">${ch.nombre}</span>
        </div>`;
    }).join('');

    html += `
      <div class="mini-tier">
        <div class="mini-tier-label" style="background:${TIER_COLORS[tier]}">${tier}</div>
        <div class="mini-tier-items">${itemsHtml}</div>
      </div>`;
  });

  viewTierlistContent.innerHTML = html;
  renderComments(pub.comments || []);
  viewTierlistModal.classList.add('active');
}

function renderComments(commentsArray) {
  commentsList.innerHTML = '';
  if (commentsArray.length === 0) {
    commentsList.innerHTML = '<p style="color:var(--text-secondary); font-size: 0.8rem; text-align:center;">No hay comentarios aún. ¡Sé el primero!</p>';
    return;
  }
  
  commentsArray.forEach(c => {
    const div = document.createElement('div');
    div.className = 'comment-item';
    const dateStr = typeof c.createdAt === 'string' ? new Date(c.createdAt).toLocaleDateString() : (c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : '');
    div.innerHTML = `
      <span class="comment-author">${c.userName}</span>
      <span class="comment-text">${c.text}</span>
      <span class="comment-date">${dateStr}</span>
    `;
    commentsList.appendChild(div);
  });
  commentsList.scrollTop = commentsList.scrollHeight; // Auto-scroll to bottom
}

// Comments submission
commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) { showToast('Inicia sesión para comentar'); return; }
  if (!currentViewingPubId) return;

  const text = commentInput.value.trim();
  if (!text) return;

  const newComment = {
    userId: currentUser.uid,
    userName: currentUser.displayName,
    text: text,
    createdAt: new Date().toISOString()
  };

  // Optimistic UI update
  const pubIdx = currentPublications.findIndex(p => p.id === currentViewingPubId);
  if (pubIdx > -1) {
    if (!currentPublications[pubIdx].comments) currentPublications[pubIdx].comments = [];
    currentPublications[pubIdx].comments.push(newComment);
    renderComments(currentPublications[pubIdx].comments);
  }
  commentInput.value = '';

  // Firebase update
  if (firebaseReady) {
    try {
      await db.collection('published_tierlists').doc(currentViewingPubId).update({
        comments: firebase.firestore.FieldValue.arrayUnion(newComment)
      });
    } catch (err) {
      console.error(err);
      showToast('Error al enviar comentario');
    }
  } else {
    // Local fallback
    let localCommunity = JSON.parse(localStorage.getItem('tierlist_community') || '[]');
    const lIdx = localCommunity.findIndex(p => p.id === currentViewingPubId);
    if (lIdx > -1) {
      if (!localCommunity[lIdx].comments) localCommunity[lIdx].comments = [];
      localCommunity[lIdx].comments.push(newComment);
      localStorage.setItem('tierlist_community', JSON.stringify(localCommunity));
    }
  }
});

// Delete Publication
deletePubBtn.addEventListener('click', async () => {
  if (!confirm('¿Estás seguro de eliminar permanentemente esta tier list de la comunidad?')) return;
  if (!currentViewingPubId) return;

  if (firebaseReady) {
    try {
      await db.collection('published_tierlists').doc(currentViewingPubId).delete();
      viewTierlistModal.classList.remove('active');
      showToast('Publicación eliminada');
      loadCommunity();
    } catch(e) {
      showToast('Error al eliminar');
    }
  } else {
    // Local fallback
    let localCommunity = JSON.parse(localStorage.getItem('tierlist_community') || '[]');
    localCommunity = localCommunity.filter(p => p.id !== currentViewingPubId);
    localStorage.setItem('tierlist_community', JSON.stringify(localCommunity));
    viewTierlistModal.classList.remove('active');
    showToast('Publicación eliminada');
    loadCommunity();
  }
});

// Download JPG using html2canvas
downloadJpgBtn.addEventListener('click', async () => {
  if (!currentViewingPubId) return;
  const pub = currentPublications.find(p => p.id === currentViewingPubId);
  if (!pub) return;

  const originalIcon = downloadJpgBtn.innerHTML;
  downloadJpgBtn.innerHTML = '<span class="material-symbols-rounded">hourglass_empty</span>';
  downloadJpgBtn.disabled = true;

  try {
    exportContainer.innerHTML = '';
    
    // Title
    const title = document.createElement('h1');
    title.style.cssText = 'text-align: center; margin-bottom: 24px; font-family: Inter, sans-serif; color: #202124; font-size: 2rem; font-weight: 700;';
    title.textContent = `NeuroFlow — ${pub.userName} — ${pub.month}`;
    exportContainer.appendChild(title);

    // Full List
    const tierListSection = document.createElement('div');
    tierListSection.className = 'tier-list';
    
    ['S', 'A', 'B', 'C', 'D'].forEach(tier => {
      const items = pub.tiers[tier] || [];
      const row = document.createElement('div');
      row.className = 'tier-row';
      row.style.minHeight = '110px';
      
      const label = document.createElement('div');
      label.className = `tier-label tier-${tier.toLowerCase()}`;
      label.textContent = tier;
      
      const zone = document.createElement('div');
      zone.className = `tier-dropzone`;
      zone.style.display = 'flex';
      zone.style.gap = '10px';
      zone.style.padding = '10px';
      zone.style.flexWrap = 'wrap';
      zone.style.background = 'var(--surface)';
      
      items.forEach(data => {
        const card = document.createElement('div');
        card.className = 'channel-card';
        card.style.background = 'var(--surface)';
        card.style.border = '1px solid var(--border)';
        card.style.width = '110px';
        const img = data.foto || DEFAULT_AVATAR;
        card.innerHTML = `
          <img src="${img}" alt="${data.nombre}" class="channel-avatar" style="width:50px; height:50px; flex-shrink:0;" onerror="this.src='${DEFAULT_AVATAR}'">
          <div class="channel-info" style="margin-top: 4px;">
            <span class="channel-name" style="font-size: 0.8rem;" title="${data.nombre}">${data.nombre}</span>
            ${data.nicho ? `<span class="channel-niche" style="font-size:0.7rem;">${data.nicho}</span>` : ''}
          </div>
          ${data.subs ? `<span class="channel-subs" style="justify-content:center; margin-top:2px; font-size:0.7rem;"><span class="material-symbols-rounded" style="font-size:14px">group</span>${data.subs}</span>` : ''}
        `;
        zone.appendChild(card);
      });
      
      row.appendChild(label);
      row.appendChild(zone);
      tierListSection.appendChild(row);
    });
    
    exportContainer.appendChild(tierListSection);

    // Wait minimal time for images to apply
    await new Promise(r => setTimeout(r, 100));

    // Capture offscreen
    const canvas = await html2canvas(exportContainer, {
      backgroundColor: '#f8f9fa',
      scale: 2, // High quality
      useCORS: true
    });

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `NeuroFlow_${pub.userName}_${pub.month}.jpg`;
    a.click();
    showToast('Imagen descargada con éxito');
  } catch (e) {
    console.error('Error html2canvas', e);
    showToast('Hubo un error al generar la imagen');
  } finally {
    downloadJpgBtn.innerHTML = originalIcon;
    downloadJpgBtn.disabled = false;
    exportContainer.innerHTML = ''; // Clean up
  }
});

closeViewModalBtn.addEventListener('click', () => viewTierlistModal.classList.remove('active'));
viewTierlistModal.addEventListener('click', (e) => {
  if (e.target === viewTierlistModal) viewTierlistModal.classList.remove('active');
});

// ========================================
// PROJECTS LOGIC
// ========================================
let allUsers = [];

async function loadProjects() {
  if (!currentUser) return;
  projectRecipient.innerHTML = '<option value="" disabled selected>Cargando usuarios...</option>';
  
  if (firebaseReady) {
    try {
      const snap = await db.collection('users').get();
      allUsers = snap.docs.map(d => ({ uid: d.id, ...d.data() })).filter(u => u.uid !== currentUser.uid);
    } catch(e) { console.error('Error fetching users', e); }
  } else {
    // Mock users locally
    allUsers = [
      { uid: 'u1', displayName: 'Creador Ejemplo 1' },
      { uid: 'u2', displayName: 'Creador Ejemplo 2' }
    ];
  }

  projectRecipient.innerHTML = '<option value="" disabled selected>Selecciona un destinatario</option>';
  allUsers.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.uid;
    opt.textContent = u.displayName || u.email || u.uid;
    projectRecipient.appendChild(opt);
  });

  loadProjectMessages();
}

async function loadProjectMessages() {
  if (!currentUser) return;
  projectsList.innerHTML = '<p style="text-align:center; padding: 20px;">Cargando mensajes...</p>';
  
  let msgs = [];
  if (firebaseReady) {
    try {
      const sentSnap = await db.collection('project_messages').where('senderId', '==', currentUser.uid).get();
      const recSnap = await db.collection('project_messages').where('recipientId', '==', currentUser.uid).get();
      
      msgs = [
        ...sentSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        ...recSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      ];
      msgs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch(e) {}
  } else {
    msgs = JSON.parse(localStorage.getItem('tierlist_projects') || '[]');
    msgs = msgs.filter(m => m.senderId === currentUser.uid || m.recipientId === currentUser.uid);
    msgs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  renderProjectMessages(msgs);
}

function renderProjectMessages(msgs) {
  projectsList.innerHTML = '';
  if (msgs.length === 0) {
    projectsList.innerHTML = `
      <div class="community-empty">
        <span class="material-symbols-rounded">work_history</span>
        <p>No hay mensajes recientes</p>
      </div>`;
    return;
  }

  msgs.forEach(m => {
    const isSent = m.senderId === currentUser.uid;
    const relatedUser = isSent ? m.recipientName : m.senderName;
    const dateStr = new Date(m.createdAt).toLocaleDateString('es') + ' ' + new Date(m.createdAt).toLocaleTimeString('es', {hour: '2-digit', minute:'2-digit'});
    
    const div = document.createElement('div');
    div.className = 'project-message';
    
    let attachHtml = '';
    if (m.fileBase64) {
      if (m.fileType && m.fileType.startsWith('image/')) {
        attachHtml = `<a href="${m.fileBase64}" download="adjunto" class="project-message-attachment">
          <span class="material-symbols-rounded">image</span> Ver imagen adjunta
        </a>`;
      } else {
        attachHtml = `<a href="${m.fileBase64}" download="archivo" class="project-message-attachment">
          <span class="material-symbols-rounded">insert_drive_file</span> Descargar archivo
        </a>`;
      }
    }
    
    let linkHtml = '';
    if (m.link) {
      linkHtml = `<a href="${m.link}" target="_blank" class="project-message-link">${m.link}</a>`;
    }

    div.innerHTML = `
      <div class="project-message-header">
        <span>${isSent ? 'Enviado a:' : 'Recibido de:'} <strong>${relatedUser}</strong></span>
        <span>${dateStr}</span>
      </div>
      <div class="project-message-body">${m.text}</div>
      ${linkHtml}
      ${attachHtml}
    `;
    projectsList.appendChild(div);
  });
}

projectFileArea.addEventListener('click', (e) => {
  if (e.target.closest('.remove-photo')) return;
  projectFileInput.click();
});

projectFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('Máximo 2MB'); return; }
  
  const reader = new FileReader();
  reader.onload = (ev) => {
    projectFileBase64.value = ev.target.result;
    projectFileType.value = file.type;
    projectFileName.textContent = file.name;
    projectFilePrompt.style.display = 'none';
    projectFilePreview.style.display = 'flex';
  };
  reader.readAsDataURL(file);
});

removeProjectFileBtn.addEventListener('click', (e) => {
  e.preventDefault(); e.stopPropagation();
  projectFileInput.value = '';
  projectFileBase64.value = '';
  projectFileType.value = '';
  projectFilePreview.style.display = 'none';
  projectFilePrompt.style.display = 'flex';
});

projectMessageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) return;
  
  const uid = projectRecipient.value;
  const name = projectRecipient.options[projectRecipient.selectedIndex].text;
  
  const msg = {
    senderId: currentUser.uid,
    senderName: currentUser.displayName || currentUser.email,
    recipientId: uid,
    recipientName: name,
    text: projectText.value.trim(),
    link: projectLink.value.trim(),
    fileBase64: projectFileBase64.value,
    fileType: projectFileType.value,
    createdAt: new Date().toISOString()
  };

  const originalIcon = projectMessageForm.querySelector('button[type="submit"]').innerHTML;
  projectMessageForm.querySelector('button[type="submit"]').textContent = 'Enviando...';

  if (firebaseReady) {
    try {
      await db.collection('project_messages').add(msg);
      showToast('Mensaje enviado');
    } catch(e) { showToast('Error al enviar'); }
  } else {
    let hw = JSON.parse(localStorage.getItem('tierlist_projects') || '[]');
    msg.id = 'msg_' + Date.now();
    hw.push(msg);
    localStorage.setItem('tierlist_projects', JSON.stringify(hw));
    showToast('Mensaje enviado (Local)');
  }

  projectMessageForm.reset();
  projectFileBase64.value = '';
  projectFilePreview.style.display = 'none';
  projectFilePrompt.style.display = 'flex';
  projectMessageForm.querySelector('button[type="submit"]').innerHTML = originalIcon;
  loadProjectMessages();
});

// ========================================
// COMMUNITY POST LOGIC
// ========================================
addPostBtn.addEventListener('click', () => {
  postForm.reset();
  postFotoBase64.value = '';
  postPhotoFile.value = '';
  postPhotoPreviewContainer.style.display = 'none';
  postPhotoPrompt.style.display = 'flex';
  postModal.classList.add('active');
});

closePostModalBtn.addEventListener('click', () => postModal.classList.remove('active'));
postModal.addEventListener('click', (e) => { if (e.target === postModal) postModal.classList.remove('active'); });

postPhotoArea.addEventListener('click', (e) => {
  if (e.target.closest('.remove-photo')) return;
  postPhotoFile.click();
});
postPhotoFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.match(/image\/(png|jpeg|webp)/)) { showToast('Solo imágenes'); return; }
  if (file.size > 2 * 1024 * 1024) { showToast('Máximo 2MB'); return; }
  const reader = new FileReader();
  reader.onload = (ev) => {
    postFotoBase64.value = ev.target.result;
    postPhotoPreview.src = ev.target.result;
    postPhotoPrompt.style.display = 'none';
    postPhotoPreviewContainer.style.display = 'flex';
  };
  reader.readAsDataURL(file);
});
removePostPhotoBtn.addEventListener('click', (e) => {
  e.preventDefault(); e.stopPropagation();
  postPhotoFile.value = '';
  postFotoBase64.value = '';
  postPhotoPrompt.style.display = 'flex';
  postPhotoPreviewContainer.style.display = 'none';
});

postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) { showToast('Debes iniciar sesión'); return; }
  
  const publication = {
    type: 'post',
    userId: currentUser.uid,
    userName: currentUser.displayName || currentUser.email,
    text: postText.value.trim(),
    link: postLink.value.trim(),
    image: postFotoBase64.value,
    publishedAt: new Date().toISOString()
  };

  postForm.querySelector('button[type="submit"]').textContent = 'Publicando...';

  if (firebaseReady) {
    try {
      publication.publishedAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('published_tierlists').add(publication);
      showToast('Publicado');
    } catch(err) { showToast('Error al publicar'); }
  } else {
    let lc = JSON.parse(localStorage.getItem('tierlist_community') || '[]');
    publication.id = 'post_' + Date.now();
    lc.push(publication);
    localStorage.setItem('tierlist_community', JSON.stringify(lc));
    showToast('Publicado (Local)');
  }

  postModal.classList.remove('active');
  postForm.querySelector('button[type="submit"]').textContent = 'Publicar en Comunidad';
  loadCommunity();
});

// ========================================
// PROFILE SYSTEM
// ========================================
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
const profileForm = document.getElementById('profileForm');
const profileName = document.getElementById('profileName');
const profileBio = document.getElementById('profileBio');
const profilePhotoPreview = document.getElementById('profilePhotoPreview');
const profilePhotoFile = document.getElementById('profilePhotoFile');
const profilePhotoBase64 = document.getElementById('profilePhotoBase64');
const profilePhotoWrapper = document.getElementById('profilePhotoWrapper');
const removeProfilePhotoBtn = document.getElementById('removeProfilePhotoBtn');
const profileAvatarInitial = document.getElementById('profileAvatarInitial');

let userProfile = { photo: '', name: '', bio: '' };

function loadProfile() {
  if (!currentUser) return;
  const key = `tierlist_profile_${currentUser.uid}`;
  const saved = localStorage.getItem(key);
  if (saved) {
    try { userProfile = JSON.parse(saved); } catch(e) { userProfile = { photo: '', name: '', bio: '' }; }
  } else {
    userProfile = { photo: '', name: currentUser.displayName || '', bio: '' };
  }

  // Also load from Firebase if available
  if (firebaseReady) {
    db.collection('users').doc(currentUser.uid).get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        if (data.profilePhoto) userProfile.photo = data.profilePhoto;
        if (data.bio) userProfile.bio = data.bio;
        if (data.displayName) userProfile.name = data.displayName;
        saveProfileLocal();
        updateProfileUI();
      }
    }).catch(() => {});
  }

  updateProfileUI();
}

function saveProfileLocal() {
  if (!currentUser) return;
  const key = `tierlist_profile_${currentUser.uid}`;
  localStorage.setItem(key, JSON.stringify(userProfile));
}

function updateProfileUI() {
  const initial = (userProfile.name || currentUser?.displayName || '?')[0].toUpperCase();
  profileAvatarInitial.textContent = initial;
  
  const btnEl = document.getElementById('profileBtn');
  if (userProfile.photo) {
    btnEl.innerHTML = `<img src="${userProfile.photo}" alt="Perfil" class="profile-avatar-img">`;
  } else {
    btnEl.innerHTML = `<span class="profile-avatar-initial" id="profileAvatarInitial">${initial}</span>`;
  }

  if (userProfile.name && userProfile.name !== currentUser.displayName) {
    userNameEl.textContent = userProfile.name;
  }
}

profileBtn.addEventListener('click', () => {
  profileName.value = userProfile.name || currentUser.displayName || '';
  profileBio.value = userProfile.bio || '';
  
  if (userProfile.photo) {
    profilePhotoPreview.src = userProfile.photo;
    profilePhotoBase64.value = userProfile.photo;
    removeProfilePhotoBtn.style.display = 'inline-flex';
  } else {
    profilePhotoPreview.src = DEFAULT_AVATAR;
    profilePhotoBase64.value = '';
    removeProfilePhotoBtn.style.display = 'none';
  }
  
  profileModal.classList.add('active');
});

closeProfileModalBtn.addEventListener('click', () => profileModal.classList.remove('active'));
profileModal.addEventListener('click', (e) => { if (e.target === profileModal) profileModal.classList.remove('active'); });

profilePhotoWrapper.addEventListener('click', () => profilePhotoFile.click());

profilePhotoFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.match(/image\/(png|jpeg|webp)/)) { showToast('Solo PNG, JPG o WebP'); return; }
  if (file.size > 2 * 1024 * 1024) { showToast('Máximo 2MB'); return; }
  const reader = new FileReader();
  reader.onload = (ev) => {
    profilePhotoPreview.src = ev.target.result;
    profilePhotoBase64.value = ev.target.result;
    removeProfilePhotoBtn.style.display = 'inline-flex';
  };
  reader.readAsDataURL(file);
});

removeProfilePhotoBtn.addEventListener('click', () => {
  profilePhotoPreview.src = DEFAULT_AVATAR;
  profilePhotoBase64.value = '';
  profilePhotoFile.value = '';
  removeProfilePhotoBtn.style.display = 'none';
});

profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) return;

  userProfile.name = profileName.value.trim();
  userProfile.bio = profileBio.value.trim();
  userProfile.photo = profilePhotoBase64.value;
  
  saveProfileLocal();
  updateProfileUI();
  userNameEl.textContent = userProfile.name;
  currentUser.displayName = userProfile.name;

  if (firebaseReady) {
    try {
      await db.collection('users').doc(currentUser.uid).set({
        displayName: userProfile.name,
        bio: userProfile.bio,
        profilePhoto: userProfile.photo.length > 200000 ? '' : userProfile.photo,
        email: currentUser.email
      }, { merge: true });
      
      // Also update auth profile
      if (auth.currentUser) {
        await auth.currentUser.updateProfile({ displayName: userProfile.name });
      }
    } catch(err) {
      console.error('Error saving profile', err);
    }
  }
  
  profileModal.classList.remove('active');
  showToast('Perfil actualizado');
});

// ========================================
// FRIENDS SYSTEM
// ========================================
const friendSearchInput = document.getElementById('friendSearchInput');
const friendSearchResults = document.getElementById('friendSearchResults');
const friendRequestsSection = document.getElementById('friendRequestsSection');
const friendRequestsList = document.getElementById('friendRequestsList');
const friendsList = document.getElementById('friendsList');

let searchTimeout;

friendSearchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  const query = friendSearchInput.value.trim().toLowerCase();
  if (query.length < 2) {
    friendSearchResults.innerHTML = '';
    friendSearchResults.style.display = 'none';
    return;
  }
  searchTimeout = setTimeout(() => searchUsers(query), 400);
});

async function searchUsers(query) {
  let results = [];

  if (firebaseReady) {
    try {
      const snap = await db.collection('users').get();
      results = snap.docs
        .map(d => ({ uid: d.id, ...d.data() }))
        .filter(u => u.uid !== currentUser.uid)
        .filter(u => {
          const name = (u.displayName || '').toLowerCase();
          const email = (u.email || '').toLowerCase();
          return name.includes(query) || email.includes(query);
        })
        .slice(0, 10);
    } catch(e) { console.error(e); }
  } else {
    // Local mode
    const localUsers = JSON.parse(localStorage.getItem('tierlist_all_users') || '[]');
    results = localUsers.filter(u => u.uid !== currentUser.uid && (
      (u.displayName || '').toLowerCase().includes(query) ||
      (u.email || '').toLowerCase().includes(query)
    ));
  }

  renderSearchResults(results);
}

function renderSearchResults(results) {
  if (results.length === 0) {
    friendSearchResults.innerHTML = '<div class="search-result-empty">No se encontraron usuarios</div>';
    friendSearchResults.style.display = 'block';
    return;
  }

  const myFriends = getMyFriends();
  const myRequests = getSentRequests();

  friendSearchResults.innerHTML = results.map(u => {
    const initial = (u.displayName || u.email || '?')[0].toUpperCase();
    const photo = u.profilePhoto ? `<img src="${u.profilePhoto}" class="friend-result-avatar">` : `<div class="friend-result-initial">${initial}</div>`;
    const isFriend = myFriends.some(f => f.uid === u.uid);
    const isPending = myRequests.some(r => r.to === u.uid);
    
    let actionBtn = '';
    if (isFriend) {
      actionBtn = '<span class="friend-status-badge">✓ Amigos</span>';
    } else if (isPending) {
      actionBtn = '<span class="friend-status-badge pending">Pendiente</span>';
    } else {
      actionBtn = `<button class="btn-add-friend" onclick="sendFriendRequest('${u.uid}', '${(u.displayName || '').replace(/'/g, "\\'")}')"><span class="material-symbols-rounded">person_add</span></button>`;
    }

    return `
      <div class="search-result-item">
        ${photo}
        <div class="search-result-info">
          <span class="search-result-name">${u.displayName || 'Sin nombre'}</span>
          <span class="search-result-email">${u.email || ''}</span>
        </div>
        ${actionBtn}
      </div>`;
  }).join('');
  
  friendSearchResults.style.display = 'block';
}

// Friend requests and friends storage
function getMyFriends() {
  if (!currentUser) return [];
  return JSON.parse(localStorage.getItem(`tierlist_friends_${currentUser.uid}`) || '[]');
}

function saveMyFriends(friends) {
  if (!currentUser) return;
  localStorage.setItem(`tierlist_friends_${currentUser.uid}`, JSON.stringify(friends));
}

function getSentRequests() {
  if (!currentUser) return [];
  return JSON.parse(localStorage.getItem(`tierlist_sent_requests_${currentUser.uid}`) || '[]');
}

function saveSentRequests(requests) {
  if (!currentUser) return;
  localStorage.setItem(`tierlist_sent_requests_${currentUser.uid}`, JSON.stringify(requests));
}

function getReceivedRequests() {
  if (!currentUser) return [];
  return JSON.parse(localStorage.getItem(`tierlist_received_requests_${currentUser.uid}`) || '[]');
}

function saveReceivedRequests(requests) {
  if (!currentUser) return;
  localStorage.setItem(`tierlist_received_requests_${currentUser.uid}`, JSON.stringify(requests));
}

window.sendFriendRequest = async function(toUid, toName) {
  if (!currentUser) return;

  const request = {
    from: currentUser.uid,
    fromName: currentUser.displayName || currentUser.email,
    to: toUid,
    toName: toName,
    createdAt: new Date().toISOString()
  };

  if (firebaseReady) {
    try {
      await db.collection('friend_requests').add(request);
      showToast(`Solicitud enviada a ${toName}`);
    } catch(e) { showToast('Error al enviar solicitud'); return; }
  } else {
    // Save to both sides locally
    const sentReqs = getSentRequests();
    sentReqs.push(request);
    saveSentRequests(sentReqs);

    // Also save to receiver's received requests
    let receivedKey = `tierlist_received_requests_${toUid}`;
    let received = JSON.parse(localStorage.getItem(receivedKey) || '[]');
    received.push(request);
    localStorage.setItem(receivedKey, JSON.stringify(received));

    showToast(`Solicitud enviada a ${toName}`);
  }

  // Refresh
  const query = friendSearchInput.value.trim().toLowerCase();
  if (query.length >= 2) searchUsers(query);
  loadFriends();
};

window.acceptFriendRequest = async function(fromUid, fromName) {
  if (!currentUser) return;

  const friend = { uid: fromUid, displayName: fromName, addedAt: new Date().toISOString() };
  
  // Add to my friends
  const myFriends = getMyFriends();
  if (!myFriends.some(f => f.uid === fromUid)) {
    myFriends.push(friend);
    saveMyFriends(myFriends);
  }
  
  // Add me to their friends
  if (!firebaseReady) {
    let theirKey = `tierlist_friends_${fromUid}`;
    let theirFriends = JSON.parse(localStorage.getItem(theirKey) || '[]');
    if (!theirFriends.some(f => f.uid === currentUser.uid)) {
      theirFriends.push({ uid: currentUser.uid, displayName: currentUser.displayName, addedAt: new Date().toISOString() });
      localStorage.setItem(theirKey, JSON.stringify(theirFriends));
    }
  }
  
  // Remove from received requests
  let received = getReceivedRequests();
  received = received.filter(r => r.from !== fromUid);
  saveReceivedRequests(received);

  if (firebaseReady) {
    try {
      // Add friendship docs
      await db.collection('friendships').add({
        users: [currentUser.uid, fromUid],
        userNames: { [currentUser.uid]: currentUser.displayName, [fromUid]: fromName },
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Delete the request
      const reqSnap = await db.collection('friend_requests')
        .where('from', '==', fromUid)
        .where('to', '==', currentUser.uid)
        .get();
      reqSnap.forEach(doc => doc.ref.delete());
    } catch(e) { console.error(e); }
  }

  showToast(`${fromName} ahora es tu amigo`);
  loadFriends();
};

window.rejectFriendRequest = function(fromUid) {
  let received = getReceivedRequests();
  received = received.filter(r => r.from !== fromUid);
  saveReceivedRequests(received);

  if (firebaseReady) {
    db.collection('friend_requests')
      .where('from', '==', fromUid)
      .where('to', '==', currentUser.uid)
      .get().then(snap => snap.forEach(doc => doc.ref.delete()));
  }

  showToast('Solicitud rechazada');
  loadFriends();
};

window.removeFriend = function(uid) {
  if (!confirm('¿Eliminar a este amigo?')) return;
  
  let myFriends = getMyFriends();
  myFriends = myFriends.filter(f => f.uid !== uid);
  saveMyFriends(myFriends);

  if (!firebaseReady) {
    let theirKey = `tierlist_friends_${uid}`;
    let theirFriends = JSON.parse(localStorage.getItem(theirKey) || '[]');
    theirFriends = theirFriends.filter(f => f.uid !== currentUser.uid);
    localStorage.setItem(theirKey, JSON.stringify(theirFriends));
  } else {
    // Remove from Firestore
    db.collection('friendships')
      .where('users', 'array-contains', currentUser.uid)
      .get().then(snap => {
        snap.forEach(doc => {
          if (doc.data().users.includes(uid)) doc.ref.delete();
        });
      });
  }

  showToast('Amigo eliminado');
  loadFriends();
};

async function loadFriends() {
  if (!currentUser) return;

  // Load received requests
  let receivedRequests = [];
  if (firebaseReady) {
    try {
      const snap = await db.collection('friend_requests')
        .where('to', '==', currentUser.uid)
        .get();
      receivedRequests = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      saveReceivedRequests(receivedRequests);
    } catch(e) {}
  } else {
    receivedRequests = getReceivedRequests();
  }

  // Render requests
  if (receivedRequests.length > 0) {
    friendRequestsSection.style.display = 'block';
    friendRequestsList.innerHTML = receivedRequests.map(r => {
      const initial = (r.fromName || '?')[0].toUpperCase();
      return `
        <div class="friend-card">
          <div class="friend-card-left">
            <div class="friend-result-initial">${initial}</div>
            <div class="friend-card-info">
              <span class="friend-card-name">${r.fromName}</span>
              <span class="friend-card-sub">Quiere ser tu amigo</span>
            </div>
          </div>
          <div class="friend-card-actions">
            <button class="btn-accept-friend" onclick="acceptFriendRequest('${r.from}', '${(r.fromName || '').replace(/'/g, "\\'")}')">
              <span class="material-symbols-rounded">check</span>
            </button>
            <button class="btn-reject-friend" onclick="rejectFriendRequest('${r.from}')">
              <span class="material-symbols-rounded">close</span>
            </button>
          </div>
        </div>`;
    }).join('');
  } else {
    friendRequestsSection.style.display = 'none';
  }

  // Load friends
  let friends = [];
  if (firebaseReady) {
    try {
      const snap = await db.collection('friendships')
        .where('users', 'array-contains', currentUser.uid)
        .get();
      friends = snap.docs.map(doc => {
        const data = doc.data();
        const friendUid = data.users.find(u => u !== currentUser.uid);
        return {
          uid: friendUid,
          displayName: data.userNames?.[friendUid] || 'Amigo',
          addedAt: data.createdAt
        };
      });
      saveMyFriends(friends);
    } catch(e) {
      friends = getMyFriends();
    }
  } else {
    friends = getMyFriends();
  }

  // Render friends
  if (friends.length === 0) {
    friendsList.innerHTML = `
      <div class="community-empty">
        <span class="material-symbols-rounded">person_add</span>
        <p>Aún no tienes amigos</p>
        <small>Busca y agrega personas para empezar</small>
      </div>`;
    return;
  }

  friendsList.innerHTML = friends.map(f => {
    const initial = (f.displayName || '?')[0].toUpperCase();
    return `
      <div class="friend-card">
        <div class="friend-card-left">
          <div class="friend-result-initial">${initial}</div>
          <div class="friend-card-info">
            <span class="friend-card-name">${f.displayName}</span>
            <span class="friend-card-sub">Amigo</span>
          </div>
        </div>
        <div class="friend-card-actions">
          <button class="btn-remove-friend" onclick="removeFriend('${f.uid}')" title="Eliminar amigo">
            <span class="material-symbols-rounded">person_remove</span>
          </button>
        </div>
      </div>`;
  }).join('');
}
