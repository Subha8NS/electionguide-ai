/**
 * AI & Demo Response Engine
 *
 * Contains the system prompt for Gemini, canned demo responses,
 * fuzzy-match logic, and a lightweight Markdown → HTML formatter.
 */

export const SYSTEM_PROMPT = `You are ElectionGuide AI — a friendly, knowledgeable assistant that helps citizens understand the democratic election process. You have expertise in:

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
- When discussing dates or deadlines, mention that users should verify with official sources`;

// ── Demo Responses ──────────────────────────────────────────
export const DEMO_RESPONSES = {
  'how do i register to vote': `📋 **How to Register to Vote**

There are multiple convenient ways to register:

- **Online**: Visit the National Voters' Service Portal (NVSP) at nvsp.in or download the Voter Helpline App
- **Offline**: Visit your nearest Electoral Registration Office and fill Form 6
- **Documents needed**: Proof of age (birth certificate, school certificate), proof of address (Aadhaar, passport, utility bill), and a passport-size photograph

**Important**: You must be at least 18 years old on the qualifying date (January 1st of the year of electoral roll revision). Registration is free of cost!

✅ Once approved, you'll receive your EPIC (Voter ID card) — your ticket to participating in democracy.`,

  'what is an evm and how does it work': `🖥️ **Electronic Voting Machine (EVM)**

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

  'what is nota and when can i use it': `🚫 **NOTA — None of the Above**

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

  'what are the types of elections in india': `🏛️ **Types of Elections in India**

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
};

/**
 * Returns a demo response that fuzzy-matches the user's question
 * against the canned DEMO_RESPONSES keys.
 */
export async function getDemoResponse(question) {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 200 + Math.random() * 200));

  const q = question.toLowerCase().trim().replace(/[?!.,]/g, '');
  const stopWords = new Set(['what', 'how', 'does', 'the', 'and', 'are', 'is', 'an', 'do', 'can', 'it', 'in', 'of', 'to', 'when', 'i']);

  for (const [key, value] of Object.entries(DEMO_RESPONSES)) {
    if (key === 'default') continue;

    // Strip punctuation from key, split into meaningful keywords
    const keywords = key.replace(/[?!.,]/g, '').split(/\s+/).filter(w => w.length >= 3 && !stopWords.has(w));
    const matches = keywords.filter(kw => q.includes(kw)).length;
    if (matches >= 2 || q.includes(key)) return value;
  }
  return DEMO_RESPONSES['default'];
}

/**
 * Converts a subset of Markdown to HTML for chat display.
 */
export function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}
