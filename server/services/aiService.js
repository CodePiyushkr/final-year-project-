import fetch from "node-fetch";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

/**
 * Check if Ollama is running
 */
async function checkOllamaStatus() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, { method: "GET" });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Generate NEW website layout from prompt - FAST & SIMPLE
 */
export async function generateLayout(prompt) {
  console.log("🤖 Connecting to Ollama AI...");
  
  const isOllamaRunning = await checkOllamaStatus();
  if (!isOllamaRunning) {
    throw new Error("Ollama is not running. Please start Ollama with 'ollama serve' command.");
  }

  console.log("✅ Generating website...");

  const systemPrompt = `You are a website content generator. Create JSON content for a modern website.

RESPOND WITH ONLY THIS JSON STRUCTURE (fill in the values based on the business type):
{
  "message": "Short friendly message about what you created",
  "businessName": "Creative business name",
  "tagline": "Catchy tagline",
  "description": "One sentence about the business",
  "theme": "dark",
  "primaryColor": "indigo",
  "features": [
    {"icon": "emoji", "title": "Feature 1", "desc": "Short description"},
    {"icon": "emoji", "title": "Feature 2", "desc": "Short description"},
    {"icon": "emoji", "title": "Feature 3", "desc": "Short description"}
  ],
  "stats": [
    {"value": "100+", "label": "Stat 1"},
    {"value": "50+", "label": "Stat 2"},
    {"value": "99%", "label": "Stat 3"}
  ],
  "testimonial": {"name": "Customer Name", "role": "Role", "text": "Short testimonial quote", "rating": 5},
  "pricing": [
    {"name": "Basic", "price": "$X/mo", "features": ["Feature 1", "Feature 2"]},
    {"name": "Pro", "price": "$X/mo", "features": ["Feature 1", "Feature 2", "Feature 3"], "popular": true},
    {"name": "Enterprise", "price": "$X/mo", "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]}
  ],
  "cta": "Call to action button text",
  "contact": {"email": "email@example.com", "phone": "+1 XXX XXX XXXX", "address": "City, Country"}
}

RULES:
- Return ONLY valid JSON, no markdown
- Use realistic content specific to the business type
- Use relevant emojis for feature icons
- Keep descriptions SHORT (under 10 words)`;

  const fullPrompt = `${systemPrompt}\n\nBusiness type: "${prompt}"\n\nJSON:`;

  return await callOllamaFast(fullPrompt);
}

/**
 * MODIFY existing website based on user request
 */
export async function modifyLayout(prompt, currentLayout) {
  console.log("🤖 Modifying website...");
  
  const isOllamaRunning = await checkOllamaStatus();
  if (!isOllamaRunning) {
    throw new Error("Ollama is not running. Please start Ollama with 'ollama serve' command.");
  }

  // Convert old format to new format if needed
  const currentData = currentLayout.businessName ? currentLayout : convertOldFormat(currentLayout);

  const systemPrompt = `Modify this website JSON based on the user's request. Return the complete updated JSON.

CURRENT WEBSITE:
${JSON.stringify(currentData, null, 2)}

USER REQUEST: "${prompt}"

Return ONLY the modified JSON with a "message" field explaining changes:`;

  return await callOllamaFast(systemPrompt);
}

// Convert old section-based format to new simple format
function convertOldFormat(layout) {
  const hero = layout.sections?.find(s => s.type === 'hero') || {};
  const features = layout.sections?.find(s => s.type === 'features') || {};
  const pricing = layout.sections?.find(s => s.type === 'pricing') || {};
  const contact = layout.sections?.find(s => s.type === 'contact') || {};
  
  return {
    businessName: hero.title || "Business",
    tagline: hero.subtitle || "",
    description: "",
    theme: layout.theme || "dark",
    primaryColor: "indigo",
    features: (features.items || []).map(f => ({
      icon: f.icon || "⭐",
      title: f.title || "",
      desc: f.description || ""
    })),
    stats: [],
    testimonial: { name: "Happy Customer", role: "Client", text: "Great service!", rating: 5 },
    pricing: pricing.plans || [],
    cta: hero.buttonText || "Get Started",
    contact: contact
  };
}

/**
 * Fast Ollama call with optimized settings
 */
async function callOllamaFast(prompt) {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.8,
          num_predict: 1500,  // Reduced for speed
          top_p: 0.9,
          top_k: 40,
          repeat_penalty: 1.1,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.response) {
      throw new Error("Empty response from Ollama");
    }

    console.log("📝 AI Response received");
    
    let jsonResponse = cleanJsonResponse(data.response);
    const websiteData = JSON.parse(jsonResponse);
    
    // Convert to section-based format for the frontend
    const layout = convertToSectionFormat(websiteData);
    layout.message = websiteData.message;
    
    console.log("✅ Website generated!");
    return layout;
  } catch (error) {
    console.error("❌ AI Error:", error.message);
    throw error;
  }
}

/**
 * Convert simple format to section-based format for frontend
 */
function convertToSectionFormat(data) {
  return {
    theme: data.theme || "dark",
    primaryColor: data.primaryColor || "indigo",
    sections: [
      {
        type: "hero",
        title: data.businessName || "Welcome",
        subtitle: data.tagline || "",
        description: data.description || "",
        buttonText: data.cta || "Get Started"
      },
      {
        type: "stats",
        items: data.stats || []
      },
      {
        type: "features",
        title: "Why Choose Us",
        items: (data.features || []).map(f => ({
          icon: f.icon || "⭐",
          title: f.title || "",
          description: f.desc || f.description || ""
        }))
      },
      {
        type: "testimonials",
        title: "What Our Clients Say",
        items: data.testimonial ? [data.testimonial] : []
      },
      {
        type: "pricing",
        title: "Simple Pricing",
        plans: data.pricing || []
      },
      {
        type: "cta",
        title: "Ready to Get Started?",
        subtitle: data.tagline || "Join thousands of satisfied customers",
        buttonText: data.cta || "Get Started Now"
      },
      {
        type: "contact",
        title: "Get In Touch",
        ...(data.contact || {})
      }
    ].filter(s => {
      // Remove empty sections
      if (s.type === 'stats' && (!s.items || s.items.length === 0)) return false;
      if (s.type === 'testimonials' && (!s.items || s.items.length === 0)) return false;
      return true;
    })
  };
}

/**
 * Clean JSON response from AI
 */
function cleanJsonResponse(response) {
  response = response.replace(/```json\n?/gi, "").replace(/```\n?/g, "");
  response = response.trim();
  
  const startIndex = response.indexOf("{");
  const endIndex = response.lastIndexOf("}");
  
  if (startIndex === -1 || endIndex === -1) {
    throw new Error("No valid JSON found in AI response");
  }
  
  return response.substring(startIndex, endIndex + 1);
}
