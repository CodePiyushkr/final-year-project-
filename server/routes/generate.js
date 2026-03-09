import express from "express";
import { generateLayout, modifyLayout } from "../services/aiService.js";
import { generateHTML } from "../services/exportService.js";

const router = express.Router();

// POST /api/generate - Generate NEW website or MODIFY existing
router.post("/generate", async (req, res) => {
  try {
    const { prompt, currentLayout } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log(`\n${"=".repeat(50)}`);
    
    let layout;
    
    if (currentLayout && currentLayout.sections && currentLayout.sections.length > 0) {
      // MODIFY existing website
      console.log(`🔄 MODIFY Request: "${prompt}"`);
      console.log(`   Current sections: ${currentLayout.sections.map(s => s.type).join(", ")}`);
      console.log(`${"=".repeat(50)}`);
      
      layout = await modifyLayout(prompt, currentLayout);
      console.log("✅ Website MODIFIED by AI!");
    } else {
      // CREATE new website
      console.log(`🆕 NEW Website Request: "${prompt}"`);
      console.log(`${"=".repeat(50)}`);
      
      layout = await generateLayout(prompt);
      console.log("✅ NEW Website created by AI!");
    }
    
    console.log(`📊 Final sections: ${layout.sections.map(s => s.type).join(", ")}`);
    
    res.json(layout);
  } catch (error) {
    console.error("❌ Generation error:", error.message);
    
    const errorMessage = error.message.includes("Ollama") 
      ? "Ollama AI is not running. Please start Ollama with 'ollama serve' command in terminal."
      : `AI Error: ${error.message}`;
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.message 
    });
  }
});

// POST /api/export - Export website as HTML
router.post("/export", async (req, res) => {
  try {
    const { layout, theme } = req.body;

    if (!layout || !layout.sections) {
      return res.status(400).json({ error: "Layout is required" });
    }

    const html = generateHTML(layout, theme);
    
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Disposition", "attachment; filename=website.html");
    res.send(html);
  } catch (error) {
    console.error("❌ Export error:", error.message);
    res.status(500).json({ 
      error: "Failed to export HTML", 
      details: error.message 
    });
  }
});

export default router;
