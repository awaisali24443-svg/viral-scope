import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Set up multer for video uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Initialize Gemini API
let ai: GoogleGenAI | null = null;
function getAI() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

// Simple JSON storage for trends
const trendsFile = path.join(process.cwd(), 'trends.json');
if (!fs.existsSync(trendsFile)) {
  fs.writeFileSync(trendsFile, JSON.stringify({
    lastUpdated: new Date().toISOString(),
    trends: [
      { category: 'Comedy', tags: ['#funny', '#prank', '#humor'], engagementLevel: 'High', region: 'North America' },
      { category: 'Education', tags: ['#tutorial', '#howto', '#learn'], engagementLevel: 'Medium', region: 'Europe' },
      { category: 'Gaming', tags: ['#gaming', '#highlights', '#streamer'], engagementLevel: 'High', region: 'South Asia' },
    ]
  }));
}

// Trend collection script (Simulated for YouTube Data API)
setInterval(() => {
  console.log('Collecting trending information...');
  // In a real scenario, this would call the YouTube Data API
  // and update the trends.json file.
  const trends = JSON.parse(fs.readFileSync(trendsFile, 'utf-8'));
  trends.lastUpdated = new Date().toISOString();
  fs.writeFileSync(trendsFile, JSON.stringify(trends, null, 2));
}, 60 * 60 * 1000); // Every hour

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/trends', (req, res) => {
  try {
    const trends = JSON.parse(fs.readFileSync(trendsFile, 'utf-8'));
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read trends data' });
  }
});

app.post('/api/analyze', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const { platform, region } = req.body;
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    // Read file as base64
    const fileData = fs.readFileSync(filePath);
    const base64Data = fileData.toString('base64');

    const aiClient = getAI();

    const prompt = `
      Analyze this video for its viral potential on ${platform || 'social media'}, targeting the ${region || 'Global'} region.
      
      Perform deep analysis and provide a structured JSON response with the following information:
      - videoTopic: The main topic of the video (e.g., football trick, cooking tutorial, gaming highlight).
      - detectedEmotions: An array of emotional signals (e.g., humor, surprise, excitement, curiosity).
      - editingStyle: A brief description of the editing style (pacing, transitions, camera movement).
      - visualQualityScore: A score from 0 to 10 evaluating lighting, clarity, stability, and contrast.
      - hookStrengthScore: A score from 0 to 10 evaluating the first 3 seconds (action, curiosity, surprise).
      - trendSimilarityScore: A score from 0 to 10 indicating how well it matches current trends.
      - viralPotentialScore: A final score from 0 to 100.
      - bestPlatform: The single best platform for this video (TikTok, YouTube Shorts, or Instagram Reels).
      - bestRegions: An array of the best regions for this video (e.g., North America, South Asia, Europe, Latin America, Middle East, Southeast Asia).
      - improvementSuggestions: An array of at least 10 specific suggestions to improve virality.
      - hashtagSuggestions: An array of 5-10 recommended hashtags.
      - bestPostingTime: A suggested best time to post (e.g., "Weekdays 6 PM - 8 PM EST").
    `;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          }
        },
        prompt
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            videoTopic: { type: Type.STRING },
            detectedEmotions: { type: Type.ARRAY, items: { type: Type.STRING } },
            editingStyle: { type: Type.STRING },
            visualQualityScore: { type: Type.NUMBER },
            hookStrengthScore: { type: Type.NUMBER },
            trendSimilarityScore: { type: Type.NUMBER },
            viralPotentialScore: { type: Type.NUMBER },
            bestPlatform: { type: Type.STRING },
            bestRegions: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            hashtagSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            bestPostingTime: { type: Type.STRING },
          },
          required: [
            'videoTopic', 'detectedEmotions', 'editingStyle', 'visualQualityScore', 
            'hookStrengthScore', 'trendSimilarityScore', 'viralPotentialScore', 
            'bestPlatform', 'bestRegions', 'improvementSuggestions', 
            'hashtagSuggestions', 'bestPostingTime'
          ]
        }
      }
    });

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    let result;
    try {
      result = JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON", response.text);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    res.json(result);

  } catch (error: any) {
    console.error('Analysis error:', error);
    // Clean up file if it exists and there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message || 'An error occurred during analysis' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
