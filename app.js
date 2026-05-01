/* ============================================================
   ElectionGuide AI — Application Logic
   Google Sign-In, Demo/Live modes, Gemini AI, PWA
   ============================================================ */

;(function () {
  'use strict'

  // ── Constants ────────────────────────────────────────────────
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
  const STORAGE_KEY = 'electionguide_api_key'
  const THEME_KEY = 'electionguide_theme'
  const CONTRAST_KEY = 'electionguide_contrast'
  const MODE_KEY = 'electionguide_mode' // 'demo' or 'live'

  const SYSTEM_PROMPT = `You are ElectionGuide AI — a friendly, knowledgeable assistant that helps citizens understand the democratic election process. You have expertise in:

1. **Voter Registration**: eligibility, how to register, required documents, deadlines
2. **Election Timeline**: announcement, nominations, campaigning, polling, counting, results
3. **Voting Process**: how to cast a vote, Electronic Voting Machines (EVMs), VVPAT, postal ballots
4. **Election Commission**: role, powers, Model Code of Conduct
5. **Types of Elections**: General (Lok Sabha), State (Vidhan Sabha), Local (Panchayat/Municipal)
6. **Political Parties**: recognition criteria, symbols, alliances
7. **Counting & Results**: process, EVMs, result declaration
8. **Voter Rights**: right to vote, right to information, grievance redressal
9. **Electoral Reforms**: NOTA, right to reject, digital voting proposals
10. **Global Elections**: comparisons with other democracies worldwide

Guidelines:
- Be factual, neutral, and non-partisan — never endorse any political party or candidate
- Use simple, easy-to-understand language
- Structure responses with bullet points and sections when helpful
- If unsure about something, say so honestly
- Focus on empowering citizens with knowledge about their democratic rights
- Keep responses concise but comprehensive (2-4 paragraphs max)
- Use relevant emojis sparingly to make content engaging
- When discussing dates or deadlines, mention that users should verify with official sources`

  // ── Demo Responses ──────────────────────────────────────────
  const DEMO_RESPONSES = {
    'how do i register to vote?': `📋 **How to Register to Vote**

There are multiple convenient ways to register:

- **Online**: Visit the National Voters' Service Portal (NVSP) at nvsp.in or download the Voter Helpline App
- **Offline**: Visit your nearest Electoral Registration Office and fill Form 6
- **Documents needed**: Proof of age (birth certificate, school certificate), proof of address (Aadhaar, passport, utility bill), and a passport-size photograph

**Important**: You must be at least 18 years old on the qualifying date (January 1st of the year of electoral roll revision). Registration is free of cost!

✅ Once approved, you'll receive your EPIC (Voter ID card) — your ticket to participating in democracy.`,

    'what is an evm and how does it work?': `🖥️ **Electronic Voting Machine (EVM)**

An EVM is a portable electronic device used to record votes in Indian elections. Here's how it works:

- **Two units**: The Control Unit (with the presiding officer) and the Ballot Unit (in the voting compartment)
- **Voting**: Press the button next to your candidate's name and symbol — a light and beep confirm your vote
- **VVPAT**: A paper slip is printed showing your choice, visible for 7 seconds through a window, then drops into a sealed box

**Is it tamper-proof?**
- EVMs are standalone devices with **no WiFi, Bluetooth, or internet connectivity**
- Manufactured only by government-owned BEL and ECIL
- Each machine has a unique ID and undergoes multiple rounds of testing
- First Level Checking (FLC) is done before every election

🔒 The Supreme Court has upheld the reliability of EVMs in multiple rulings.`,

    'what is nota and when can i use it?': `🚫 **NOTA — None of the Above**

NOTA is a ballot option that allows voters to officially reject all contesting candidates in an election.

**Key facts:**
- Introduced by the **Supreme Court of India in 2013** (PUCL vs Union of India case)
- Available as the **last button** on the EVM in every constituency
- It empowers voters to express dissatisfaction without boycotting the election

**How it works:**
- If you feel no candidate deserves your vote, press the NOTA button
- Your vote is counted as a "rejected vote"
- However, even if NOTA gets the **highest votes**, the candidate with the most actual votes still wins

**Why it matters:**
NOTA sends a powerful signal to political parties about voter dissatisfaction. High NOTA counts in a constituency can pressure parties to field better candidates in future elections.

📊 In the 2019 General Elections, NOTA received over 1.06 crore votes across India.`,

    'explain the model code of conduct': `📜 **Model Code of Conduct (MCC)**

The MCC is a set of guidelines issued by the Election Commission of India to ensure free and fair elections.

**When does it apply?**
- Comes into effect from the **date of election announcement**
- Remains active until **results are declared**

**Key provisions:**
- **For parties/candidates**: No appeal to caste, religion, or communal feelings; no bribery or voter intimidation
- **For government**: No new schemes, projects, or appointments that could influence voters; no use of government machinery for campaigning
- **For media**: Equal coverage; no paid news
- **Rallies**: Must have prior permission; cannot be held after 10 PM

**Enforcement:**
The Election Commission can issue notices, warnings, and even **deregister parties** for serious violations. Flying squads and surveillance teams monitor compliance.

⚖️ While not legally enforceable as a statute, the MCC derives authority from Article 324 of the Constitution.`,

    'what are the types of elections in india?': `🏛️ **Types of Elections in India**

India conducts elections at multiple levels:

**1. General Elections (Lok Sabha)**
- Elects members to the lower house of Parliament
- 543 constituencies across India
- Held every **5 years** (or earlier if dissolved)
- The party/alliance with majority forms the central government

**2. State Elections (Vidhan Sabha)**
- Elects members to State Legislative Assemblies
- Number of seats varies by state (e.g., UP has 403, Goa has 40)
- Held every **5 years** independently of general elections

**3. Local Body Elections**
- **Panchayat elections**: Village, Block, and District levels in rural areas
- **Municipal elections**: Corporations, Municipalities, and Town Councils in urban areas
- Conducted by **State Election Commissions**

**4. By-Elections**
- Held when a seat falls vacant mid-term (death, resignation, disqualification)

**5. Rajya Sabha Elections**
- Members elected by **State Legislature MLAs** (indirect election)
- 1/3 of members retire every 2 years

🗳️ India is the world's largest democracy with over 96 crore registered voters!`,

    'default': `That's a great question about the democratic process! 🗳️

Here are some key things to know:

- **India is the world's largest democracy** with over 96 crore registered voters
- The **Election Commission of India** is an independent constitutional body that conducts all elections
- Every citizen aged **18 and above** has the right to vote
- Elections use **EVMs with VVPAT** for transparency and accuracy

I can help you learn more about:
- 📋 Voter registration process
- 🖥️ How EVMs work
- 📜 Model Code of Conduct
- 🏛️ Types of elections
- 🚫 NOTA and electoral reforms

💡 **Tip**: Try the suggestion chips below or ask me anything specific!

*This is a demo response. Toggle "Go Live" mode in the navbar and enter your Gemini API key for real-time AI answers.*`
  }

  // ── State ────────────────────────────────────────────────────
  let apiKey = localStorage.getItem(STORAGE_KEY) || ''
  let chatHistory = []
  let isProcessing = false
  let recognition = null
  let currentUser = null
  let isLiveMode = (localStorage.getItem(MODE_KEY) === 'live') && !!apiKey

  // ── DOM References ──────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel)
  const $$ = (sel) => document.querySelectorAll(sel)

  // ── Initialize ──────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initTheme()
    initNavigation()
    initTimeline()
    initEligibility()
    initChat()
    initFAQ()
    initScrollReveal()
    initSpeech()
    initModeToggle()
    registerServiceWorker()
  })

  // ── Service Worker ──────────────────────────────────────────
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }

  // ── Google Sign-In ──────────────────────────────────────────
  window.handleGoogleSignIn = function (response) {
    const payload = JSON.parse(atob(response.credential.split('.')[1]))
    currentUser = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    }
    updateAuthUI()
  }

  function updateAuthUI() {
    const authSection = $('#auth-section')
    const userSection = $('#user-section')
    const dashboard = $('#voter-dashboard')
    if (!authSection || !userSection) return

    if (currentUser) {
      authSection.style.display = 'none'
      userSection.style.display = 'flex'
      if (dashboard) dashboard.classList.add('visible')
      const avatar = $('#user-avatar')
      const name = $('#user-name')
      if (avatar) { avatar.src = currentUser.picture; avatar.alt = currentUser.name }
      if (name) name.textContent = currentUser.name.split(' ')[0]
      
      // Update dashboard text
      const dashName = $('#dash-user-name')
      if (dashName) dashName.textContent = currentUser.name
    } else {
      authSection.style.display = 'block'
      userSection.style.display = 'none'
      if (dashboard) dashboard.classList.remove('visible')
    }
  }

  // Mock Login for Demo
  window.simulateLogin = function() {
    currentUser = {
      name: 'Voter Citizen',
      email: 'citizen@example.com',
      picture: 'https://ui-avatars.com/api/?name=Voter+Citizen&background=FF9933&color=fff'
    }
    updateAuthUI()
  }

  function signOut() {
    currentUser = null
    updateAuthUI()
  }
  window.signOut = signOut

  // ── Mode Toggle (Demo / Live) ──────────────────────────────
  function initModeToggle() {
    const toggle = $('#mode-toggle')
    if (!toggle) return

    toggle.checked = isLiveMode
    updateModeLabel()

    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        // Switching to live — need API key
        if (!apiKey) {
          showApiKeyModal()
          toggle.checked = false
          return
        }
        isLiveMode = true
      } else {
        isLiveMode = false
      }
      localStorage.setItem(MODE_KEY, isLiveMode ? 'live' : 'demo')
      updateModeLabel()
    })
  }

  function updateModeLabel() {
    const label = $('#mode-label')
    if (label) {
      label.textContent = isLiveMode ? '🟢 Live AI' : '🔵 Demo'
      label.title = isLiveMode ? 'Using live Gemini API' : 'Using placeholder responses'
    }
  }

  // ── Theme ───────────────────────────────────────────────────
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark'
    const savedContrast = localStorage.getItem(CONTRAST_KEY) || 'normal'
    document.documentElement.dataset.theme = savedTheme
    document.documentElement.dataset.contrast = savedContrast
    updateThemeIcon(savedTheme)
  }

  function toggleTheme() {
    const current = document.documentElement.dataset.theme
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    localStorage.setItem(THEME_KEY, next)
    updateThemeIcon(next)
  }

  function toggleContrast() {
    const current = document.documentElement.dataset.contrast
    const next = current === 'high' ? 'normal' : 'high'
    document.documentElement.dataset.contrast = next
    localStorage.setItem(CONTRAST_KEY, next)
  }

  function updateThemeIcon(theme) {
    const btn = $('#theme-toggle')
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙'
  }

  window.toggleTheme = toggleTheme
  window.toggleContrast = toggleContrast

  // ── Navigation ──────────────────────────────────────────────
  function initNavigation() {
    const navbar = $('.navbar')
    const hamburger = $('.hamburger')
    const navLinks = $('.nav-links')

    window.addEventListener('scroll', () => {
      if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50)
      }
    }, { passive: true })

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open')
        hamburger.setAttribute('aria-expanded',
          navLinks.classList.contains('open'))
      })

      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open')
          hamburger.setAttribute('aria-expanded', 'false')
        })
      })
    }

    const sections = $$('section[id]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          $$('.nav-links a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
          })
        }
      })
    }, { threshold: 0.3 })

    sections.forEach(s => observer.observe(s))
  }

  // ── Timeline ────────────────────────────────────────────────
  function initTimeline() {
    $$('.timeline-item').forEach(item => {
      const card = item.querySelector('.timeline-card')
      if (!card) return

      card.addEventListener('click', () => {
        $$('.timeline-item.expanded').forEach(other => {
          if (other !== item) other.classList.remove('expanded')
        })
        item.classList.toggle('expanded')
      })

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          card.click()
        }
      })
    })
  }

  // ── Eligibility Checker ─────────────────────────────────────
  function initEligibility() {
    const form = $('#eligibility-form')
    if (!form) return

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      checkEligibility()
    })
  }

  function checkEligibility() {
    const age = parseInt($('#elig-age')?.value, 10)
    const citizen = $('#elig-citizen')?.value
    const registered = $('#elig-registered')?.value
    const resultEl = $('#eligibility-result')
    if (!resultEl) return

    let icon, title, message, className

    if (!age || !citizen) {
      icon = '📝'
      title = 'Fill in your details'
      message = 'Please complete all fields to check your voting eligibility.'
      className = 'result-pending'
    } else if (age < 18) {
      icon = '🎂'
      title = 'Not Yet Eligible'
      message = `You need to be at least 18 years old to vote. You'll be eligible in ${18 - age} year${18 - age === 1 ? '' : 's'}! Start learning about the election process now so you're ready.`
      className = 'result-ineligible'
    } else if (citizen !== 'yes') {
      icon = '🌍'
      title = 'Citizenship Required'
      message = 'Only citizens of the country are eligible to vote in national and state elections. Check local regulations for any exceptions.'
      className = 'result-ineligible'
    } else if (registered === 'no') {
      icon = '📋'
      title = 'Almost There!'
      message = 'You\'re eligible to vote! But you need to register first. Visit your local Election Commission office or register online at the National Voters\' Service Portal (NVSP).'
      className = 'result-pending'
    } else {
      icon = '✅'
      title = 'You\'re Eligible!'
      message = 'Great news! You meet all the requirements to vote. Make sure your voter ID is up to date and find your polling station before election day!'
      className = 'result-eligible'
    }

    resultEl.className = `eligibility-result glass ${className}`
    resultEl.innerHTML = `
      <div class="result-icon" aria-hidden="true">${icon}</div>
      <div class="result-title">${title}</div>
      <p class="result-message">${message}</p>
    `
    resultEl.style.animation = 'none'
    resultEl.offsetHeight
    resultEl.style.animation = 'scaleIn 0.3s ease-out'
  }

  window.checkEligibility = checkEligibility

  // ── Chat / Gemini AI ────────────────────────────────────────
  function initChat() {
    const input = $('#chat-input')
    const sendBtn = $('#chat-send')

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          sendMessage()
        }
      })
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', sendMessage)
    }
  }

  async function sendMessage(presetQuestion) {
    const input = $('#chat-input')
    const text = (typeof presetQuestion === 'string' ? presetQuestion : input?.value)?.trim()
    if (!text || isProcessing) return

    if (input) input.value = ''
    isProcessing = true

    appendChatMessage('user', text)
    const typingEl = showTyping()

    try {
      let response
      if (isLiveMode && apiKey) {
        response = await callGemini(text)
      } else {
        response = await getDemoResponse(text)
      }
      removeTyping(typingEl)
      appendChatMessage('ai', response)
    } catch (error) {
      removeTyping(typingEl)
      let errorMsg = 'Sorry, I encountered an error. '
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('403')) {
        errorMsg += 'Your API key appears to be invalid. Please update it.'
        apiKey = ''
        localStorage.removeItem(STORAGE_KEY)
        isLiveMode = false
        localStorage.setItem(MODE_KEY, 'demo')
        const toggle = $('#mode-toggle')
        if (toggle) toggle.checked = false
        updateModeLabel()
      } else if (error.message?.includes('429')) {
        errorMsg += 'Too many requests. Please wait a moment and try again.'
      } else {
        errorMsg += 'Please check your connection and try again.'
      }
      appendChatMessage('ai', errorMsg)
      console.error('Gemini API error:', error)
    }

    isProcessing = false
  }

  window.sendMessage = sendMessage

  // ── Demo Response Engine ────────────────────────────────────
  async function getDemoResponse(question) {
    // Faster simulation (reduced from 800ms)
    await new Promise(r => setTimeout(r, 200 + Math.random() * 200))

    const q = question.toLowerCase().trim()
    for (const [key, value] of Object.entries(DEMO_RESPONSES)) {
      if (key === 'default') continue
      // Fuzzy match — check if key words appear in the question
      const keywords = key.split(/\s+/).filter(w => w.length > 3)
      const matches = keywords.filter(kw => q.includes(kw)).length
      if (matches >= 2 || q.includes(key)) return value
    }
    return DEMO_RESPONSES['default']
  }

  async function callGemini(userMessage) {
    chatHistory.push({ role: 'user', parts: [{ text: userMessage }] })

    const body = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: chatHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.9,
        topK: 40
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
      ]
    }

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData?.error?.message || `HTTP ${res.status}`)
    }

    const data = await res.json()
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || 'I couldn\'t generate a response. Please try again.'

    chatHistory.push({ role: 'model', parts: [{ text: aiText }] })
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20)

    return aiText
  }

  function appendChatMessage(role, text) {
    const chatWindow = $('#chat-window')
    if (!chatWindow) return

    const welcome = chatWindow.querySelector('.chat-welcome')
    if (welcome) welcome.style.display = 'none'

    const msgEl = document.createElement('div')
    msgEl.className = `chat-message ${role}`
    msgEl.setAttribute('role', 'log')

    const avatar = role === 'ai' ? '🗳️' : '👤'
    const label = role === 'ai' ? 'ElectionGuide AI' : 'You'

    msgEl.innerHTML = `
      <div class="chat-avatar" aria-hidden="true">${avatar}</div>
      <div class="chat-bubble" aria-label="${label} said">
        ${role === 'ai' ? formatMarkdown(text) : escapeHtml(text)}
      </div>
    `

    chatWindow.appendChild(msgEl)
    chatWindow.scrollTop = chatWindow.scrollHeight
  }

  function showTyping() {
    const chatWindow = $('#chat-window')
    if (!chatWindow) return null

    const el = document.createElement('div')
    el.className = 'chat-message ai'
    el.id = 'typing-indicator'
    el.innerHTML = `
      <div class="chat-avatar" aria-hidden="true">🗳️</div>
      <div class="chat-bubble">
        <div class="typing-indicator" aria-label="AI is thinking">
          <span></span><span></span><span></span>
        </div>
      </div>
    `
    chatWindow.appendChild(el)
    chatWindow.scrollTop = chatWindow.scrollHeight
    return el
  }

  function removeTyping(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el)
  }

  function formatMarkdown(text) {
    return escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
      .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
  }

  function escapeHtml(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  // ── Speech Recognition ──────────────────────────────────────
  function initSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      const micBtn = $('#chat-mic')
      if (micBtn) micBtn.style.display = 'none'
      return
    }

    recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-IN'

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      const input = $('#chat-input')
      if (input) {
        input.value = transcript
        input.focus()
      }
      stopRecording()
    }

    recognition.onerror = () => stopRecording()
    recognition.onend = () => stopRecording()
  }

  function toggleVoice() {
    const micBtn = $('#chat-mic')
    if (!recognition || !micBtn) return

    if (micBtn.classList.contains('recording')) {
      recognition.stop()
      stopRecording()
    } else {
      recognition.start()
      micBtn.classList.add('recording')
      micBtn.setAttribute('aria-label', 'Stop recording')
    }
  }

  function stopRecording() {
    const micBtn = $('#chat-mic')
    if (micBtn) {
      micBtn.classList.remove('recording')
      micBtn.setAttribute('aria-label', 'Start voice input')
    }
  }

  window.toggleVoice = toggleVoice

  // ── FAQ Accordion ───────────────────────────────────────────
  function initFAQ() {
    $$('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item')
        const isOpen = item.classList.contains('open')

        $$('.faq-item.open').forEach(other => {
          if (other !== item) {
            other.classList.remove('open')
            other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false')
          }
        })

        item.classList.toggle('open', !isOpen)
        btn.setAttribute('aria-expanded', !isOpen)
      })
    })
  }

  // ── Scroll Reveal ───────────────────────────────────────────
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    $$('.reveal').forEach(el => observer.observe(el))
  }

  // ── API Key Modal ───────────────────────────────────────────
  function showApiKeyModal() {
    const modal = $('#api-key-modal')
    if (modal) {
      modal.classList.add('active')
      const input = $('#api-key-input')
      if (input) {
        input.value = apiKey || ''
        setTimeout(() => input.focus(), 100)
      }
    }
  }

  function saveApiKey() {
    const input = $('#api-key-input')
    const key = input?.value?.trim()
    if (!key) return

    apiKey = key
    localStorage.setItem(STORAGE_KEY, key)
    isLiveMode = true
    localStorage.setItem(MODE_KEY, 'live')
    const toggle = $('#mode-toggle')
    if (toggle) toggle.checked = true
    updateModeLabel()
    closeApiKeyModal()
  }

  function closeApiKeyModal() {
    const modal = $('#api-key-modal')
    if (modal) modal.classList.remove('active')
    // If user cancelled and toggle was trying to go live, reset
    if (!apiKey) {
      const toggle = $('#mode-toggle')
      if (toggle) toggle.checked = false
      isLiveMode = false
      localStorage.setItem(MODE_KEY, 'demo')
      updateModeLabel()
    }
  }

  window.showApiKeyModal = showApiKeyModal
  window.saveApiKey = saveApiKey
  window.closeApiKeyModal = closeApiKeyModal

})()
