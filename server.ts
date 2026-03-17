import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = 3000;

// Trust proxy is required if behind a load balancer (like Cloud Run)
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

// Set up rate limiter for the analyze endpoint
const analyzeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per hour
  message: { error: 'Too many videos analyzed from this IP. Please try again after an hour to protect our free API limits.' },
  standardHeaders: true,
  legacyHeaders: false,
});

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
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit for inlineData
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

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/trends', async (req, res) => {
  try {
    const region = (req.query.region as string) || 'US';
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'YouTube API key is not configured. Please add YOUTUBE_API_KEY to environment variables.' });
    }

    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=${region}&maxResults=12&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('YouTube API Error:', data);
      return res.status(response.status).json({ error: 'Failed to fetch trends from YouTube API' });
    }

    // Map YouTube category IDs to readable names
    const categoryMap: Record<string, string> = {
      '1': 'Film & Animation', '2': 'Autos & Vehicles', '10': 'Music', '15': 'Pets & Animals',
      '17': 'Sports', '19': 'Travel & Events', '20': 'Gaming', '22': 'People & Blogs',
      '23': 'Comedy', '24': 'Entertainment', '25': 'News & Politics', '26': 'Howto & Style',
      '27': 'Education', '28': 'Science & Technology', '29': 'Nonprofits & Activism'
    };

    const videos = data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      views: item.statistics.viewCount,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      category: categoryMap[item.snippet.categoryId] || 'Other',
      tags: item.snippet.tags || [],
      region: region
    }));

    // Calculate top category
    const categoryCounts: Record<string, number> = {};
    videos.forEach((v: any) => {
      categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
    });
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Mixed';

    // Calculate top tags
    const tagCounts: Record<string, number> = {};
    videos.forEach((v: any) => {
      v.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(t => t[0]);

    res.json({
      lastUpdated: new Date().toISOString(),
      videos,
      topCategory,
      topTags
    });
  } catch (error) {
    console.error('Trends API Error:', error);
    res.status(500).json({ error: 'Internal server error while fetching trends' });
  }
});

app.post('/api/analyze', analyzeLimiter, upload.single('video'), async (req, res) => {
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
      model: 'gemini-3-flash-preview',
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
    
    let errorMessage = error.message || 'An error occurred during analysis';
    if (error.status === 429 || errorMessage.toLowerCase().includes('quota')) {
      errorMessage = 'Gemini API Quota Exceeded. Video analysis requires a large number of tokens. Please try a shorter video, wait a minute for your per-minute quota to reset, or check your Google AI Studio billing tier.';
    }
    
    res.status(500).json({ error: errorMessage });
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
