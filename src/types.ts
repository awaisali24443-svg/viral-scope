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
