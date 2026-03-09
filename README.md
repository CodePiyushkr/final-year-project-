# AI Website Builder

An AI-powered website builder that generates landing pages from simple text prompts.

## Features

- **Prompt to Website**: Enter a description and get a complete website layout
- **Live Preview**: See your generated website instantly
- **Theme Toggle**: Switch between light and dark themes
- **Inline Editing**: Edit titles, text, and features directly
- **Export HTML**: Download your website as a standalone HTML file

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **AI**: Ollama + Llama 3

## Project Structure

```
ai-website-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app
│   └── package.json
├── server/                 # Express backend
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── server.js          # Entry point
└── README.md
```

## Getting Started

### Prerequisites

1. Node.js (v18+)
2. Ollama installed with Llama 3 model

### Install Ollama & Llama 3

```bash
# Install Ollama from https://ollama.ai
# Then pull the model:
ollama pull llama3
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

Server runs on http://localhost:5000

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

App runs on http://localhost:5173

## API Endpoints

### POST /api/generate

Generate website layout from prompt.

**Request:**
```json
{
  "prompt": "landing page for a gym with hero, pricing and contact section"
}
```

**Response:**
```json
{
  "theme": "dark",
  "sections": [
    { "type": "hero", "title": "Welcome to FitGym", "subtitle": "Train Hard" },
    { "type": "features", "items": ["24/7 Gym", "Personal Trainer", "Diet Plans"] },
    { "type": "pricing", "plans": [{"name": "Basic", "price": "$29"}, ...] },
    { "type": "contact", "email": "contact@gym.com" }
  ]
}
```

### POST /api/export

Export website as HTML.

## License

MIT
