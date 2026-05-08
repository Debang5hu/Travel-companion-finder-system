// ── API Configuration ─────────────────────────────────────
const API_BASE = 'http://localhost:5000/api';

// ── Token Management ──────────────────────────────────────
const Auth = {
  getToken: () => localStorage.getItem('mtm_token'),
  setToken: (t) => localStorage.setItem('mtm_token', t),
  removeToken: () => localStorage.removeItem('mtm_token'),
  isLoggedIn: () => !!localStorage.getItem('mtm_token'),
};

// ── Base fetch wrapper ────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = Auth.getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, message: data.message || data.error || 'Something went wrong' };
    return data;
  } catch (err) {
    if (err.status) throw err;
    throw { status: 0, message: 'Cannot connect to server. Make sure the backend is running.' };
  }
}

// ── Account ───────────────────────────────────────────────
const AccountAPI = {
  create:     (payload) => apiFetch('/create-account', { method: 'POST', body: JSON.stringify(payload) }),
  update:     (payload) => apiFetch('/update-account', { method: 'PUT',  body: JSON.stringify(payload) }),
  delete:     ()        => apiFetch('/delete-account', { method: 'DELETE' }),
  getProfile: ()        => apiFetch('/profile'),
};

// ── Authentication ────────────────────────────────────────
const AuthAPI = {
  login:  (username, password) => apiFetch('/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => apiFetch('/logout'),
};

// ── Recommendations ───────────────────────────────────────
const RecommendAPI = {
  // POST /recommend/user  → returns compatible users with scores
  getUsers: (top_n = 5) => apiFetch('/recommend/user', {
    method: 'POST',
    body: JSON.stringify({ top_n }),
  }),

  // POST /recommend/group → returns recommended groups
  getGroups: (top_n = 5) => apiFetch('/recommend/group', {
    method: 'GET',
    body: JSON.stringify({ top_n }),
  }),
};

// ── Groups ────────────────────────────────────────────────
const GroupAPI = {
  getAll:      ()               => apiFetch('/groups'),
  create:      (payload)        => apiFetch('/create-group',  { method: 'POST',   body: JSON.stringify(payload) }),
  join:        (group_id)       => apiFetch('/join-group',    { method: 'POST',   body: JSON.stringify({ group_id }) }),
  update:      (payload)        => apiFetch('/update-group',  { method: 'PUT',    body: JSON.stringify(payload) }),
  delete:      (group_id)       => apiFetch('/delete-group',  { method: 'DELETE', body: JSON.stringify({ group_id }) }),
  allow:       (group_id, user_id) => apiFetch('/group/allow',  { method: 'POST', body: JSON.stringify({ group_id, user_id }) }),
  reject:      (group_id, user_id) => apiFetch('/group/reject', { method: 'POST', body: JSON.stringify({ group_id, user_id }) }),
  leave:       (group_id)       => apiFetch('/group/leave',   { method: 'POST',   body: JSON.stringify({ group_id }) }),
  getRequests: (group_id)       => apiFetch(`/group/requests?group_id=${group_id}`),
};

// ── Chat ──────────────────────────────────────────────────
const ChatAPI = {
  send:            (receiver_id, message) => apiFetch('/chat/send',       { method: 'POST', body: JSON.stringify({ receiver_id, message }) }),
  getMessages:     (user_id)              => apiFetch(`/chat/messages?user_id=${user_id}`),
  getUnread:       ()                     => apiFetch('/chat/unread'),
  markRead:        (user_id)              => apiFetch('/chat/read',        { method: 'POST', body: JSON.stringify({ user_id }) }),
  sendGroup:       (group_id, message)    => apiFetch('/group/chat/send',  { method: 'POST', body: JSON.stringify({ group_id, message }) }),
  getGroupMessages:(group_id)             => apiFetch(`/group/chat?group_id=${group_id}`),
};

// ── UI Helpers ────────────────────────────────────────────
function showError(msg) {
  let toast = document.getElementById('apiToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'apiToast';
    toast.style.cssText = `position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(20px);background:#ef4444;color:white;padding:12px 24px;border-radius:50px;font-size:.85rem;font-weight:500;z-index:999;opacity:0;transition:all .3s ease;white-space:nowrap;box-shadow:0 4px 20px rgba(239,68,68,.4);font-family:'Outfit',sans-serif;`;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateX(-50%) translateY(20px)'; }, 3000);
}

function showSuccess(msg) {
  let toast = document.getElementById('apiToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'apiToast';
    toast.style.cssText = `position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--purple);color:white;padding:12px 24px;border-radius:50px;font-size:.85rem;font-weight:500;z-index:999;opacity:0;transition:all .3s ease;white-space:nowrap;box-shadow:0 4px 20px rgba(123,79,166,.4);font-family:'Outfit',sans-serif;`;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateX(-50%) translateY(20px)'; }, 3000);
}

function setLoading(btn, loading, originalText) {
  if (loading) {
    btn.disabled = true;
    btn.dataset.original = btn.textContent;
    btn.textContent = 'Please wait...';
    btn.style.opacity = '.7';
  } else {
    btn.disabled = false;
    btn.textContent = originalText || btn.dataset.original || btn.textContent;
    btn.style.opacity = '1';
  }
}

function requireAuth() {
  if (!Auth.isLoggedIn()) { window.location.href = 'index.html'; return false; }
  return true;
}