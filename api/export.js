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

  try {
    const { layout, theme } = req.body;

    if (!layout) {
      return res.status(400).json({ error: "Layout is required" });
    }

    // Generate HTML code
    const htmlCode = generateFullHTML(layout, theme || 'dark');
    
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Disposition", "attachment; filename=website.html");
    return res.status(200).send(htmlCode);

  } catch (error) {
    console.error("Export error:", error);
    return res.status(500).json({ error: error.message });
  }
}

function generateFullHTML(layout, theme) {
  const primary = layout.primaryColor || 'indigo';
  const bgMain = theme === 'dark' ? 'bg-slate-900' : 'bg-white';
  const textMain = theme === 'dark' ? 'text-white' : 'text-slate-900';
  
  const sectionsHTML = (layout.sections || []).map(section => {
    return generateSectionHTML(section, theme, primary);
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { font-family: 'Inter', sans-serif; }
    html { scroll-behavior: smooth; }
  </style>
</head>
<body class="${bgMain} ${textMain}">
${sectionsHTML}
</body>
</html>`;
}

function generateSectionHTML(section, theme, primary) {
  const textMuted = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  
  switch (section.type) {
    case 'hero':
      return `<section class="min-h-screen flex items-center justify-center px-6 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-white via-gray-50 to-white'}">
  <div class="max-w-4xl text-center">
    <h1 class="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-${primary}-400 via-purple-400 to-${primary}-400 bg-clip-text text-transparent">${section.title || ''}</h1>
    <p class="text-xl md:text-2xl ${textMuted} mb-8 max-w-2xl mx-auto">${section.subtitle || ''}</p>
    <button class="px-8 py-4 bg-gradient-to-r from-${primary}-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-${primary}-500/30 transition-all">${section.buttonText || 'Get Started'}</button>
  </div>
</section>`;

    case 'features':
      return `<section class="py-24 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-4xl font-bold text-center mb-16">${section.title || 'Features'}</h2>
    <div class="grid md:grid-cols-3 gap-8">
      ${(section.items || []).map(item => `<div class="p-8 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} rounded-2xl">
        <div class="text-3xl mb-4">${item.icon || '⭐'}</div>
        <h3 class="text-xl font-bold mb-2">${item.title || ''}</h3>
        <p class="${textMuted}">${item.description || ''}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;

    case 'pricing':
      return `<section class="py-24 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-4xl font-bold text-center mb-16">${section.title || 'Pricing'}</h2>
    <div class="grid md:grid-cols-3 gap-8">
      ${(section.plans || []).map(plan => `<div class="p-8 ${plan.popular ? `bg-gradient-to-br from-${primary}-500 to-purple-500 text-white` : (theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50')} rounded-2xl ${plan.popular ? 'scale-105' : ''}">
        <h3 class="text-xl font-bold mb-2">${plan.name || ''}</h3>
        <div class="text-3xl font-bold mb-6">${plan.price || ''}</div>
        <ul class="space-y-3 mb-8">
          ${(plan.features || []).map(f => `<li>✓ ${f}</li>`).join('\n          ')}
        </ul>
        <button class="w-full py-3 ${plan.popular ? 'bg-white text-slate-900' : `bg-${primary}-500 text-white`} rounded-lg font-semibold">Choose Plan</button>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;

    case 'contact':
      return `<section class="py-24 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}">
  <div class="max-w-4xl mx-auto px-6 text-center">
    <h2 class="text-4xl font-bold mb-8">${section.title || 'Contact Us'}</h2>
    <div class="space-y-4 ${textMuted}">
      ${section.email ? `<p>📧 ${section.email}</p>` : ''}
      ${section.phone ? `<p>📞 ${section.phone}</p>` : ''}
      ${section.address ? `<p>📍 ${section.address}</p>` : ''}
    </div>
  </div>
</section>`;

    default:
      return '';
  }
}
