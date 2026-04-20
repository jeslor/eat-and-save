# Eat and Save

Eat and Save is a React Native + Expo mobile app that acts as a **healthy eating assistant** and a **money-saving meal discovery app**.

The app is designed to help users:

- discover affordable meals each day
- understand why a meal is healthy
- see the current price and estimated savings
- choose whether to **order** a meal or **cook it at home**
- track nutrition through the day

## Current product direction

The app is no longer positioned as a static meal catalogue.

It is being built as a **daily recommendation system**:

1. Each morning, the app loads a **daily discovery batch**
2. Meals are sourced from a curated set of food-ordering and restaurant/provider URLs
3. Meals are normalized into a shared model with:
   - price
   - reference price
   - nutrition fields
   - source/provider context
   - order or recipe actions
4. The app ranks meals by **health value + affordability**
5. Users see the best daily picks first, along with **numeric savings**

At the moment, the current implementation uses a **local discovery phase**:

- configured provider sources exist
- a daily discovery service runs in-app
- the discovery service currently hydrates a normalized local meal set
- the UI already behaves as if it is reading a fresh daily meal batch

This keeps the product flow realistic while leaving room for a later server-side discovery phase.

## Tech stack

- **Framework:** Expo
- **Language:** TypeScript
- **Routing:** Expo Router
- **Styling:** NativeWind + Tailwind config
- **State / server state:** TanStack Query
- **Backend / auth:** Supabase
- **Typography:** Inter via Expo Fonts
- **UI helpers:** expo-linear-gradient, react-native-svg, Expo Vector Icons
- **Testing:** Jest + jest-expo

## Key features

### 1. Daily discovery batch

The app now loads a **daily discovery batch** that includes:

- discovered meals
- source/provider metadata
- freshness label
- meal count
- source count
- top savings summary

Current implementation file:

- `src/services/discovery/discoverDailyMeals.ts`

### 2. Recommendation engine

The app preserves the required **6 recommendation categories**:

- Budget
- High Protein
- High Fiber
- Low Sugar
- Best Overall
- Cook at Home

Recommendations are selected from the discovery meal batch using health and value scoring.

Core logic:

- `src/features/recommendations/selectDailyRecommendations.ts`
- `src/features/recommendations/useDailyRecommendations.ts`

### 3. Savings-first presentation

Every surfaced meal is expected to show:

- current price
- reference price
- amount saved
- percentage saved
- source/provider context

Savings helpers:

- `src/lib/recommendations/savings.ts`

### 4. Order and cook flows

Each meal has an action:

- **orderable meals** link out to provider search/order pages
- **cook-at-home meals** open recipe flows

### 5. Live Supabase auth

The app includes a working email/password auth center using Supabase.

Auth helpers:

- `src/services/supabase/auth.ts`

## App routes

### Tabs

- `/(tabs)/index` → Discover
- `/(tabs)/tracker` → Tracker
- `/(tabs)/profile` → Profile

### Stack routes

- `/auth`
- `/recommendations`
- `/meals`
- `/meals/[mealId]`
- `/search`
- `/favorites`
- `/savings`
- `/history`
- `/recipe/[mealId]`
- `/notifications`
- `/checkout`

## Main screens

### Discover

The daily home screen.

Shows:

- today’s discovery freshness
- source count and meal count
- top savings highlight
- featured meal from the current discovery batch
- category browsing
- more matches from today

### Recommendations

Shows the 6 fixed recommendation lanes built from the current daily discovery batch.

### Meals

Shows the ranked meal catalogue using discovery-driven meals instead of only static mock browsing.

### Meal Details

Shows:

- large meal image
- source/provider context
- price and reference price
- numeric savings
- quantity
- ingredients
- action buttons

### Savings

Explains not just totals, but also **how savings are calculated**.

### Tracker

Shows daily nutrition score, macro breakdown, and logged meals.

### Profile

Shows user/account information, saved meals, settings, and activity summary.

## Project structure

```text
app/
  (tabs)/
  auth/
  checkout/
  favorites/
  history/
  meals/
  notifications/
  recommendations/
  recipe/
  savings/
  search/

src/
  components/
    meal/
    providers/
    ui/
  constants/
  features/
    auth/
    checkout/
    discovery/
    favorites/
    history/
    meals/
    notifications/
    profile/
    recommendations/
    recipe/
    savings/
    search/
    tracking/
  lib/
  services/
    api/
    discovery/
    supabase/
  types/

tests/
  unit/
```

## Design system

The app follows a dark, card-based mobile UI system with:

- dark background and surface layers
- orange accent for primary actions
- green accent for health/savings highlights
- reusable meal cards
- reusable chips, section headers, and floating actions

Core reusable UI pieces include:

- `MealCard`
- `CategoryChip`
- `FloatingButton`
- `SectionHeader`
- `SearchField`
- `QuantitySelector`

## Environment variables

Create a `.env` file with the Expo public Supabase values:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If Supabase is not configured, auth-related flows will show configuration errors instead of silently failing.

## Getting started

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run start
```

Platform shortcuts:

```bash
npm run ios
npm run android
npm run web
```

## Testing

Run unit tests:

```bash
npm test
```

Type-check:

```bash
npx tsc --noEmit
```

Export web bundle:

```bash
npx expo export --platform web
```

## Current implementation status

### Completed

- Expo app bootstrap and routing
- dark design system rebuild
- reusable UI layer
- live Supabase auth
- daily discovery batch model
- discovery-driven recommendations
- consistent savings display across key screens
- search, favorites, recipe, notifications, checkout, history, and savings screens

### Current local discovery phase

The app already behaves like a daily meal discovery product, but the actual discovery source execution is still local/fallback-backed.

That means:

- provider/source configuration exists
- freshness and source context exist
- the app is discovery-driven at the UI/state level
- the current discovery service still hydrates normalized local meals instead of pulling live provider results

## Next planned improvements

1. Move discovery from local fallback-backed logic into a stronger provider adapter layer
2. Fetch or ingest real meal listings from supported restaurant/provider sources
3. Persist daily batches so recommendations are stable across sessions
4. Move morning discovery execution into a Supabase-friendly scheduled/server flow
5. Improve savings trust by standardizing comparison price sources
6. Connect tracker activity more directly to discovered/recommended meals

## Notes

- The app is designed to prioritize **healthy eating + cost savings together**
- Price, nutrition, savings, and action should remain visible anywhere meals are surfaced
- The recommendation model should continue using the 6 fixed lanes even as live discovery gets stronger

