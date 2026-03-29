import type {
  DeliveryOption,
  DiscoverySource,
  MealAction,
  MealBrowseCategory,
  MealCandidate,
  MealHistoryEntry,
  NotificationItem,
  NutritionEntry,
  PaymentMethod,
  SavingsInsight,
} from '@/types/recommendation';

const marketplaceSearchUrls = {
  uberEats: (query: string) => `https://www.ubereats.com/search?q=${encodeURIComponent(query)}`,
  deliveroo: (query: string) => `https://deliveroo.co.uk/search?q=${encodeURIComponent(query)}`,
  wolt: (query: string) => `https://wolt.com/en/search?q=${encodeURIComponent(query)}`,
  glovo: (query: string) => `https://glovoapp.com/search?query=${encodeURIComponent(query)}`,
} as const;

const marketplaceLabels = {
  uberEats: 'Uber Eats',
  deliveroo: 'Deliveroo',
  wolt: 'Wolt',
  glovo: 'Glovo',
} as const;

function createOrderActions(
  query: string,
  providers: Array<keyof typeof marketplaceSearchUrls>,
): MealAction[] {
  return providers.map((provider) => ({
    kind: 'order',
    label: `Order on ${marketplaceLabels[provider]}`,
    provider: marketplaceLabels[provider],
    url: marketplaceSearchUrls[provider](query),
    source: 'provider',
  }));
}

function createRecipeAction(url: string): MealAction {
  return {
    kind: 'recipe',
    label: 'Open recipe',
    provider: 'Curated recipe',
    url,
    source: 'fallback',
  };
}

export const discoverySources: DiscoverySource[] = [
  {
    id: 'uber-eats',
    name: 'Uber Eats',
    kind: 'provider',
    url: 'https://www.ubereats.com/',
    regionLabel: 'Delivery platforms',
    notes: 'Configured provider search source for orderable meals.',
  },
  {
    id: 'deliveroo',
    name: 'Deliveroo',
    kind: 'provider',
    url: 'https://deliveroo.co.uk/',
    regionLabel: 'Delivery platforms',
    notes: 'Configured provider search source for curated restaurant discovery.',
  },
  {
    id: 'wolt',
    name: 'Wolt',
    kind: 'provider',
    url: 'https://wolt.com/',
    regionLabel: 'Delivery platforms',
    notes: 'Configured provider search source for daily deal discovery.',
  },
  {
    id: 'glovo',
    name: 'Glovo',
    kind: 'provider',
    url: 'https://glovoapp.com/',
    regionLabel: 'Delivery platforms',
    notes: 'Configured provider search source for budget-friendly meal lookups.',
  },
  {
    id: 'curated-recipes',
    name: 'Curated recipe collection',
    kind: 'recipe',
    url: 'https://www.allrecipes.com/',
    regionLabel: 'Cook at home',
    notes: 'Fallback recipe source for healthy self-prepared meals.',
  },
];

