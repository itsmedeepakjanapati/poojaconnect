// ═══════════════════════════════════════════════════════════════
// shared/services/chatbotService.js
// Built-in chatbot logic — shared between web and mobile
// Can be upgraded to Dialogflow CX for production NLU
// ═══════════════════════════════════════════════════════════════

const RESPONSES = {
  greeting: `Namaste! 🙏 Welcome to PoojaConnect. I can help you with:

• Finding priests by pooja type, language, or location
• Information about different poojas and homams
• Pooja item requirements
• Vendor information
• Pricing guidance
• Booking help

What would you like to know?`,

  pitru: (priestCount) => `Pitru Karyam (ancestral rites) includes Shraddha, Tarpana, and Pitru Pooja — performed to honor and pay homage to departed ancestors.

Items needed: Black sesame seeds, Darbha grass, rice, milk, ghee, honey, and a water pot.

We have ${priestCount} priests who perform Pitru Karyam across MA, CT & NH. Would you like to search for one?`,

  homam: `We offer many types of Homam/Havan:

🔥 Ganapathi Homam — Remove obstacles, new beginnings
🔥 Navagraha Homam — Planetary peace & balance
🔥 Chandi Homam — Divine protection
🔥 Rudra Homam — Health & healing
🔥 Sudarshana Homam — Clear negativity
🔥 Vastu Homam — Bless home or office
🔥 Gayathri Homam — Wisdom & knowledge
🔥 Mruthyunjaya Homam — Longevity

Which Homam interests you? I can find priests who specialize in it.`,

  pricing: `Pricing varies by service and priest:

• Simple Pooja/Archana: $51–$151
• Homam/Havan: $151–$501
• Weddings: $501–$1,501+
• Pitru Karyam: $101–$401
• Grihapravesham: $151–$401

Priests set their own pricing. You can request quotes from multiple priests — they'll confirm the final price when accepting your request.`,

  wedding: `For Hindu wedding ceremonies:

📅 Book 3–6 months in advance
🙏 Both North & South Indian styles available
📍 Priests can perform at any venue
🛒 Items: Mangalsutra, garlands, rice, havan samagri, etc.

Several priests across all three states specialize in weddings. Would you like to search?`,

  griha: `Grihapravesham (housewarming) blesses your new home!

Items needed: Milk, rice, coconut, mango leaves, turmeric, kumkum, flowers, havan samagri.

Many priests offer Grihapravesham services — you can also combine it with Vastu Pooja for complete home blessings.`,

  booking: `To book a service:

1️⃣ Browse or search for priests
2️⃣ Select a priest and click "Book Now"
3️⃣ Choose your pooja type, date, and provide your address
4️⃣ Submit the request — the priest will review it
5️⃣ The priest confirms the date and final price
6️⃣ You receive email + push notification + SMS confirmation

You can cancel anytime and the priest will be notified.`,

  fallback: `I can help you with:

• Types of poojas & homams
• Finding priests by language, location, or service
• Pitru karyam & ancestral rites
• Pooja items & vendors
• Pricing information
• Wedding ceremonies
• Grihapravesham (housewarming)
• How to book a service

Please ask about any of these topics!`,
};

/**
 * Process a chat message and return a bot response
 * @param {string} message - User's message
 * @param {object} context - { priestCount, vendorCount, priests }
 * @returns {string} Bot response text
 */
export function getChatResponse(message, context = {}) {
  const q = message.toLowerCase().trim();
  const { priestCount = 12, vendorCount = 5, priests = [] } = context;

  // Greetings
  if (/^(hi|hello|hey|namaskar|namaste|good\s*(morning|afternoon|evening))/.test(q)) {
    return RESPONSES.greeting;
  }

  // Pitru / Shraddha / Tarpana
  if (/pitru|shraddha|tarpan|ancestor|departed|death\s*rites/.test(q)) {
    const count = priests.filter(p =>
      p.poojas?.some(pj => /pitru|shraddha|tarpan/i.test(pj))
    ).length || 7;
    return RESPONSES.pitru(count);
  }

  // Homam / Havan
  if (/homam|havan|homa|fire\s*ritual|yagna|yagya/.test(q)) {
    return RESPONSES.homam;
  }

  // Pricing
  if (/price|cost|how much|fee|charge|rate|budget|expensive|cheap/.test(q)) {
    return RESPONSES.pricing;
  }

  // Wedding
  if (/wedding|vivah|kalyan|marriage|mangal/.test(q)) {
    return RESPONSES.wedding;
  }

  // Grihapravesham
  if (/grih|house\s*warm|pravesh|new\s*home|moving/.test(q)) {
    return RESPONSES.griha;
  }

  // Booking / How to
  if (/book|how\s*(do|to|can)|schedule|request|process/.test(q)) {
    return RESPONSES.booking;
  }

  // Vendor / Items / Supplies
  if (/vendor|flower|item|supply|samag|shop|store|where\s*(to|can)\s*buy/.test(q)) {
    return `We have ${vendorCount} verified vendors across MA, NH & CT who supply pooja items, fresh flowers, garlands, havan samagri, and more.

When you book a pooja, we automatically suggest the required items and nearby vendors who can supply them!

Browse vendors from the "Vendors" tab.`;
  }

  // Priest search
  if (/priest|pandit|purohit|pujari|who\s*can|find/.test(q)) {
    return `We have ${priestCount} verified priests across three states:

📍 Massachusetts: Temples in Groton, North Andover, Ashland & more
📍 Connecticut: CVHTS Middletown, Shirdi Sai Temple & more
📍 New Hampshire: Hindu Temple of NH, Nashua

You can filter by language, location, and pooja type. Head to the "Priests" tab to search!`;
  }

  // Specific pooja types
  if (/satyanarayana|satyanarayan/.test(q)) {
    return `Satyanarayana Vratam is one of the most popular poojas — performed for prosperity, health, and fulfilling wishes.

Items: Banana leaves, fruits, flowers, poha, sugar, ghee, coconuts, betel leaves, turmeric.

Most of our priests offer this service. Duration: 2–3 hours. Cost: $101–$301 typically.`;
  }

  if (/ganapat|ganesh|vinayak/.test(q)) {
    return `Ganapathi Homam invokes Lord Ganesha to remove obstacles and bring success.

Often performed before new ventures, travels, or important life events.

Items: Modak/laddoo, durva grass, red flowers, coconut, havan samagri, ghee, camphor.`;
  }

  if (/navagraha|planet|graha/.test(q)) {
    return `Navagraha Homam appeases the nine planetary deities for harmony and balance.

Commonly recommended by astrologers for specific dasha periods.

Items: Nine types of grains, nine colors of cloth, havan samagri, ghee, sesame seeds, flowers.`;
  }

  // Language-specific
  if (/telugu|tamil|kannada|hindi|gujarati|malayalam/.test(q)) {
    const lang = q.match(/telugu|tamil|kannada|hindi|gujarati|malayalam/i)?.[0];
    const langTitle = lang.charAt(0).toUpperCase() + lang.slice(1);
    const count = priests.filter(p => p.languages?.some(l => l.toLowerCase() === lang)).length;
    return `We have ${count || 'several'} priests who speak ${langTitle}. You can filter by language on the Priests page to find a ${langTitle}-speaking priest near you.`;
  }

  return RESPONSES.fallback;
}
