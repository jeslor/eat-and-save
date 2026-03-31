export type RecommendationCategory =
  | 'budget'
  | 'highProtein'
  | 'highFiber'
  | 'lowSugar'
  | 'bestOverall'
  | 'cookAtHome';

export type MealBrowseCategory = 'all' | 'budget' | 'highProtein' | 'lowSugar' | 'cook' | 'quick';

export type MealAction = {
  kind: 'order' | 'recipe';
  label: string;
  provider: string;
  url: string;
  source: 'provider' | 'api' | 'fallback';
  destinationKind?: 'direct' | 'search';
};

export type DiscoverySource = {
  id: string;
  name: string;
  kind: 'provider' | 'restaurant' | 'recipe';
  url: string;
  regionLabel: string;
  notes?: string;
};

export type DiscoverySourceStatus = {
  sourceId: string;
  sourceName: string;
  kind: DiscoverySource['kind'];
  url: string;
  checkedAt: string;
  status: 'configured' | 'fallback';
};

export type MealIngredient = {
  id: string;
  name: string;
  icon: string;
};

export type MealCandidate = {
  id: string;
  name: string;
  vendor: string;
  imageUrl: string;
  availability: 'order' | 'cook';
  sourceId: string;
  sourceLabel: string;
  sourceUrl: string;
  comparisonLabel: string;
  discoveredAt?: string;
  price: number;
  marketPrice: number;
  calories: number;
  proteinG: number;
  fiberG: number;
  addedSugarG: number;
  rating: number;
  prepTimeMinutes: number;
  processedScore: number;
  description: string;
  tags: string[];
  isFavorite: boolean;
  ingredients: MealIngredient[];
  recipeSteps: string[];
  recipeQuery?: string;
  actionLinks: MealAction[];
};

export type DailyDiscoverySummary = {
  sourceCount: number;
  mealCount: number;
  fallbackUsed: boolean;
  topSavings: number;
};

export type DailyDiscoveryBatch = {
  generatedAt: string;
  freshnessLabel: string;
  meals: MealCandidate[];
  sources: DiscoverySourceStatus[];
  summary: DailyDiscoverySummary;
};

export type DailyRecommendation = {
  category: RecommendationCategory;
  categoryLabel: string;
  meal: MealCandidate;
  reason: string;
  compositeScore: number;
  actions: MealAction[];
  actionMessage?: string;
};

export type NutritionEntry = {
  mealId: string;
  mealName: string;
  calories: number;
  proteinG: number;
  fiberG: number;
  addedSugarG: number;
};

export type SavingsInsight = {
  label: string;
  amount: number;
  comparison: string;
};

export type MealHistoryEntry = {
  id: string;
  mealId: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  loggedAt: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  type: 'deal' | 'health' | 'reminder';
};

export type DeliveryOption = {
  id: string;
  label: string;
  eta: string;
  fee: number;
};

export type PaymentMethod = {
  id: string;
  label: string;
  subtitle: string;
};