export const mockMealCandidates: MealCandidate[] = [
  {
    id: 'grilled-chicken-bowl',
    name: 'Grilled Chicken Bowl',
    vendor: 'Fresh Box',
    imageUrl:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    availability: 'order',
    sourceId: 'uber-eats',
    sourceLabel: 'Uber Eats',
    sourceUrl: marketplaceSearchUrls.uberEats('grilled chicken bowl'),
    comparisonLabel: 'vs nearby market average',
    price: 8.5,
    marketPrice: 12.4,
    calories: 520,
    proteinG: 38,
    fiberG: 10,
    addedSugarG: 4,
    rating: 4.8,
    prepTimeMinutes: 18,
    processedScore: 2,
    description:
      'A lean chicken bowl with brown rice, roasted broccoli, and a chili-lime yogurt drizzle for a strong protein-to-price balance.',
    tags: ['highProtein', 'quick'],
    isFavorite: true,
    ingredients: [
      { id: 'chicken', name: 'Chicken', icon: '🍗' },
      { id: 'rice', name: 'Brown rice', icon: '🍚' },
      { id: 'broccoli', name: 'Broccoli', icon: '🥦' },
      { id: 'yogurt', name: 'Yogurt', icon: '🥣' },
    ],
    recipeSteps: [
      'Grill the chicken until cooked through.',
      'Warm the brown rice and roasted broccoli.',
      'Finish with the chili-lime yogurt drizzle and serve.',
    ],
    actionLinks: createOrderActions('grilled chicken bowl', ['uberEats', 'deliveroo']),
  },
  {
    id: 'lentil-power-wrap',
    name: 'Lentil Power Wrap',
    vendor: 'Green Wraps',
    imageUrl:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    availability: 'order',
    sourceId: 'glovo',
    sourceLabel: 'Glovo',
    sourceUrl: marketplaceSearchUrls.glovo('lentil power wrap'),
    comparisonLabel: 'vs nearby market average',
    price: 6.25,
    marketPrice: 9.1,
    calories: 430,
    proteinG: 24,
    fiberG: 14,
    addedSugarG: 3,
    rating: 4.6,
    prepTimeMinutes: 12,
    processedScore: 1,
    description:
      'A warm wholegrain wrap packed with lentils, crunchy greens, and tahini dressing for a budget-friendly fiber boost.',
    tags: ['budget', 'highFiber'],
    isFavorite: true,
    ingredients: [
      { id: 'lentils', name: 'Lentils', icon: '🫘' },
      { id: 'greens', name: 'Greens', icon: '🥬' },
      { id: 'wrap', name: 'Wholegrain wrap', icon: '🌯' },
      { id: 'tahini', name: 'Tahini', icon: '🥄' },
    ],
    recipeSteps: [
      'Warm the wrap until pliable.',
      'Fill with lentils, greens, and tahini.',
      'Roll tightly and toast lightly before serving.',
    ],
    actionLinks: createOrderActions('lentil power wrap', ['uberEats', 'glovo']),
  },
  {
    id: 'salmon-rice-box',
    name: 'Salmon Rice Box',
    vendor: 'Fit Kitchen',
    imageUrl:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
    availability: 'order',
    sourceId: 'wolt',
    sourceLabel: 'Wolt',
    sourceUrl: marketplaceSearchUrls.wolt('salmon rice box'),
    comparisonLabel: 'vs nearby market average',
    price: 10.75,
    marketPrice: 14.2,
    calories: 610,
    proteinG: 34,
    fiberG: 8,
    addedSugarG: 2,
    rating: 4.9,
    prepTimeMinutes: 20,
    processedScore: 1,
    description:
      'Seared salmon over herbed rice with cucumbers and edamame, built for a polished high-value lunch.',
    tags: ['highProtein', 'quick'],
    isFavorite: false,
    ingredients: [
      { id: 'salmon', name: 'Salmon', icon: '🐟' },
      { id: 'rice', name: 'Rice', icon: '🍚' },
      { id: 'edamame', name: 'Edamame', icon: '🫛' },
      { id: 'cucumber', name: 'Cucumber', icon: '🥒' },
    ],
    recipeSteps: [
      'Sear the salmon fillet until flaky.',
      'Plate with herbed rice, cucumber, and edamame.',
      'Finish with lemon and sesame dressing.',
    ],
    actionLinks: createOrderActions('salmon rice box', ['uberEats', 'wolt']),
  },
  {
    id: 'greek-yogurt-parfait',
    name: 'Greek Yogurt Parfait',
    vendor: 'Daily Fuel',
    imageUrl:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
    availability: 'order',
    sourceId: 'uber-eats',
    sourceLabel: 'Uber Eats',
    sourceUrl: marketplaceSearchUrls.uberEats('greek yogurt parfait'),
    comparisonLabel: 'vs nearby market average',
    price: 4.9,
    marketPrice: 6.7,
    calories: 280,
    proteinG: 19,
    fiberG: 6,
    addedSugarG: 8,
    rating: 4.4,
    prepTimeMinutes: 6,
    processedScore: 2,
    description:
      'Greek yogurt layered with berries, seeds, and granola for a light grab-and-go breakfast or snack.',
    tags: ['budget', 'quick'],
    isFavorite: false,
    ingredients: [
      { id: 'yogurt', name: 'Greek yogurt', icon: '🥣' },
      { id: 'berries', name: 'Berries', icon: '🫐' },
      { id: 'granola', name: 'Granola', icon: '🥜' },
      { id: 'seeds', name: 'Seeds', icon: '🌱' },
    ],
    recipeSteps: [
      'Layer yogurt and berries in a glass.',
      'Top with granola and mixed seeds.',
      'Serve chilled.',
    ],
    actionLinks: createOrderActions('greek yogurt parfait', ['uberEats']),
  },
  {
    id: 'tofu-quinoa-salad',
    name: 'Tofu Quinoa Salad',
    vendor: 'Garden Bowl',
    imageUrl:
      'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1200&q=80',
    availability: 'order',
    sourceId: 'deliveroo',
    sourceLabel: 'Deliveroo',
    sourceUrl: marketplaceSearchUrls.deliveroo('tofu quinoa salad'),
    comparisonLabel: 'vs nearby market average',
    price: 7.1,
    marketPrice: 10.6,
    calories: 470,
    proteinG: 26,
    fiberG: 12,
    addedSugarG: 2,
    rating: 4.7,
    prepTimeMinutes: 14,
    processedScore: 1,
    description:
      'A bright quinoa salad with tofu, greens, and citrus vinaigrette that keeps sugar low and fiber high.',
    tags: ['highFiber', 'lowSugar'],
    isFavorite: true,
    ingredients: [
      { id: 'tofu', name: 'Tofu', icon: '🧈' },
      { id: 'quinoa', name: 'Quinoa', icon: '🥣' },
      { id: 'greens', name: 'Greens', icon: '🥬' },
      { id: 'citrus', name: 'Citrus', icon: '🍋' },
    ],
    recipeSteps: [
      'Bake or pan-sear the tofu.',
      'Toss quinoa with greens and vinaigrette.',
      'Top with tofu and citrus zest.',
    ],
    actionLinks: createOrderActions('tofu quinoa salad', ['deliveroo', 'wolt']),
  },
  {
    id: 'turkey-burrito-bowl',
    name: 'Turkey Burrito Bowl',
    vendor: 'Protein Corner',
    imageUrl:
      'https://images.unsplash.com/photo-1539136788836-5699e78bfc75?auto=format&fit=crop&w=1200&q=80',
    availability: 'order',
    sourceId: 'glovo',
    sourceLabel: 'Glovo',
    sourceUrl: marketplaceSearchUrls.glovo('turkey burrito bowl'),
    comparisonLabel: 'vs nearby market average',
    price: 9.2,
    marketPrice: 12.8,
    calories: 590,
    proteinG: 31,
    fiberG: 8,
    addedSugarG: 3,
    rating: 4.5,
    prepTimeMinutes: 16,
    processedScore: 2,
    description:
      'A turkey burrito bowl layered with beans, salsa, and grilled vegetables for a hearty lunch option.',
    tags: ['highProtein'],
    isFavorite: false,
    ingredients: [
      { id: 'turkey', name: 'Turkey', icon: '🍗' },
      { id: 'beans', name: 'Beans', icon: '🫘' },
      { id: 'rice', name: 'Rice', icon: '🍚' },
      { id: 'salsa', name: 'Salsa', icon: '🍅' },
    ],
    recipeSteps: [
      'Cook the turkey with light taco seasoning.',
      'Layer over rice with beans and vegetables.',
      'Top with fresh salsa.',
    ],
    actionLinks: createOrderActions('turkey burrito bowl', ['uberEats', 'glovo']),
  },
  {
    id: 'bean-chili-pot',
    name: 'Bean Chili Pot',
    vendor: 'Home Kitchen',
    imageUrl:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    availability: 'cook',
    sourceId: 'curated-recipes',
    sourceLabel: 'Curated recipe collection',
    sourceUrl: 'https://www.allrecipes.com/search?q=healthy+bean+chili',
    comparisonLabel: 'vs ordering a similar meal online',
    price: 6.4,
    marketPrice: 10.5,
    calories: 410,
    proteinG: 20,
    fiberG: 13,
    addedSugarG: 3,
    rating: 4.9,
    prepTimeMinutes: 28,
    processedScore: 1,
    description:
      'A cozy bean chili with tomatoes and peppers that delivers strong savings and a high fiber score at home.',
    tags: ['cook', 'budget', 'highFiber'],
    isFavorite: true,
    ingredients: [
      { id: 'beans', name: 'Beans', icon: '🫘' },
      { id: 'tomatoes', name: 'Tomatoes', icon: '🍅' },
      { id: 'pepper', name: 'Peppers', icon: '🫑' },
      { id: 'onion', name: 'Onion', icon: '🧅' },
    ],
    recipeSteps: [
      'Saute onion and peppers until softened.',
      'Add tomatoes, beans, and spices and simmer.',
      'Serve hot with herbs on top.',
    ],
    recipeQuery: 'chili',
    actionLinks: [createRecipeAction('https://www.allrecipes.com/search?q=healthy+bean+chili')],
  },
  {
    id: 'chickpea-pasta-skillet',
    name: 'Chickpea Pasta Skillet',
    vendor: 'Home Kitchen',
    imageUrl:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80',
    availability: 'cook',
    sourceId: 'curated-recipes',
    sourceLabel: 'Curated recipe collection',
    sourceUrl: 'https://www.allrecipes.com/search?q=healthy+chickpea+pasta',
    comparisonLabel: 'vs ordering a similar meal online',
    price: 6.8,
    marketPrice: 11.2,
    calories: 455,
    proteinG: 21,
    fiberG: 11,
    addedSugarG: 4,
    rating: 4.6,
    prepTimeMinutes: 24,
    processedScore: 1,
    description:
      'Chickpea pasta tossed with spinach and tomato for a fast, affordable dinner with balanced macros.',
    tags: ['cook', 'quick'],
    isFavorite: false,
    ingredients: [
      { id: 'pasta', name: 'Chickpea pasta', icon: '🍝' },
      { id: 'spinach', name: 'Spinach', icon: '🥬' },
      { id: 'tomatoes', name: 'Tomatoes', icon: '🍅' },
      { id: 'garlic', name: 'Garlic', icon: '🧄' },
    ],
    recipeSteps: [
      'Boil the chickpea pasta until tender.',
      'Saute garlic, spinach, and tomatoes.',
      'Combine with pasta and season to taste.',
    ],
    recipeQuery: 'pasta',
    actionLinks: [createRecipeAction('https://www.allrecipes.com/search?q=healthy+chickpea+pasta')],
  },
  {
    id: 'egg-avocado-toast',
    name: 'Egg Avocado Toast',
    vendor: 'Home Kitchen',
    imageUrl:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80',
    availability: 'cook',
    sourceId: 'curated-recipes',
    sourceLabel: 'Curated recipe collection',
    sourceUrl: 'https://www.allrecipes.com/search?q=egg+avocado+toast',
    comparisonLabel: 'vs ordering a similar meal online',
    price: 5.6,
    marketPrice: 8.4,
    calories: 360,
    proteinG: 18,
    fiberG: 5,
    addedSugarG: 2,
    rating: 4.5,
    prepTimeMinutes: 10,
    processedScore: 1,
    description:
      'A quick avocado toast with eggs and seeds that works well as a simple protein-rich breakfast.',
    tags: ['cook', 'quick', 'lowSugar'],
    isFavorite: false,
    ingredients: [
      { id: 'bread', name: 'Wholegrain toast', icon: '🍞' },
      { id: 'avocado', name: 'Avocado', icon: '🥑' },
      { id: 'egg', name: 'Eggs', icon: '🥚' },
      { id: 'seeds', name: 'Seeds', icon: '🌱' },
    ],
    recipeSteps: [
      'Toast the bread until crisp.',
      'Mash avocado with seasoning and spread over toast.',
      'Top with eggs and mixed seeds.',
    ],
    recipeQuery: 'avocado',
    actionLinks: [createRecipeAction('https://www.allrecipes.com/search?q=egg+avocado+toast')],
  },
];

