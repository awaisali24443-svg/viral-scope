export interface TrendingVideo {
  id: string;
  title: string;
  channelName: string;
  views: string;
  thumbnail: string;
  category: string;
  tags: string[];
  region: string;
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
