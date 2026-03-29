import type { MealAction } from '@/types/recommendation';

type MealDbSearchResponse = {
  meals: Array<{
    idMeal: string;
    strMeal: string;
    strSource: string | null;
    strYoutube: string | null;
  }> | null;
};

export async function fetchRecipeAction(query: string): Promise<MealAction> {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      throw new Error('Recipe service is unavailable right now.');
    }

    const data = (await response.json()) as MealDbSearchResponse;
    const recipe = data.meals?.[0];

    if (!recipe) {
      throw new Error(`No recipe result was found for ${query}.`);
    }

    return {
      kind: 'recipe',
      label: 'Cook it yourself',
      provider: 'TheMealDB',
      url: recipe.strSource || recipe.strYoutube || `https://www.themealdb.com/meal/${recipe.idMeal}`,
      source: 'api',
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`We could not load a live recipe for ${query}. ${error.message}`);
    }

    throw new Error(`We could not load a live recipe for ${query}.`);
  }
}