export const mockNutritionEntries: NutritionEntry[] = [
  {
    mealId: 'greek-yogurt-parfait',
    mealName: 'Greek Yogurt Parfait',
    calories: 280,
    proteinG: 19,
    fiberG: 6,
    addedSugarG: 8,
  },
  {
    mealId: 'grilled-chicken-bowl',
    mealName: 'Grilled Chicken Bowl',
    calories: 520,
    proteinG: 38,
    fiberG: 10,
    addedSugarG: 4,
  },
  {
    mealId: 'egg-avocado-toast',
    mealName: 'Egg Avocado Toast',
    calories: 360,
    proteinG: 18,
    fiberG: 5,
    addedSugarG: 2,
  },
];

export const mealBrowseCategories: Array<{ id: MealBrowseCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'budget', label: 'Budget' },
  { id: 'highProtein', label: 'High Protein' },
  { id: 'lowSugar', label: 'Low Sugar' },
  { id: 'cook', label: 'Cook at Home' },
  { id: 'quick', label: 'Quick' },
];

export const favoriteMealIds = ['grilled-chicken-bowl', 'lentil-power-wrap', 'bean-chili-pot'];

export const mealHistoryEntries: MealHistoryEntry[] = [
  { id: 'history-1', mealId: 'greek-yogurt-parfait', mealType: 'Breakfast', loggedAt: 'Today · 8:10 AM' },
  { id: 'history-2', mealId: 'grilled-chicken-bowl', mealType: 'Lunch', loggedAt: 'Today · 1:15 PM' },
  { id: 'history-3', mealId: 'bean-chili-pot', mealType: 'Dinner', loggedAt: 'Yesterday · 7:30 PM' },
  { id: 'history-4', mealId: 'lentil-power-wrap', mealType: 'Lunch', loggedAt: 'Yesterday · 12:40 PM' },
];

