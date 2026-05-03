import { calculateEligibility } from './voter.js';
import { getDemoResponse, formatMarkdown, SYSTEM_PROMPT } from './ai.js';
import { initMap as initLeafletMap } from './maps.js';

// ── Constants & State ─────────────────────────────────────────
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const STORAGE_KEY = 'electionguide_api_key';
const THEME_KEY = 'electionguide_theme';
const MODE_KEY = 'electionguide_mode';

let apiKey = localStorage.getItem(STORAGE_KEY) || '';
let isLiveMode = (localStorage.getItem(MODE_KEY) === 'live') && !!apiKey;
let chatHistory = [];
let isProcessing = false;
let recognition = null;
let currentUser = null;

// ── DOM Helpers ──────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── Initialize ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initTimeline();
  initEligibility();
  initChat();
  initFAQ();
  initScrollReveal();
  initSpeech();
  initModeToggle();
  initMap();
  registerServiceWorker();
});

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

// ── Maps (Leaflet + OpenStreetMap — no API key needed) ───────
function initMap() {
  initLeafletMap('election-map');
}

// ── Eligibility ─────────────────────────────────────────────
function initEligibility() {
  const form = $('#eligibility-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const age = parseInt($('#elig-age')?.value, 10);
    const isCitizen = $('#elig-citizen')?.value === 'yes';
    const isRegistered = $('#elig-registered')?.value === 'yes';

    const result = calculateEligibility({ age, isCitizen, isRegistered });
    updateEligibilityUI(result);
  });
}

function updateEligibilityUI(result) {
  const resultEl = $('#eligibility-result');
  if (!resultEl) return;

  resultEl.className = `eligibility-result glass result-${result.status}`;
  resultEl.innerHTML = `
    <div class="result-icon" aria-hidden="true">${result.icon}</div>
    <div class="result-title">${result.title}</div>
    <p class="result-message">${result.message}</p>
  `;
  resultEl.style.animation = 'none';
  resultEl.offsetHeight;
  resultEl.style.animation = 'scaleIn 0.3s ease-out';
}

// ── Chat & AI ──────────────────────────────────────────────
function initChat() {
  const input = $('#chat-input');
  const sendBtn = $('#chat-send');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });
  }
  if (sendBtn) sendBtn.addEventListener('click', () => handleSendMessage());
}

async function handleSendMessage(presetQuestion) {
  const input = $('#chat-input');
  const text = (presetQuestion || input?.value)?.trim();
  if (!text || isProcessing) return;

  if (input) input.value = '';
  isProcessing = true;

  appendChatMessage('user', text);
  const typingEl = showTyping();

  try {
    let response;
    if (isLiveMode && apiKey) {
      response = await callGemini(text);
    } else {
      response = await getDemoResponse(text);
    }
    removeTyping(typingEl);
    appendChatMessage('ai', response);
  } catch (error) {
    removeTyping(typingEl);
    appendChatMessage('ai', `Error: ${error.message}`);
  } finally {
    isProcessing = false;
  }
}

async function callGemini(userMessage) {
  chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });
  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: chatHistory,
  };

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  const data = await res.json();
  const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
  chatHistory.push({ role: 'model', parts: [{ text: aiText }] });
  return aiText;
}

function appendChatMessage(role, text) {
  const chatWindow = $('#chat-window');
  if (!chatWindow) return;

  const msgEl = document.createElement('div');
  msgEl.className = `chat-message ${role}`;
  msgEl.innerHTML = `
    <div class="chat-avatar" aria-hidden="true">${role === 'ai' ? '🗳️' : '👤'}</div>
    <div class="chat-bubble">
      ${role === 'ai' ? formatMarkdown(text) : escapeHtml(text)}
    </div>
  `;
  chatWindow.appendChild(msgEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTyping() {
  const chatWindow = $('#chat-window');
  const el = document.createElement('div');
  el.className = 'chat-message ai';
  el.innerHTML = `<div class="chat-avatar">🗳️</div><div class="chat-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
  chatWindow.appendChild(el);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return el;
}

function removeTyping(el) { el?.remove(); }

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── UI Utils (Theme, Nav, FAQ) ──────────────────────────────
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.dataset.theme = savedTheme;
  updateThemeIcon(savedTheme);
}

window.toggleTheme = () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
  updateThemeIcon(next);
};

function updateThemeIcon(theme) {
  const btn = $('#theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function initNavigation() {
  const navbar = $('.navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

function initTimeline() {
  $$('.timeline-card').forEach(card => {
    card.addEventListener('click', () => {
      const item = card.closest('.timeline-item');
      $$('.timeline-item.expanded').forEach(other => {
        if (other !== item) other.classList.remove('expanded');
      });
      item.classList.toggle('expanded');
    });
  });
}

function initFAQ() {
  $$('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item.classList.toggle('open');
    });
  });
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  $$('.reveal').forEach(el => observer.observe(el));
}

function initSpeech() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { $('#chat-mic').style.display = 'none'; return; }
  recognition = new SpeechRecognition();
  recognition.onresult = (e) => { $('#chat-input').value = e.results[0][0].transcript; };
}

window.toggleVoice = () => {
  const mic = $('#chat-mic');
  if (mic.classList.contains('recording')) { recognition.stop(); mic.classList.remove('recording'); }
  else { recognition.start(); mic.classList.add('recording'); }
};

function initModeToggle() {
  const toggle = $('#mode-toggle');
  if (!toggle) return;
  toggle.checked = isLiveMode;
  toggle.addEventListener('change', () => {
    if (toggle.checked && !apiKey) { showApiKeyModal(); toggle.checked = false; return; }
    isLiveMode = toggle.checked;
    localStorage.setItem(MODE_KEY, isLiveMode ? 'live' : 'demo');
    updateModeLabel();
  });
  updateModeLabel();
}

function updateModeLabel() {
  const label = $('#mode-label');
  if (label) label.textContent = isLiveMode ? '🟢 Live AI' : '🔵 Demo';
}

// ── Modals ───────────────────────────────────────────────────
window.showApiKeyModal = () => $('#api-key-modal').classList.add('active');
window.closeApiKeyModal = () => $('#api-key-modal').classList.remove('active');
window.saveApiKey = () => {
  const key = $('#api-key-input').value.trim();
  if (!key) return;
  apiKey = key;
  localStorage.setItem(STORAGE_KEY, key);
  isLiveMode = true;
  localStorage.setItem(MODE_KEY, 'live');
  $('#mode-toggle').checked = true;
  updateModeLabel();
  closeApiKeyModal();
  initMap(); // Try to load map with new key
};

// Global exports for inline onclicks
window.sendMessage = handleSendMessage;
window.simulateLogin = () => {
  currentUser = { name: 'Voter Citizen', picture: 'https://ui-avatars.com/api/?name=Voter+Citizen' };
  updateAuthUI();
};
window.signOut = () => { currentUser = null; updateAuthUI(); };

function updateAuthUI() {
  const auth = $('#auth-section');
  const user = $('#user-section');
  const dash = $('#voter-dashboard');
  if (currentUser) {
    auth.style.display = 'none'; user.style.display = 'flex'; dash?.classList.add('visible');
    $('#user-name').textContent = currentUser.name.split(' ')[0];
    $('#user-avatar').src = currentUser.picture;
    $('#dash-user-name').textContent = currentUser.name;
  } else {
    auth.style.display = 'block'; user.style.display = 'none'; dash?.classList.remove('visible');
  }
}
