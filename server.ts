import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import { GoogleGenAI, Type } from '@google/genai';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = 3000;

// Trust proxy is required if behind a load balancer (like Cloud Run)
app.set('trust proxy', 1);

// Security headers (CSP disabled to allow Vite inline scripts in dev)
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors());
app.use(express.json());

// Serve static files from 'public' directory first
// This ensures sitemap.xml and robots.txt are served correctly before any other routes
app.use(express.static(path.join(process.cwd(), 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.xml')) {
      res.setHeader('Content-Type', 'application/xml');
    }
  }
}));

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

const globalTrendsFile = path.join(process.cwd(), 'global-trends.json');

// Blog Data Setup
const articlesFile = path.join(process.cwd(), 'data', 'articles.json');
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(articlesFile)) {
  fs.writeFileSync(articlesFile, JSON.stringify([]));
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Welcome to Awais Codex! Server is alive and running.' 
  });
});

app.get('/ping', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Pong! Greetings from Awais Codex.' 
  });
});

// Blog Routes
app.get('/api/articles', async (req, res) => {
  try {
    const data = await fs.promises.readFile(articlesFile, 'utf-8');
    const articles = JSON.parse(data);
    const list = articles.map((a: any) => ({
      title: a.title,
      slug: a.slug,
      metaDescription: a.metaDescription,
      publishDate: a.publishDate,
      readingTime: a.readingTime,
      author: a.author
    }));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load articles' });
  }
});

app.get('/api/articles/:slug', async (req, res) => {
  try {
    const data = await fs.promises.readFile(articlesFile, 'utf-8');
    const articles = JSON.parse(data);
    const article = articles.find((a: any) => a.slug === req.params.slug);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load article' });
  }
});

app.post('/api/generate-article', async (req, res) => {
  try {
    const { topic, adminSecret } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const expectedSecret = process.env.ADMIN_SECRET;
    if (expectedSecret && adminSecret !== expectedSecret) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret' });
    }

    const aiClient = getAI();
    const prompt = `
      You are an expert SEO content writer and social media strategist.
      Write a comprehensive, SEO-optimized blog article about: "${topic}".

      Requirements:
      - 800-1500 words.
      - Include an engaging introduction, actionable tips, and a strong conclusion.
      - Use proper Markdown formatting with H2 and H3 headings.
      - Include keywords naturally.
      - Do NOT include the title in the markdown content itself (it will be rendered separately).
      - At the end of the article, include these exact internal links using markdown:
        [Analyze your video here](/upload)
        [Check global trends](/global-trends)

      Respond ONLY with a valid JSON object in this exact format:
      {
        "title": "SEO Optimized Title",
        "slug": "seo-optimized-title",
        "metaDescription": "A compelling meta description under 160 characters.",
        "keywords": ["keyword1", "keyword2"],
        "readingTime": "5 min read",
        "content": "The full markdown content here..."
      }
    `;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            slug: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            readingTime: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ['title', 'slug', 'metaDescription', 'keywords', 'readingTime', 'content']
        }
      }
    });

    const generatedArticle = JSON.parse(response.text || '{}');
    
    generatedArticle.publishDate = new Date().toISOString();
    generatedArticle.author = "ViralScope AI";

    const data = await fs.promises.readFile(articlesFile, 'utf-8');
    const articles = JSON.parse(data);
    
    if (articles.some((a: any) => a.slug === generatedArticle.slug)) {
      generatedArticle.slug = `${generatedArticle.slug}-${Math.random().toString(36).substring(2, 7)}`;
    }
    
    articles.unshift(generatedArticle);
    await fs.promises.writeFile(articlesFile, JSON.stringify(articles, null, 2));

    res.json(generatedArticle);
  } catch (error: any) {
    console.error('Article generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate article' });
  }
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