export const savingsInsights: SavingsInsight[] = [
  { label: 'Today', amount: 10.9, comparison: 'vs local delivery pricing' },
  { label: 'This week', amount: 38.4, comparison: 'across tracked meals' },
  { label: 'This month', amount: 142.8, comparison: 'from smart swaps and home prep' },
];

export const notificationItems: NotificationItem[] = [
  {
    id: 'notification-1',
    title: 'Today’s best budget meal is ready',
    description: 'The Lentil Power Wrap is still the strongest healthy value pick this morning.',
    timeLabel: '5 min ago',
    type: 'deal',
  },
  {
    id: 'notification-2',
    title: 'Protein target is within reach',
    description: 'One more 15g+ protein meal would push your nutrition score higher tonight.',
    timeLabel: '1 hr ago',
    type: 'health',
  },
  {
    id: 'notification-3',
    title: 'Cook-at-home reminder',
    description: 'Bean Chili Pot ingredients are ready if you want to save more this evening.',
    timeLabel: 'Today',
    type: 'reminder',
  },
];

export const deliveryOptions: DeliveryOption[] = [
  { id: 'delivery-fast', label: 'Fast delivery', eta: '15-20 min', fee: 2.99 },
  { id: 'delivery-standard', label: 'Standard delivery', eta: '25-35 min', fee: 1.49 },
  { id: 'pickup', label: 'Pickup', eta: '10 min', fee: 0 },
];

