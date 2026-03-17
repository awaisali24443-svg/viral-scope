export interface TrendingVideo {
  id: string;
  title: string;
  channelName: string;
  views: string;
  thumbnail: string;
  category: string;
  tags: string[];
  region: string;
  publishedAt?: string;
}

export interface GlobalTrendingVideo extends TrendingVideo {
  globalScore: number;
  regionsAppeared: string[];
}

export interface AIInsights {
  likelyCities: string[];
  audienceType: string;
  culturalTargeting: string;
  trendInsights: string[];
}

export interface GlobalTrendsData {
  lastUpdated: string;
  totalVideosAnalyzed: number;
  topCategory: string;
  topKeyword: string;
  videos: GlobalTrendingVideo[];
  topTags: string[];
  categoryChartData: { name: string; score: number }[];
  regionChartData: { name: string; value: number }[];
  timeChartData: { time: string; views: number }[];
  aiInsights: AIInsights;
}

export interface TrendsData {
  lastUpdated: string;
  videos: TrendingVideo[];
  topCategory: string;
  topTags: string[];
}

export interface ViralReport {
  videoTopic: string;
  detectedEmotions: string[];
  editingStyle: string;
  visualQualityScore: number;
  hookStrengthScore: number;
  trendSimilarityScore: number;
  viralPotentialScore: number;
  bestPlatform: string;
  bestRegions: string[];
  improvementSuggestions: string[];
  hashtagSuggestions: string[];
  bestPostingTime: string;
}

export interface Article {
  title: string;
  slug: string;
  metaDescription: string;
  keywords: string[];
  readingTime: string;
  content: string;
  publishDate: string;
  author: string;
}
