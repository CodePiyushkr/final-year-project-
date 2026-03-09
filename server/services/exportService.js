/**
 * Generate standalone HTML file from layout
 */
export function generateHTML(layout, theme = "dark") {
  const isDark = theme === "dark";
  
  const bgColor = isDark ? "#0f172a" : "#ffffff";
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const cardBg = isDark ? "#1e293b" : "#f8fafc";
  const accentColor = "#6366f1";
  const mutedText = isDark ? "#94a3b8" : "#64748b";

  let sectionsHTML = "";

  for (const section of layout.sections) {
    switch (section.type) {
      case "hero":
        sectionsHTML += generateHeroHTML(section, isDark, accentColor);
        break;
      case "features":
        sectionsHTML += generateFeaturesHTML(section, isDark, cardBg, textColor, mutedText);
        break;
      case "pricing":
        sectionsHTML += generatePricingHTML(section, isDark, cardBg, textColor, mutedText, accentColor);
        break;
      case "contact":
        sectionsHTML += generateContactHTML(section, isDark, cardBg, textColor, mutedText, accentColor);
        break;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', sans-serif;
      background-color: ${bgColor};
      color: ${textColor};
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    section {
      padding: 80px 0;
    }
    h1, h2, h3 {
      font-weight: 700;
    }
    .btn {
      display: inline-block;
      padding: 12px 32px;
      background: ${accentColor};
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: opacity 0.3s;
    }
    .btn:hover {
      opacity: 0.9;
    }
    .grid {
      display: grid;
      gap: 24px;
    }
    .grid-3 {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
    .card {
      background: ${cardBg};
      padding: 32px;
      border-radius: 16px;
    }
    .text-muted {
      color: ${mutedText};
    }
    .text-center {
      text-align: center;
    }
    .mb-4 { margin-bottom: 16px; }
    .mb-6 { margin-bottom: 24px; }
    .mb-8 { margin-bottom: 32px; }
  </style>
</head>
<body>
  ${sectionsHTML}
</body>
</html>`;
}

function generateHeroHTML(section, isDark, accentColor) {
  return `
  <section style="min-height: 100vh; display: flex; align-items: center; background: linear-gradient(135deg, ${isDark ? '#1e293b' : '#f1f5f9'} 0%, ${isDark ? '#0f172a' : '#ffffff'} 100%);">
    <div class="container text-center">
      <h1 style="font-size: 3.5rem; margin-bottom: 24px;">${escapeHtml(section.title || "Welcome")}</h1>
      <p style="font-size: 1.25rem; margin-bottom: 32px; opacity: 0.8; max-width: 600px; margin-left: auto; margin-right: auto;">${escapeHtml(section.subtitle || "Your journey starts here")}</p>
      <a href="#contact" class="btn">${escapeHtml(section.buttonText || "Get Started")}</a>
    </div>
  </section>`;
}

function generateFeaturesHTML(section, isDark, cardBg, textColor, mutedText) {
  const items = section.items || [];
  const itemsHTML = items.map(item => `
    <div class="card text-center">
      <div style="font-size: 2.5rem; margin-bottom: 16px;">${item.icon || "⭐"}</div>
      <h3 style="margin-bottom: 12px;">${escapeHtml(item.title || item)}</h3>
      <p class="text-muted">${escapeHtml(item.description || "")}</p>
    </div>
  `).join("");

  return `
  <section id="features">
    <div class="container">
      <h2 class="text-center mb-8" style="font-size: 2.5rem;">${escapeHtml(section.title || "Our Features")}</h2>
      <div class="grid grid-3">
        ${itemsHTML}
      </div>
    </div>
  </section>`;
}

function generatePricingHTML(section, isDark, cardBg, textColor, mutedText, accentColor) {
  const plans = section.plans || [];
  const plansHTML = plans.map((plan, index) => {
    const isPopular = index === 1;
    const features = plan.features || [];
    const featuresHTML = features.map(f => `<li style="padding: 8px 0; border-bottom: 1px solid ${isDark ? '#334155' : '#e2e8f0'};">✓ ${escapeHtml(f)}</li>`).join("");
    
    return `
    <div class="card" style="${isPopular ? `border: 2px solid ${accentColor}; transform: scale(1.05);` : ''}">
      ${isPopular ? `<div style="background: ${accentColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.875rem; display: inline-block; margin-bottom: 16px;">Popular</div>` : ''}
      <h3 style="font-size: 1.5rem; margin-bottom: 8px;">${escapeHtml(plan.name || plan)}</h3>
      <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 24px;">${escapeHtml(plan.price || "$0")}</div>
      <ul style="list-style: none; margin-bottom: 24px;">
        ${featuresHTML}
      </ul>
      <a href="#contact" class="btn" style="width: 100%; text-align: center;">Choose Plan</a>
    </div>
  `;
  }).join("");

  return `
  <section id="pricing" style="background: ${isDark ? '#1e293b' : '#f8fafc'};">
    <div class="container">
      <h2 class="text-center mb-8" style="font-size: 2.5rem;">${escapeHtml(section.title || "Pricing Plans")}</h2>
      <div class="grid grid-3" style="align-items: center;">
        ${plansHTML}
      </div>
    </div>
  </section>`;
}

function generateContactHTML(section, isDark, cardBg, textColor, mutedText, accentColor) {
  return `
  <section id="contact">
    <div class="container">
      <h2 class="text-center mb-8" style="font-size: 2.5rem;">${escapeHtml(section.title || "Contact Us")}</h2>
      <div class="card" style="max-width: 600px; margin: 0 auto;">
        <div style="margin-bottom: 24px;">
          <p class="text-muted" style="margin-bottom: 8px;">Email</p>
          <p style="font-size: 1.125rem;">${escapeHtml(section.email || "contact@example.com")}</p>
        </div>
        <div style="margin-bottom: 24px;">
          <p class="text-muted" style="margin-bottom: 8px;">Phone</p>
          <p style="font-size: 1.125rem;">${escapeHtml(section.phone || "+1 234 567 890")}</p>
        </div>
        <div>
          <p class="text-muted" style="margin-bottom: 8px;">Address</p>
          <p style="font-size: 1.125rem;">${escapeHtml(section.address || "123 Street, City")}</p>
        </div>
      </div>
    </div>
  </section>`;
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