export const paymentMethods: PaymentMethod[] = [
  { id: 'card', label: 'Card', subtitle: 'Visa ending in 4021' },
  { id: 'mobile-money', label: 'Mobile money', subtitle: 'Airtel Money' },
  { id: 'paypal', label: 'PayPal', subtitle: 'Fast checkout' },
];

export const showcaseImages = {
  discovery:
    'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
  tracker:
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
  recommendations:
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
  profile:
    'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1200&q=80',
};

export function getMealById(mealId: string, meals: MealCandidate[] = mockMealCandidates) {
  return meals.find((meal) => meal.id === mealId) ?? null;
}

export function getFavoriteMeals(meals: MealCandidate[] = mockMealCandidates) {
  return meals.filter((meal) => favoriteMealIds.includes(meal.id));
}

export function getPopularMeals(meals: MealCandidate[] = mockMealCandidates) {
  return meals.filter((meal) => meal.availability === 'order').slice(0, 5);
}

export function getCookAtHomeMeals(meals: MealCandidate[] = mockMealCandidates) {
  return meals.filter((meal) => meal.availability === 'cook');
}

export function getMealsForBrowseCategory(
  category: MealBrowseCategory,
  meals: MealCandidate[] = mockMealCandidates,
) {
  if (category === 'all') {
    return meals;
  }

  if (category === 'cook') {
    return meals.filter((meal) => meal.availability === 'cook');
  }

  return meals.filter((meal) => meal.tags.includes(category));
}
