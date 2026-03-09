import { useState, useRef, useEffect } from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Contact from "../components/Contact";

const API_URL = "/api";

export default function Builder() {
  const [prompt, setPrompt] = useState("");
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("preview"); // 'preview' or 'code'
  const [messages, setMessages] = useState([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate code when layout changes
  useEffect(() => {
    if (layout) {
      generateCodePreview(layout);
    }
  }, [layout, theme]);

  const generateCodePreview = (layoutData) => {
    const code = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}">
${layoutData.sections.map(section => generateSectionCode(section)).join('\n')}
</body>
</html>`;
    setGeneratedCode(code);
  };

  const generateSectionCode = (section) => {
    const primary = layout?.primaryColor || 'indigo';
    const gradientFrom = theme === 'dark' ? 'from-gray-900' : 'from-gray-50';
    const gradientTo = theme === 'dark' ? 'to-gray-800' : 'to-white';
    const cardBg = theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50' : 'bg-white shadow-xl shadow-gray-200/50';
    const textMain = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

    switch (section.type) {
      case 'hero':
        return `  <!-- Hero Section -->
  <section class="min-h-screen relative overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}">
    <!-- Animated Background -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-${primary}-500/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-${primary}-500/10 rounded-full blur-3xl"></div>
    </div>
    <div class="relative min-h-screen flex items-center justify-center px-6">
      <div class="text-center max-w-4xl">
        <div class="inline-flex items-center gap-2 px-4 py-2 ${theme === 'dark' ? 'bg-gray-800/80' : 'bg-gray-100'} rounded-full text-sm ${textMuted} mb-8 backdrop-blur-sm">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Available Now
        </div>
        <h1 class="text-5xl md:text-7xl font-bold ${textMain} mb-6 leading-tight">
          ${section.title || 'Welcome'}
        </h1>
        <p class="text-xl md:text-2xl ${textMuted} mb-10 max-w-2xl mx-auto leading-relaxed">
          ${section.subtitle || ''}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="px-8 py-4 bg-gradient-to-r from-${primary}-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-${primary}-500/25 hover:shadow-${primary}-500/40 transition-all hover:-translate-y-0.5">
            ${section.buttonText || 'Get Started'}
          </button>
          <button class="px-8 py-4 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} ${textMain} rounded-2xl font-semibold text-lg transition-all">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  </section>`;

      case 'features':
      case 'benefits':
        return `  <!-- Features Section -->
  <section class="py-24 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <span class="text-${primary}-500 font-semibold text-sm uppercase tracking-wider">Features</span>
        <h2 class="text-4xl md:text-5xl font-bold ${textMain} mt-4">${section.title || 'Why Choose Us'}</h2>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
${(section.items || []).map(item => `        <div class="group p-8 ${cardBg} rounded-3xl border hover:border-${primary}-500/50 transition-all hover:-translate-y-1">
          <div class="w-14 h-14 bg-gradient-to-br from-${primary}-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
            ${item.icon || '⭐'}
          </div>
          <h3 class="text-xl font-bold ${textMain} mb-3">${item.title || ''}</h3>
          <p class="${textMuted} leading-relaxed">${item.description || item.desc || ''}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

      case 'stats':
        return `  <!-- Stats Section -->
  <section class="py-20 bg-gradient-to-r from-${primary}-600 via-purple-600 to-${primary}-600 relative overflow-hidden">
    <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
    <div class="max-w-6xl mx-auto px-6 relative">
      <div class="grid grid-cols-2 md:grid-cols-${Math.min((section.items || []).length, 4)} gap-8">
${(section.items || []).map(stat => `        <div class="text-center">
          <div class="text-5xl md:text-6xl font-bold text-white mb-2">${stat.value || stat.number || '0'}</div>
          <div class="text-white/80 font-medium">${stat.label || stat.title || ''}</div>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

      case 'testimonials':
        return `  <!-- Testimonials Section -->
  <section class="py-24 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <span class="text-${primary}-500 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
        <h2 class="text-4xl md:text-5xl font-bold ${textMain} mt-4">${section.title || 'Loved by Customers'}</h2>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
${(section.items || []).map(item => `        <div class="p-8 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'} rounded-3xl">
          <div class="flex items-center gap-1 mb-4">
            ${[1,2,3,4,5].map(i => `<svg class="w-5 h-5 ${i <= (item.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`).join('')}
          </div>
          <p class="${textMuted} text-lg italic mb-6">"${item.content || item.text || ''}"</p>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-${primary}-500 to-purple-500 flex items-center justify-center text-white font-bold">
              ${(item.name || 'U').charAt(0)}
            </div>
            <div>
              <div class="font-semibold ${textMain}">${item.name || 'Customer'}</div>
              <div class="text-sm ${textMuted}">${item.role || ''}</div>
            </div>
          </div>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

      case 'pricing':
        return `  <!-- Pricing Section -->
  <section class="py-24 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <span class="text-${primary}-500 font-semibold text-sm uppercase tracking-wider">Pricing</span>
        <h2 class="text-4xl md:text-5xl font-bold ${textMain} mt-4">${section.title || 'Simple Pricing'}</h2>
        <p class="${textMuted} mt-4 text-lg">Choose the plan that works for you</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8 items-start">
${(section.plans || []).map((plan, i) => `        <div class="relative p-8 ${plan.popular ? `bg-gradient-to-br from-${primary}-600 to-purple-600 text-white` : cardBg} rounded-3xl border ${plan.popular ? 'border-transparent scale-105 shadow-2xl' : ''} transition-all hover:-translate-y-1">
          ${plan.popular ? '<div class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 text-sm font-bold rounded-full">Most Popular</div>' : ''}
          <h3 class="text-2xl font-bold mb-2">${plan.name || 'Plan'}</h3>
          <div class="flex items-baseline gap-1 mb-6">
            <span class="text-5xl font-bold">${plan.price || '$0'}</span>
          </div>
          <ul class="space-y-4 mb-8">
${(plan.features || []).map(f => `            <li class="flex items-center gap-3">
              <svg class="w-5 h-5 ${plan.popular ? 'text-white' : `text-${primary}-500`}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span class="${plan.popular ? 'text-white/90' : textMuted}">${f}</span>
            </li>`).join('\n')}
          </ul>
          <button class="w-full py-4 ${plan.popular ? 'bg-white text-gray-900 hover:bg-gray-100' : `bg-${primary}-600 text-white hover:bg-${primary}-700`} rounded-2xl font-semibold transition-colors">
            Get Started
          </button>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

      case 'cta':
        return `  <!-- CTA Section -->
  <section class="py-24 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}">
    <div class="max-w-4xl mx-auto px-6">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-${primary}-600 via-purple-600 to-${primary}-600 p-12 md:p-16 text-center">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        <div class="relative">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">${section.title || 'Ready to Get Started?'}</h2>
          <p class="text-xl text-white/80 mb-8 max-w-2xl mx-auto">${section.subtitle || ''}</p>
          <button class="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl">
            ${section.buttonText || 'Get Started Now'} →
          </button>
        </div>
      </div>
    </div>
  </section>`;

      case 'contact':
        return `  <!-- Contact Section -->
  <section class="py-24 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <span class="text-${primary}-500 font-semibold text-sm uppercase tracking-wider">Contact</span>
        <h2 class="text-4xl md:text-5xl font-bold ${textMain} mt-4">${section.title || 'Get In Touch'}</h2>
      </div>
      <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div class="p-8 ${cardBg} rounded-3xl text-center border hover:border-${primary}-500/50 transition-all">
          <div class="w-14 h-14 bg-gradient-to-br from-${primary}-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">📧</div>
          <h3 class="font-semibold ${textMain} mb-2">Email</h3>
          <p class="${textMuted}">${section.email || 'hello@example.com'}</p>
        </div>
        <div class="p-8 ${cardBg} rounded-3xl text-center border hover:border-${primary}-500/50 transition-all">
          <div class="w-14 h-14 bg-gradient-to-br from-${primary}-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">📞</div>
          <h3 class="font-semibold ${textMain} mb-2">Phone</h3>
          <p class="${textMuted}">${section.phone || '+1 234 567 890'}</p>
        </div>
        <div class="p-8 ${cardBg} rounded-3xl text-center border hover:border-${primary}-500/50 transition-all">
          <div class="w-14 h-14 bg-gradient-to-br from-${primary}-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">📍</div>
          <h3 class="font-semibold ${textMain} mb-2">Location</h3>
          <p class="${textMuted}">${section.address || 'New York, USA'}</p>
        </div>
      </div>
    </div>
  </section>`;

      default:
        return `  <!-- ${section.type || 'Section'} -->
  <section class="py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}">
    <div class="max-w-6xl mx-auto px-6 text-center">
      <h2 class="text-3xl font-bold ${textMain}">${section.title || ''}</h2>
    </div>
  </section>`;
    }
  };

  // Generate website from prompt OR modify existing
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for your website");
      return;
    }

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: prompt }]);
    
    setLoading(true);
    setError(null);

    // Determine if this is a new website or modification
    const isModification = layout && layout.sections && layout.sections.length > 0;
    const actionText = isModification ? "Modifying your website..." : "Creating your website...";

    // Add AI thinking message
    setMessages(prev => [...prev, { type: 'ai', content: actionText, isLoading: true }]);

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt,
          currentLayout: isModification ? layout : null  // Send current layout for modifications
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to generate website";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const layoutData = data.layout || data;
      setLayout(layoutData);
      if (layoutData.theme) setTheme(layoutData.theme);

      // Use AI's natural conversational message, or generate a fallback
      const aiMessage = layoutData.message || data.message || (isModification 
        ? `Done! I've updated your website based on your request. The changes are now live in the preview.`
        : `I've created a beautiful ${layoutData.theme || 'dark'} themed website for you! Take a look at the preview on the right - I think you'll love it.`);

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          type: 'ai',
          content: aiMessage,
          isLoading: false
        };
        return updated;
      });

      setPrompt("");
    } catch (err) {
      setError(err.message || "Something went wrong");
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          type: 'ai',
          content: `❌ Error: ${err.message}`,
          isLoading: false,
          isError: true
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  // Export as HTML
  const handleExport = async () => {
    if (!layout) return;

    try {
      const response = await fetch(`${API_URL}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout, theme }),
      });

      if (!response.ok) throw new Error("Failed to export");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "website.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  // Open preview in new tab
  const handleOpenInNewTab = () => {
    if (!layout) return;
    const newWindow = window.open();
    newWindow.document.write(generatedCode);
    newWindow.document.close();
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Update section data
  const updateSection = (index, newData) => {
    setLayout((prev) => {
      const newSections = [...prev.sections];
      newSections[index] = { ...newSections[index], ...newData };
      return { ...prev, sections: newSections };
    });
  };

  // Render section based on type
  const renderSection = (section, index) => {
    const props = {
      data: section,
      onUpdate: (data) => updateSection(index, data),
      isEditing,
    };

    // For known component types, use dedicated components
    switch (section.type) {
      case "hero": return <Hero key={index} {...props} />;
      case "features": return <Features key={index} {...props} />;
      case "pricing": return <Pricing key={index} {...props} />;
      case "contact": return <Contact key={index} {...props} />;
      default: 
        // Generic renderer for all other section types
        return <GenericSection key={index} section={section} theme={theme} />;
    }
  };

  // Generic section renderer for dynamic section types - MODERN DESIGN
  const GenericSection = ({ section, theme }) => {
    const isDark = theme === 'dark';
    const primary = layout?.primaryColor || 'indigo';

    switch (section.type) {
      case 'stats':
        return (
          <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
            <div className="max-w-6xl mx-auto px-6 relative">
              <div className={`grid grid-cols-2 md:grid-cols-${Math.min((section.items || []).length, 4)} gap-8`}>
                {(section.items || []).map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-5xl md:text-6xl font-bold mb-2">{stat.value || stat.number || '0'}</div>
                    <div className="text-white/80 font-medium">{stat.label || stat.title || ''}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'testimonials':
        return (
          <section className={`py-24 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <span className="text-indigo-500 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
                <h2 className={`text-4xl md:text-5xl font-bold mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{section.title || 'Loved by Customers'}</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {(section.items || []).map((item, i) => (
                  <div key={i} className={`p-8 rounded-3xl ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-1 mb-4">
                      {[1,2,3,4,5].map(star => (
                        <svg key={star} className={`w-5 h-5 ${star <= (item.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                    <p className={`text-lg italic mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>"{item.content || item.text || ''}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {(item.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name || 'Customer'}</div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.role || ''}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section className={`py-24 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="max-w-4xl mx-auto px-6">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-12 md:p-16 text-center">
                <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
                <div className="relative">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{section.title || 'Ready to Get Started?'}</h2>
                  <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">{section.subtitle || ''}</p>
                  <button className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl">
                    {section.buttonText || 'Get Started Now'} →
                  </button>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        // Generic fallback with modern styling
        return (
          <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-6xl mx-auto px-6">
              {section.title && (
                <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {section.title}
                </h2>
              )}
              {section.items && (
                <div className="grid md:grid-cols-3 gap-8">
                  {section.items.map((item, i) => (
                    <div key={i} className={`p-8 rounded-3xl border transition-all hover:-translate-y-1 ${
                      isDark ? 'bg-gray-800/50 border-gray-700/50 hover:border-indigo-500/50' : 'bg-white border-gray-200 hover:border-indigo-500/50 shadow-lg'
                    }`}>
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
                        {item.icon || '⭐'}
                      </div>
                      <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {item.title || ''}
                      </h3>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {item.description || item.desc || ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Top Header */}
      <header className="h-16 flex-shrink-0 border-b border-white/10 backdrop-blur-xl bg-black/40 flex items-center justify-between px-6 relative z-10">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="relative">
            <img src="/logo.svg" alt="Logo" className="w-10 h-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-50"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
              AI Website Builder
            </span>
            <span className="text-[10px] text-slate-500 -mt-1">Powered by Llama 3</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {layout && (
            <>
              {/* Open in New Tab */}
              <button
                onClick={handleOpenInNewTab}
                className="px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 text-slate-300"
                title="Open preview in new tab"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="hidden sm:inline">New Tab</span>
              </button>
              
              {/* Edit Toggle */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-2 ${
                  isEditing 
                    ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400" 
                    : "bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {isEditing ? "Editing" : "Edit"}
              </button>
              
              {/* Export Button */}
              <button
                onClick={handleExport}
                className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg transition-all flex items-center gap-2 font-medium shadow-lg shadow-indigo-500/25"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Panel - Chat/Prompt */}
        <div className="w-[420px] flex-shrink-0 border-r border-white/10 flex flex-col bg-black/40 backdrop-blur-xl">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-24 h-24 mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl border border-white/10 flex items-center justify-center">
                    <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  What would you like to build?
                </h2>
                <p className="text-slate-500 text-sm mb-8 max-w-xs">
                  Describe your dream website and watch AI bring it to life in seconds
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["📸 Photography portfolio", "⚖️ Law firm website", "🎨 Design agency", "🏥 Medical clinic", "🎓 Online course"].map((example) => (
                    <button
                      key={example}
                      onClick={() => setPrompt(example.slice(3))}
                      className="px-4 py-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 rounded-full transition-all"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20' 
                      : msg.isError 
                        ? 'bg-red-500/10 text-red-300 border border-red-500/30' 
                        : 'bg-white/5 text-slate-200 border border-white/10'
                  }`}>
                    {msg.isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                        </div>
                        <span className="text-sm text-slate-400">{msg.content}</span>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            {error && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                placeholder={layout ? "Describe changes to make..." : "Describe your website..."}
                rows={3}
                className="w-full px-4 py-3 pr-14 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none transition-all"
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="absolute right-2 bottom-2 p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg transition-all shadow-lg shadow-indigo-500/25 disabled:shadow-none"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-600 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Right Panel - Preview/Code */}
        <div className="flex-1 flex flex-col bg-[#0d0d12] overflow-hidden">
          {/* Tab Bar */}
          <div className="h-12 flex-shrink-0 border-b border-white/10 flex items-center justify-between px-4 bg-black/40">
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                  activeTab === "preview"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </span>
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                  activeTab === "code"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Code
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {activeTab === "code" && layout && (
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all flex items-center gap-1.5 text-slate-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "preview" ? (
              /* Preview */
              <div className={`h-full overflow-y-auto ${theme === "dark" ? "dark" : ""}`}>
                {layout ? (
                  <div className={theme === "dark" ? "bg-slate-900" : "bg-white"}>
                    {layout.sections && layout.sections.map(renderSection)}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-[#0d0d12]">
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 blur-xl animate-pulse"></div>
                        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                          <svg className="w-full h-full text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm">Your website preview will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Code View */
              <div className="h-full overflow-auto bg-[#0a0a0f] p-4">
                {layout ? (
                  <div className="bg-black/40 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <pre className="text-sm text-slate-300 font-mono overflow-auto">
                      <code>{generatedCode}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl opacity-20 blur-xl animate-pulse"></div>
                        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                          <svg className="w-full h-full text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm">Generated code will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
