# 🗳️ ElectionGuide AI — Your Smart Guide to Democracy

> **The problem with elections isn't the voting—it's understanding the process.**

ElectionGuide AI is a premium, AI-powered civic education PWA that empowers citizens with knowledge about the democratic process. By combining Gemini-driven AI chat, interactive eligibility tools, and open-source mapping (Leaflet), we make democracy accessible to everyone—especially first-time voters.

🔗 **Live Demo**: [https://electionguide-ai-235766108839.asia-south1.run.app](https://electionguide-ai-235766108839.asia-south1.run.app)

---

## 📌 The Vision

Millions of first-time voters are overwhelmed by the election process. *How do I register? What's an EVM? What is NOTA?* The information exists, but it's scattered across government websites, buried in legalese, and hard to navigate.

**ElectionGuide AI solves this with Information Accessibility.** We put a friendly, non-partisan AI assistant directly in the hands of citizens—powered by Google Gemini—to answer any question about elections in simple, engaging language.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Gemini AI Chat** | A context-aware assistant powered by Google Gemini 2.0 Flash. Ask anything about elections, voting, or your rights. |
| ✅ **Eligibility Checker** | Instantly determine your voting eligibility based on age, citizenship, and registration status. |
| 📜 **Election Timeline** | An interactive, expandable timeline that walks you through every step—from announcement to results. |
| 📍 **Locate Resources** | **(New)** Leaflet + OpenStreetMap integration to find nearby polling stations, registration offices, and help centers—no API key required. |
| 🎤 **Voice Input** | Hands-free interaction via Web Speech API—just tap and ask. |
| 🌓 **Dark/Light Theme** | Premium UI with smooth theme toggling and high-contrast accessibility mode. |
| 🔄 **Demo / Live Mode** | Works instantly in demo mode with curated responses. Toggle to Live mode with your own Gemini API key for real-time AI. |
| 📱 **PWA** | Installable on any device—no App Store required. Works offline with service worker caching. |
| 🔐 **Google Sign-In** | Firebase Authentication with Google for personalized dashboard experience. |
| ❓ **FAQ Accordion** | Curated answers to the most common election questions with smooth expand/collapse animations. |

---

## 🚀 The Tech Stack

Built with a modern, modular architecture optimized for performance and maintainability:

*   **Google Gemini 2.0 Flash**: The AI brain behind the chat assistant, with safety settings and contextual conversation history.
*   **Leaflet + OpenStreetMap**: Powers the "Locate Resources" feature for finding nearby election offices and polling stations with privacy-focused, open-source mapping.
*   **Firebase Authentication**: Secure Google Sign-In for personalized user experience.
*   **Cloud Firestore**: Persistent storage for chat history and user preferences.
*   **Vite**: Lightning-fast build tooling with tree-shaking and production optimization.
*   **Vitest**: Comprehensive testing framework with 17+ unit tests and JSDOM environment.
*   **Cloud Run + Nginx**: Multi-stage Docker deployment for scalable, low-latency serving.
*   **PWA Architecture**: Service worker caching, manifest, and installability on all platforms.

---

## 📂 Project Structure

```
electionguide/
├── src/
│   ├── main.js           # App entry point & UI orchestration
│   ├── ai.js             # Gemini API, demo responses, fuzzy matching, Markdown formatter
│   ├── voter.js          # Eligibility calculation logic (pure, testable)
│   ├── maps.js           # Google Maps integration via @googlemaps/js-api-loader
│   └── firebase.js       # Firebase Auth & Firestore initialization
├── tests/
│   ├── eligibility.test.js  # 6 tests: age, citizenship, registration edge cases
│   └── ai.test.js           # 11 tests: fuzzy matching, default fallback, Markdown formatting
├── public/
│   ├── sw.js             # Service worker for offline caching
│   └── icons/            # PWA icons (192px, 512px)
├── index.html            # Single-page app shell
├── style.css             # Premium dark-mode-first design system
├── app.js                # Legacy standalone version (kept for fallback)
├── Dockerfile            # Multi-stage: Node build → Nginx serve
├── nginx.conf            # Gzip, security headers, SPA routing
├── manifest.json         # PWA manifest
├── vite.config.js        # Vite + Vitest configuration
└── package.json          # Dependencies & scripts
```

---

## 🧪 Testing

ElectionGuide AI includes a comprehensive test suite powered by **Vitest**:

```bash
npm test
```

```
 ✓ tests/eligibility.test.js (6 tests)
   ✓ returns pending for incomplete details
   ✓ returns ineligible for age under 18
   ✓ returns ineligible for non-citizens
   ✓ returns pending for eligible but unregistered voters
   ✓ returns eligible for adult citizens who are registered
   ✓ handles edge case: exactly 18 years old

 ✓ tests/ai.test.js (11 tests)
   ✓ returns registration info for voter registration query
   ✓ returns EVM info for EVM-related query
   ✓ returns NOTA info for NOTA query
   ✓ returns default response for unrelated query
   ✓ returns types of elections for elections query
   ✓ formats bold text correctly
   ✓ formats italic text correctly
   ✓ formats inline code correctly
   ✓ formats unordered lists correctly
   ✓ formats line breaks correctly
   ✓ formats double line breaks as paragraph breaks

 Test Files  2 passed (2)
      Tests  17 passed (17)
```

---

## 🛠️ Running Locally

1.  **Clone & Install**: `npm install`
2.  **Dev Server**: `npm run dev`
3.  **Run Tests**: `npm test`
4.  **Production Build**: `npm run build`

---

## 🌐 Deployment

Deployed on **Google Cloud Run** with a multi-stage Docker build:

```bash
gcloud run deploy electionguide-ai --source . --region asia-east1 --allow-unauthenticated
```

**Live URL**: [https://electionguide-ai-235766108839.asia-south1.run.app](https://electionguide-ai-235766108839.asia-south1.run.app)

---

## 📄 License

MIT — Built for the Google AI Hackathon.
