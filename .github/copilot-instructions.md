# Project: Eat and Save (Mobile App)

## Vision

Develop a mobile application that helps users find the cheapest healthy meals available daily, tracks their nutritional intake, and provides personalized daily recommendations.

The app must prioritize:

- **Affordability**
- **Health value**
- **Fast decision-making**

---

# Tech Stack & Architecture

- **Framework:** React Native with Expo (Managed Workflow)
- **Language:** TypeScript
- **Routing:** Expo Router
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Database/Backend:** Supabase (Auth, Database, and Edge Functions)
- **State Management:** TanStack Query (React Query) for server state
- **Typography:** Inter via Expo Fonts
- **Visual UI:** expo-linear-gradient, react-native-svg, Expo vector icons

---

# UI System (STRICT — MUST FOLLOW)

## Design Style

- Modern, minimal, card-based UI
- Soft rounded corners (16–28 radius)
- Floating elements with subtle shadows
- Clean spacing and strong hierarchy
- Image-first layout for meals

---

## Color System (Dark Mode)

### Base

- Background: `#0F0F14`
- Surface: `#1A1A22`
- Elevated Surface: `#22222C`

### Primary

- Accent: `#FF8A00`
- Gradient: `#FF8A00 → #FFB347`
- Health Accent: `#4CAF50`

### Text

- Primary: `#FFFFFF`
- Secondary: `#A1A1AA`
- Muted: `#6B7280`

### Semantic

- Success: `#22C55E`
- Warning: `#F59E0B`
- Danger: `#EF4444`

⚠️ Do NOT introduce new colors unless necessary.

---

## Core UI Components (REUSE REQUIRED)

### MealCard (MANDATORY)

Used everywhere meals are displayed.

Structure:

- Food image (top or floating)
- Title
- Calories
- Price
- Rating
- CTA (view/add/track)

Variants:

- `featured` (large, gradient background)
- `compact` (horizontal scroll)
- `list` (vertical minimal)

---

### CategoryChip

- Rounded-full
- Horizontal scroll
- Active = filled accent color
- Inactive = outlined/dim

---

### FloatingButton

- Circular
- Primary accent color
- Used for key actions only

---

### SectionHeader

- Title (left)
- Optional "See all" (right)

---

## Layout Rules

- Use **FlatList** for all lists
- Avoid heavy nesting
- Prefer vertical scroll + horizontal sections
- Avoid clutter

---

## Interaction Rules

- Add press animation (scale: 0.97)
- Use subtle shadows for elevation
- Keep transitions fast and responsive

---

# Current Product Baseline

- **Tabs:** Discover, Tracker, Profile
- **Extra routes:** Auth center, Meals, Recommendations

## Auth

- Supabase email/password auth is live

## Recommendations

- Must include exactly 6 types:
  - Budget
  - High Protein
  - High Fiber
  - Low Sugar
  - Best Overall
  - Cook at Home

## Actions

Every meal MUST have an action:

- Orderable meals:
  - Show price
  - External provider link

- Cook-at-home meals:
  - Recipe action
  - Fallback links

---

## Metrics (MANDATORY)

Always display when available:

- Daily Nutrition Score
- Meal pricing
- Estimated savings vs market

---

# Screen Specifications (STRICT)

## Discover Screen

- Header (greeting + avatar)
- Search bar
- Category chips (horizontal)
- Featured MealCard
- Popular meals (horizontal list)
- Bottom tabs

---

## Meal Details Screen

- Large hero food image (centerpiece)
- Title + calories
- Rating + prep time
- Quantity selector
- Ingredients (horizontal)
- Description
- Sticky bottom CTA

---

## Tracker Screen

- Daily Nutrition Score (top card)
- Macro breakdown (protein, fiber, sugar)
- Logged meals list
- Add meal button

---

## Recommendations Screen

- 6 sections (fixed categories)
- Horizontal scroll per section

---

## Profile Screen

- User info
- Saved meals
- Settings
- Activity summary

---

## Additional Screens (SHOULD EXIST)

- Search Results
- Favorites
- Savings Insights (money saved tracking)
- Meal History
- Recipe Screen
- Notifications

---

# Core Feature Rules

1. **Meal Discovery**
   - Optimize for value-to-health ratio
   - Healthy = high protein/fiber, low sugar

2. **Health Tracking**
   - Daily Nutrition Score required

3. **Recommendations**
   - Must use existing 6-category model

4. **Data Privacy**
   - Never log PII in plain text

---

# Development Standards

- Functional components with hooks only
- PascalCase for components
- camelCase for variables/functions

## Error Handling

- Every API call MUST use try/catch
- Show user-friendly errors

## Testing

- Prioritize Jest tests for recommendation logic

---

## Navigation

- Use existing navigation patterns
- Avoid creating duplicate flows
- Ensure key actions are reachable in ≤2 taps

---

## UI Quality Rules (CRITICAL)

- Always show:
  - Price
  - Nutrition
  - Action

- Do NOT:
  - Create new UI patterns unnecessarily
  - Mix inconsistent styles
  - Overcrowd screens

- Always:
  - Reuse components
  - Maintain spacing consistency
  - Keep UI mobile-first

---

# Copilot Agent Behavior

When generating code:

- Follow this document STRICTLY
- Reuse existing components before creating new ones
- Check Supabase schema before adding new data logic
- Extend existing flows instead of duplicating

If UI is requested:

- Use MealCard pattern
- Apply color system exactly
- Follow screen layouts defined above

If a dependency is required:

- Suggest the exact install command (e.g., `npx expo install ...`)

---

# Definition of Done

A feature is complete when:

- UI follows the design system
- Required data is visible (price, nutrition, action)
- Code follows architecture rules
- No duplicate patterns introduced
- Works across mobile screen sizes

---
