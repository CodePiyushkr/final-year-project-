import fetch from "node-fetch";

// Groq API Configuration
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama3-70b-8192";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY not configured" });
  }

  try {
    const { prompt, currentLayout } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let systemPrompt, userPrompt;

    if (currentLayout) {
      // Modify existing website
      const currentData = currentLayout.businessName ? currentLayout : convertOldFormat(currentLayout);
      systemPrompt = `Modify this website JSON based on the user's request. Return the complete updated JSON.

CURRENT WEBSITE:
${JSON.stringify(currentData, null, 2)}

Return ONLY the modified JSON with a "message" field explaining changes. No markdown, just JSON.`;
      userPrompt = `USER REQUEST: "${prompt}"\n\nUpdated JSON:`;
    } else {
      // Generate new website
      systemPrompt = `You are a website content generator. Create JSON content for a modern website.

RESPOND WITH ONLY THIS JSON STRUCTURE:
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
- Use relevant emojis for feature icons`;
      userPrompt = `Business type: "${prompt}"\n\nJSON:`;
    }

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from AI");
    }

    // Parse JSON from response
    const jsonStr = cleanJsonResponse(content);
    const websiteData = JSON.parse(jsonStr);
    const layout = convertToSectionFormat(websiteData);
    layout.message = websiteData.message;

    return res.status(200).json({ layout });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

function cleanJsonResponse(response) {
  response = response.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();
  const start = response.indexOf("{");
  const end = response.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No valid JSON found");
  return response.substring(start, end + 1);
}

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
      if (s.type === 'stats' && (!s.items || s.items.length === 0)) return false;
      if (s.type === 'testimonials' && (!s.items || s.items.length === 0)) return false;
      return true;
    })
  };
}
