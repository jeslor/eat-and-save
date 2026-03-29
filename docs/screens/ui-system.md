# Eat and Save — UI System & Design Instructions

## Purpose

This document defines the UI system, design rules, and screen structures for the Eat and Save mobile app.

It ensures consistent, modern, and production-quality UI generation when using AI tools like GitHub Copilot.

---

# 1. Design Philosophy

- Use a **card-based layout**
- Prioritize **clarity, speed, and actionability**
- Always show:
  - Price
  - Nutrition (calories/macros)
  - Value (savings)

Design style:

- Soft minimal
- Rounded surfaces
- Floating elements
- Clean spacing

---

# 2. Color System

## Base (Dark Theme)

- Background: `#0F0F14`
- Surface: `#1A1A22`
- Elevated Surface: `#22222C`

## Primary Colors

- Primary Accent: `#FF8A00`
- Gradient: `#FF8A00 → #FFB347`
- Secondary Accent (Health): `#4CAF50`

## Text Colors

- Primary: `#FFFFFF`
- Secondary: `#A1A1AA`
- Muted: `#6B7280`

## Semantic Colors

- Success: `#22C55E`
- Warning: `#F59E0B`
- Danger: `#EF4444`

---

# 3. Typography

- Font: Inter
- Headings: Bold
- Body: Regular
- Use clear hierarchy:
  - Title
  - Subtitle
  - Metadata

---

# 4. Core Components

## 4.1 MealCard

Variants:

- featured
- compact
- list

Structure:

- Image (top or floating)
- Title
- Calories
- Price
- Rating
- CTA button

Rules:

- Rounded corners (16–24)
- Use shadows for elevation
- Highlight featured cards with gradient

---

## 4.2 CategoryChip

- Rounded-full
- Horizontal scroll

States:

- Active → filled (primary color)
- Inactive → outlined

---

## 4.3 FloatingButton

- Circular
- Primary color background
- Used for:
  - Add meal
  - Track meal
  - Checkout

---

## 4.4 SectionHeader

- Title (left)
- Optional "See all" (right)

---

# 5. Screen Specifications

---

## 5.1 Discover Screen

Layout:

- Header (greeting + avatar)
- Search bar
- Category chips (horizontal)
- Featured meal card
- Popular meals (horizontal list)
- Bottom tab navigation

Rules:

- Use vertical scroll
- Use horizontal FlatLists for categories and meals

---

## 5.2 Meal Details Screen

Layout:

- Back button + favorite icon
- Large food image (centered)
- Title + calories
- Rating + prep time
- Quantity selector
- Ingredients (horizontal icons)
- Description
- Sticky bottom CTA (Add / Track)

Rules:

- Image must be the visual focus
- CTA must always be visible

---

## 5.3 Tracker Screen

Layout:

- Daily Nutrition Score (top card)
- Macro breakdown:
  - Protein
  - Fiber
  - Sugar

- Logged meals list
- Add meal button

Rules:

- Use progress indicators (bars or rings)
- Emphasize health insights

---

## 5.4 Recommendations Screen

Sections:

- Budget
- High Protein
- High Fiber
- Low Sugar
- Best Overall
- Cook at Home

Each section:

- Horizontal scroll list of MealCards

---

## 5.5 Checkout Screen

Layout:

- Delivery options
- Payment methods:
  - Card
  - Mobile money
  - PayPal

- Order summary
- Confirm button

---

## 5.6 Profile Screen

Includes:

- User info
- Saved meals
- Settings
- Activity summary

---

# 6. Additional Screens (Required)

## Search Screen

- Results list/grid
- Filters:
  - Price
  - Calories
  - Diet

## Favorites Screen

- Saved meals
- Quick actions

## Savings Insights Screen

- Money saved
- Weekly/monthly stats

## Meal History Screen

- Past meals
- Nutrition tracking

## Recipe Screen

- Ingredients
- Steps
- Nutrition info

## Notifications Screen

- Alerts
- Recommendations

---

# 7. UX Rules

- Every meal must show:
  - Price
  - Nutrition
  - Action button

- Max 2 taps to complete key actions

- Avoid deep navigation

- Always prioritize:
  - Value
  - Health
  - Speed

---

# 8. Component & Code Rules

- Use reusable components:
  - MealCard
  - CategoryChip
  - FloatingButton
  - SectionHeader

- Use:
  - FlatList for lists
  - ScrollView only when necessary

- Add subtle animations:
  - Press scale (0.97)
  - Fade-in

---

# 9. AI Agent Instructions

When generating UI:

- Follow this document strictly
- Do not introduce new patterns unless necessary
- Reuse existing components first
- Maintain consistent spacing and styling
- Ensure all screens are mobile-first

---

# 10. Definition of Done (UI)

A screen is complete when:

- It follows the color system
- Uses defined components
- Displays required data (price, nutrition, actions)
- Is responsive
- Matches the design philosophy

---