app.get('/api/global-trends', async (req, res) => {
  try {
    // Check cache (1 hour)
    if (fs.existsSync(globalTrendsFile)) {
      const data = await fs.promises.readFile(globalTrendsFile, 'utf-8');
      const cached = JSON.parse(data);
      const cacheAge = Date.now() - new Date(cached.lastUpdated).getTime();
      if (cacheAge < 60 * 60 * 1000) {
        return res.json(cached);
      }
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'YouTube API key is not configured.' });
    }

    const REGIONS = ['US', 'PK', 'IN', 'BR', 'GB', 'DE', 'ID', 'JP'];
    const allVideos: any[] = [];

    // Fetch all regions in parallel
    await Promise.all(REGIONS.map(async (region) => {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=${region}&maxResults=15&key=${apiKey}`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          data.items.forEach((item: any) => {
            allVideos.push({ ...item, region });
          });
        }
      } catch (e) {
        console.error(`Failed to fetch region ${region}`, e);
      }
    }));

    if (allVideos.length === 0) {
      return res.status(500).json({ error: 'Failed to fetch global trends from YouTube API' });
    }

    const categoryMap: Record<string, string> = {
      '1': 'Film & Animation', '2': 'Autos & Vehicles', '10': 'Music', '15': 'Pets & Animals',
      '17': 'Sports', '19': 'Travel & Events', '20': 'Gaming', '22': 'People & Blogs',
      '23': 'Comedy', '24': 'Entertainment', '25': 'News & Politics', '26': 'Howto & Style',
      '27': 'Education', '28': 'Science & Technology', '29': 'Nonprofits & Activism'
    };

    // Group by video ID
    const videoMap = new Map<string, any>();
    allVideos.forEach(item => {
      if (videoMap.has(item.id)) {
        const existing = videoMap.get(item.id);
        if (!existing.regionsAppeared.includes(item.region)) {
          existing.regionsAppeared.push(item.region);
        }
      } else {
        videoMap.set(item.id, {
          id: item.id,
          title: item.snippet.title,
          channelName: item.snippet.channelTitle,
          views: parseInt(item.statistics.viewCount || '0', 10),
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
          category: categoryMap[item.snippet.categoryId] || 'Other',
          tags: item.snippet.tags || [],
          region: item.region, // Primary region
          regionsAppeared: [item.region],
          publishedAt: item.snippet.publishedAt
        });
      }
    });

    const uniqueVideos = Array.from(videoMap.values());

    // Calculate Global Score: (views / 1,000,000) * (regions_appeared * 1.5)
    uniqueVideos.forEach(v => {
      const viewScore = v.views / 1000000;
      const regionMultiplier = v.regionsAppeared.length * 1.5;
      v.globalScore = Math.round(viewScore * regionMultiplier * 10) / 10;
    });

    // Sort by global score
    uniqueVideos.sort((a, b) => b.globalScore - a.globalScore);

    // Calculate Top Category
    const categoryCounts: Record<string, number> = {};
    uniqueVideos.forEach(v => {
      categoryCounts[v.category] = (categoryCounts[v.category] || 0) + v.globalScore;
    });
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Mixed';

    // Calculate Top Tags
    const tagCounts: Record<string, number> = {};
    uniqueVideos.forEach(v => {
      v.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(t => t[0]);
    const topKeyword = topTags[0] || 'None';

    // Chart Data
    const categoryChartData = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, score]) => ({ name, score: Math.round(score) }));

    const regionChartData = REGIONS.map(region => {
      const count = uniqueVideos.filter(v => v.regionsAppeared.includes(region)).length;
      return { name: region, value: count };
    }).filter(r => r.value > 0);

    // Time Chart Data (Views over time based on publishedAt)
    const timeChartData = uniqueVideos
      .slice(0, 10)
      .map(v => ({
        time: new Date(v.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: v.views
      }))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    // AI Insights using Gemini
    const aiClient = getAI();
    const prompt = `
      Analyze this global YouTube trending data summary:
      Top Categories: ${Object.keys(categoryCounts).slice(0, 5).join(', ')}
      Top Tags: ${topTags.slice(0, 10).join(', ')}
      Regions Analyzed: ${REGIONS.join(', ')}
      
      Provide a structured JSON response with the following information:
      - likelyCities: An array of 3-5 specific cities globally where this content is likely most popular (e.g., ["Mumbai", "London", "New York", "Tokyo", "Dubai"]).
      - audienceType: A string describing the audience (e.g., "Urban / Rural / Mixed" or "Gen Z Urban").
      - culturalTargeting: A brief description of the cultural targeting or global appeal.
      - trendInsights: An array of 2-3 insightful sentences about these global trends.
    `;

    const aiResponse = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            likelyCities: { type: Type.ARRAY, items: { type: Type.STRING } },
            audienceType: { type: Type.STRING },
            culturalTargeting: { type: Type.STRING },
            trendInsights: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['likelyCities', 'audienceType', 'culturalTargeting', 'trendInsights']
        }
      }
    });

    const aiInsights = JSON.parse(aiResponse.text || '{}');

    const resultData = {
      lastUpdated: new Date().toISOString(),
      totalVideosAnalyzed: uniqueVideos.length,
      topCategory,
      topKeyword,
      videos: uniqueVideos.slice(0, 20), // Top 20 for UI
      topTags,
      categoryChartData,
      regionChartData,
      timeChartData,
      aiInsights
    };

    // Save to cache
    await fs.promises.writeFile(globalTrendsFile, JSON.stringify(resultData, null, 2));

    res.json(resultData);
  } catch (error) {
    console.error('Global Trends API Error:', error);
    res.status(500).json({ error: 'Internal server error while fetching global trends' });
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
    const fileData = await fs.promises.readFile(filePath);
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
      - trendSimilarityScore: A score from 0 to 10 indicating how well it matches current trends in the target region.
      - viralPotentialScore: A final score from 0 to 100.
      - bestPlatform: The single best platform for this video (TikTok, YouTube Shorts, or Instagram Reels).
      - bestRegions: An array of the best regions globally for this video (e.g., North America, South Asia, Europe, Latin America, Middle East, Southeast Asia).
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

    // Clean up the uploaded file safely
    try {
      if (fs.existsSync(filePath)) await fs.promises.unlink(filePath);
    } catch (e) {
      console.error('Failed to cleanup file:', e);
    }

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
    try {
      if (req.file && fs.existsSync(req.file.path)) {
        await fs.promises.unlink(req.file.path);
      }
    } catch (e) {
      console.error('Failed to cleanup file on error:', e);
    }
    
    let errorMessage = error.message || 'An error occurred during analysis';
    let statusCode = 500;
    
    if (error.status === 429 || errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('too many requests')) {
      statusCode = 429;
      errorMessage = 'Gemini API Quota Exceeded. You have been placed in the queue and your request will retry automatically.';
    }
    
    res.status(statusCode).json({ error: errorMessage });
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
    app.use(express.static(distPath, {
      setHeaders: (res, path) => {
        if (path.endsWith('.xml')) {
          res.setHeader('Content-Type', 'application/xml');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Welcome to Awais Codex! Server running on http://localhost:${PORT}`);
    
    // Keep-alive ping system to prevent the server from sleeping (e.g., on Render free tier)
    const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
    const pingUrl = process.env.RENDER_EXTERNAL_URL 
      ? `${process.env.RENDER_EXTERNAL_URL}/ping` 
      : process.env.PUBLIC_URL || `http://localhost:${PORT}/ping`;
    
    setInterval(async () => {
      try {
        const res = await fetch(pingUrl);
        const data = await res.json();
        console.log(`[Keep-Alive] Pinged ${pingUrl} - Status: ${res.status} - Message: ${data.message || 'OK'}`);
      } catch (err: any) {
        console.error(`[Keep-Alive] Ping failed:`, err.message);
      }
    }, PING_INTERVAL);
  });
}

startServer();
