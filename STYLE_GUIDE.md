# InfluencerOS Style Guide

This comprehensive document outlines the complete design system, color palette, typography, spacing, components, accessibility standards, and development conventions for the InfluencerOS application. This guide ensures consistent, professional, and accessible user experiences across all platforms.

## Table of Contents
1. [Color System](#1-color-system)
2. [Typography Scale](#2-typography-scale)
3. [Spacing System](#3-spacing-system)
4. [Component Guidelines](#4-component-guidelines)
5. [Accessibility Standards](#5-accessibility-standards)
6. [Responsive Design](#6-responsive-design)
7. [Development Standards](#7-development-standards)
8. [Brand Voice & Tone](#8-brand-voice--tone)

---

## 1. Color System

The InfluencerOS color system is built on CSS custom properties for easy theming and supports multiple accent color variations. The system includes both dark and light themes with full semantic color roles.

### 1.1 Theme Support

The design system supports both dark and light themes using the `class` strategy in Tailwind CSS:

```css
/* Dark theme (default) */
:root { /* Dark theme variables */ }

/* Light theme */
html:not(.dark) { /* Light theme variables */ }
```

### 1.2 Dark Theme (Default)

#### Primary Colors
| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-bg` | `#111111` | Main application background |
| `--color-surface` | `#1C1C1C` | Card and component backgrounds |
| `--color-border` | `#2D2D2D` | Borders and dividers |
| `--color-primary` | `#8B5CF6` | Primary actions, highlights |
| `--color-secondary` | `#A3A3A3` | Secondary text, icons |
| `--color-accent` | `#7C3AED` | Hover states for primary actions |

#### Semantic Colors
| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-text-primary` | `#E5E5E5` | Primary text, headings |
| `--color-text-secondary` | `#A3A3A3` | Secondary/muted text |
| `--color-insight` | `#38BDF8` | AI insights, highlights |
| `--color-success` | `#10B981` | Success states, positive changes |
| `--color-warning` | `#F59E0B` | Warnings, attention items |
| `--color-error` | `#EF4444` | Error states, destructive actions |
| `--color-glow` | `rgba(139, 92, 246, 0.3)` | Glow effects for shadows |

### 1.3 Light Theme

#### Primary Colors
| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-bg` | `#F9FAFB` | Main application background |
| `--color-surface` | `#FFFFFF` | Card and component backgrounds |
| `--color-border` | `#E5E7EB` | Borders and dividers |
| `--color-primary` | `#7C3AED` | Primary actions, highlights |
| `--color-secondary` | `#6B7280` | Secondary text, icons |
| `--color-accent` | `#6D28D9` | Hover states for primary actions |

#### Semantic Colors
| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-text-primary` | `#1F2937` | Primary text, headings |
| `--color-text-secondary` | `#6B7280` | Secondary/muted text |
| `--color-insight` | `#0EA5E9` | AI insights, highlights |
| `--color-success` | `#059669` | Success states, positive changes |
| `--color-warning` | `#D97706` | Warnings, attention items |
| `--color-error` | `#DC2626` | Error states, destructive actions |

### 1.4 Accent Color Variations

The system supports multiple accent colors that can be applied using data attributes:

```css
/* Purple (Default) */
:root[data-accent="purple"] { --color-primary: #8B5CF6; --color-accent: #7C3AED; }

/* Blue */
:root[data-accent="blue"] { --color-primary: #3B82F6; --color-accent: #2563EB; }

/* Green */
:root[data-accent="green"] { --color-primary: #10B981; --color-accent: #059669; }

/* Amber */
:root[data-accent="amber"] { --color-primary: #F59E0B; --color-accent: #D97706; }

/* Red */
:root[data-accent="red"] { --color-primary: #EF4444; --color-accent: #DC2626; }

/* Orange */
:root[data-accent="orange"] { --color-primary: #F97316; --color-accent: #EA580C; }

/* Pink */
:root[data-accent="pink"] { --color-primary: #EC4899; --color-accent: #DB2777; }
```

### 1.5 Color Contrast Compliance

All color combinations meet WCAG 2.1 AA standards:
- **Normal Text**: 4.5:1 contrast ratio minimum
- **Large Text**: 3:1 contrast ratio minimum
- **Interactive Elements**: 3:1 contrast ratio minimum

**Testing Tools**: Use browser dev tools, WebAIM Contrast Checker, or Lighthouse audits to verify compliance.

---

## 2. Typography Scale

The InfluencerOS typography system uses Inter font family with a consistent scale that adapts responsively across all screen sizes.

### 2.1 Font Family

```css
:root {
 --font-inter: 'Inter', sans-serif;
}
```

- **Primary Font**: Inter (Google Fonts)
- **Fallback**: system-ui, sans-serif
- **Weights Available**: 300, 400, 500, 600, 700

### 2.2 Typography Hierarchy

| Scale | Size (rem) | Line Height | Font Weight | Usage |
|-------|------------|-------------|-------------|-------|
| `text-4xl` | 2.25rem (36px) | 1.1 | 700 | Main page headings |
| `text-3xl` | 1.875rem (30px) | 1.2 | 700 | Section headings |
| `text-2xl` | 1.5rem (24px) | 1.3 | 600 | Subsection headings |
| `text-xl` | 1.25rem (20px) | 1.4 | 600 | Card titles, modal headers |
| `text-lg` | 1.125rem (18px) | 1.5 | 500 | Body large, buttons |
| `text-base` | 1rem (16px) | 1.6 | 400 | Body text, paragraphs |
| `text-sm` | 0.875rem (14px) | 1.5 | 400 | Secondary text, captions |
| `text-xs` | 0.75rem (12px) | 1.4 | 400 | Small labels, metadata |

### 2.3 Responsive Typography

Typography scales responsively across breakpoints:

```css
/* Mobile First Approach */
.text-responsive-lg {
 @apply text-sm md:text-lg;
}

.text-responsive-xl {
 @apply text-base md:text-xl;
}

.text-responsive-2xl {
 @apply text-lg md:text-2xl;
}
```

### 2.4 Content-Specific Usage

#### Headings
- Use semantic heading tags (h1-h6) for proper document structure
- Apply consistent sizing classes based on hierarchy level
- Maintain proper heading structure for SEO and accessibility

#### Body Text
- Use `text-base` for primary content
- Use `text-sm` for secondary information
- Maintain line length between 50-75 characters for readability

#### Interactive Text
- Buttons: `text-base` or `text-lg` with appropriate weight
- Links: `text-primary` with hover states
- Form labels: `text-sm` with proper contrast

---

## 3. Spacing System

InfluencerOS uses a consistent 4px base unit system for all spacing to ensure visual harmony and maintainable code.

### 3.1 Base Unit Scale

| Scale | Pixels | Rem | Usage |
|-------|--------|-----|-------|
| `space-1` | 4px | 0.25rem | Smallest spacing unit |
| `space-2` | 8px | 0.5rem | Compact spacing |
| `space-3` | 12px | 0.75rem | Component internal spacing |
| `space-4` | 16px | 1rem | Default component spacing |
| `space-5` | 20px | 1.25rem | Section spacing |
| `space-6` | 24px | 1.5rem | Card spacing |
| `space-8` | 32px | 2rem | Large section spacing |
| `space-10` | 40px | 2.5rem | Major layout divisions |
| `space-12` | 48px | 3rem | Page-level spacing |
| `space-16` | 64px | 4rem | Maximum content spacing |

### 3.2 Common Spacing Patterns

```css
/* Component Spacing */
.component-padding { @apply p-4 md:p-6; }
.component-margin { @apply m-4 md:m-6; }

/* Section Spacing */
.section-spacing { @apply py-8 md:py-12; }
.content-spacing { @apply space-y-6; }

/* Layout Spacing */
.container-padding { @apply px-4 md:px-8; }
.grid-gap { @apply gap-4 md:gap-6; }
```

### 3.3 Responsive Spacing

Spacing adapts responsively to provide optimal experiences across devices:

```css
/* Mobile-first responsive spacing */
.responsive-spacing {
 @apply space-y-4 md:space-y-6 lg:space-y-8;
}

.responsive-padding {
  @apply p-4 md:p-6 lg:p-8;
}

---

## 4. Component Guidelines

This section defines styling rules and interaction patterns for all major UI components in the InfluencerOS design system.

### 4.1 Button Components

#### Primary Buttons
**Usage**: Main call-to-action buttons, form submissions, primary actions.

```css
/* Base Styles */
.btn-primary {
  @apply bg-brand-primary text-white font-medium px-6 py-3 rounded-lg;
  @apply transition-all duration-300 ease-in-out;
  @apply hover:bg-brand-accent hover:scale-105;
  @apply focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100;
}

/* Variants */
.btn-primary--small { @apply px-4 py-2 text-sm; }
.btn-primary--large { @apply px-8 py-4 text-lg; }
.btn-primary--loading { @apply cursor-wait; }
```

**HTML Usage**:
```html
<button class="btn-primary">Primary Action</button>
<button class="btn-primary btn-primary--small">Small Button</button>
<button class="btn-primary btn-primary--loading" disabled>
  <span class="animate-spin mr-2">⟳</span> Loading...
</button>
```

#### Secondary Buttons
**Usage**: Secondary actions, alternative options, cancel buttons.

```css
.btn-secondary {
  @apply bg-brand-surface border border-brand-border text-brand-text-primary;
  @apply font-medium px-6 py-3 rounded-lg transition-all duration-300;
  @apply hover:bg-brand-border hover:border-brand-primary;
  @apply focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2;
}
```

#### Ghost Buttons
**Usage**: Minimal emphasis actions, toolbar buttons.

```css
.btn-ghost {
  @apply bg-transparent text-brand-text-secondary font-medium px-4 py-2 rounded-lg;
  @apply hover:bg-brand-surface hover:text-brand-text-primary;
  @apply focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2;
}
```

### 4.2 Form Components

#### Input Fields
```css
.form-input {
  @apply bg-brand-surface border border-brand-border text-brand-text-primary;
  @apply rounded-lg px-4 py-3 w-full transition-all duration-300;
  @apply placeholder-brand-text-secondary;
  @apply focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent;
  @apply hover:border-brand-primary/50;
  @apply disabled:bg-brand-border disabled:cursor-not-allowed;
}

.form-input--error {
  @apply border-red-500 focus:ring-red-500;
}
```

#### Labels
```css
.form-label {
  @apply block text-sm font-medium text-brand-text-primary mb-2;
}

.form-label--required::after {
  content: ' *';
  @apply text-red-500;
}
```

#### Form Groups
```css
.form-group {
  @apply space-y-2 mb-6;
}

.form-group--horizontal {
  @apply flex items-center space-x-4 space-y-0;
}
```

### 4.3 Card Components

#### Base Card
```css
.card {
  @apply bg-brand-surface border border-brand-border rounded-xl p-6;
  @apply transition-all duration-300;
  @apply hover:shadow-lg hover:border-brand-primary/30;
}

.card--elevated {
  @apply shadow-lg border-brand-primary/20;
}

.card--interactive {
  @apply cursor-pointer hover:scale-[1.02] active:scale-[0.98];
}
```

#### Card with Futuristic Border
```css
.card--futuristic {
  @apply futuristic-border relative;
}
```

### 4.4 Navigation Components

#### Sidebar Navigation
```css
.nav-sidebar {
  @apply bg-brand-surface border-r border-brand-border w-64 h-full;
  @apply flex flex-col;
}

.nav-item {
  @apply flex items-center px-4 py-3 text-brand-text-secondary;
  @apply hover:bg-brand-border hover:text-brand-text-primary;
  @apply transition-all duration-200;
}

.nav-item--active {
  @apply bg-brand-primary text-white futuristic-border;
}
```

#### Breadcrumb Navigation
```css
.breadcrumb {
  @apply flex items-center space-x-2 text-sm text-brand-text-secondary;
}

.breadcrumb__item {
  @apply hover:text-brand-text-primary transition-colors;
}

.breadcrumb__separator {
  @apply text-brand-border;
}
```

### 4.5 Modal Components

#### Modal Overlay
```css
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-60 z-50;
  @apply flex items-center justify-center p-4;
  @apply animate-modal-fade-in;
}
```

#### Modal Content
```css
.modal-content {
  @apply bg-brand-surface rounded-xl border border-brand-border;
  @apply max-w-md w-full max-h-[90vh] overflow-y-auto;
  @apply animate-modal-slide-down;
  @apply futuristic-border;
}
```

### 4.6 Component States

#### Hover States
- **Subtle**: `opacity-80` or `bg-brand-border`
- **Interactive**: `scale-105` for buttons, `shadow-lg` for cards
- **Color**: Use `brand-primary` variants for emphasis

#### Focus States
- **Ring**: `focus:ring-2 focus:ring-brand-primary focus:ring-offset-2`
- **Border**: `focus:border-brand-primary`
- **Transform**: Avoid scale transforms on focus for accessibility

#### Active States
- **Pressed**: `scale-95` or `translate-y-0.5`
- **Selected**: Full opacity background colors
- **Visual feedback**: Immediate response to user interaction

#### Disabled States
- **Opacity**: `opacity-50` or `opacity-30`
- **Cursor**: `cursor-not-allowed`
- **Interaction**: Prevent all hover effects and interactions

---

## 5. Accessibility Standards

InfluencerOS is built to meet WCAG 2.1 AA compliance standards across all components and interactions.

### 5.1 Color Contrast Requirements

All color combinations must meet minimum contrast ratios:

| Element Type | Minimum Ratio | Verification |
|--------------|---------------|--------------|
| Normal Text | 4.5:1 | Dev tools, WebAIM checker |
| Large Text (18px+ or 14px+ bold) | 3:1 | Automated testing |
| Interactive Elements | 3:1 | Manual verification |
| Icons with text | 4.5:1 | Component testing |

**Testing Command**:
```bash
# Using axe-core for automated testing
npm install -g @axe-core/cli
axe-core http://localhost:3000
```

### 5.2 Focus Management

#### Keyboard Navigation
- **Tab Order**: Logical tab sequence through all interactive elements
- **Focus Indicators**: Visible focus rings on all focusable elements
- **Skip Links**: Allow keyboard users to skip to main content

#### Focus Ring Implementation
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-brand-primary;
  @apply focus:ring-offset-2 focus:ring-offset-brand-bg;
}
```

#### Skip Links
```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4">
  Skip to main content
</a>
```

### 5.3 Screen Reader Support

#### ARIA Labels
```html
<!-- Buttons -->
<button aria-label="Create new campaign" class="btn-primary">
  <Icon name="plus" aria-hidden="true" />
</button>

<!-- Status messages -->
<div role="status" aria-live="polite" class="sr-only">
  Campaign created successfully
</div>
```

#### Semantic HTML
- Use proper heading hierarchy (h1-h6)
- Use semantic landmarks (`<nav>`, `<main>`, `<aside>`)
- Use form labels and fieldsets appropriately

### 5.4 Motion and Animation

#### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### Animation Guidelines
- **Duration**: Keep animations under 500ms for UI feedback
- **Purpose**: Ensure animations serve a functional purpose
- **Optional**: Allow users to disable non-essential animations

---

## 6. Responsive Design

InfluencerOS uses a mobile-first approach with consistent breakpoints across all components.

### 6.1 Breakpoint Definitions

| Breakpoint | Size | Usage |
|------------|------|-------|
| `xs` | 320px+ | Small mobile devices |
| `sm` | 640px+ | Large mobile devices |
| `md` | 768px+ | Tablets |
| `lg` | 1024px+ | Small desktops |
| `xl` | 1280px+ | Large desktops |
| `2xl` | 1536px+ | Extra large screens |

### 6.2 Mobile-First Principles

#### CSS Structure
```css
/* Mobile styles (base) */
.component { @apply flex flex-col space-y-4; }

/* Tablet and up */
@media (min-width: 768px) {
  .component { @apply flex-row space-y-0 space-x-6; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component { @apply space-x-8; }
}
```

#### Responsive Patterns
- **Navigation**: Collapsible mobile menu, expanded desktop sidebar
- **Cards**: Single column mobile, grid layout desktop
- **Typography**: Smaller mobile text, larger desktop text
- **Spacing**: Tighter mobile spacing, more generous desktop spacing

### 6.3 Responsive Utilities

#### Container Queries (Modern Approach)
```css
@container (min-width: 400px) {
  .card { @apply flex-row; }
}
```

#### Responsive Grid
```css
.grid-responsive {
  @apply grid grid-cols-1 gap-4;
  @apply md:grid-cols-2 lg:grid-cols-3;
}
```

---

## 7. Development Standards

This section defines coding conventions and best practices for maintaining the design system.

### 7.1 CSS Naming Conventions (BEM)

Follow Block Element Modifier methodology for consistent, maintainable CSS:

```css
/* Block */
.card { }

/* Element */
.card__header { }
.card__body { }
.card__footer { }

/* Modifier */
.card--elevated { }
.card--interactive { }
.card__header--compact { }
```

#### BEM Guidelines
- **Blocks**: Standalone components (`.card`, `.button`, `.modal`)
- **Elements**: Parts of blocks (`.card__title`, `.modal__content`)
- **Modifiers**: Variations of blocks/elements (`.button--primary`, `.card--large`)

### 7.2 File Organization

```
src/
├── styles/
│   ├── globals.css          # Global styles, CSS variables
│   ├── components/          # Component-specific styles
│   │   ├── buttons.css
│   │   ├── forms.css
│   │   ├── cards.css
│   │   └── navigation.css
│   └── utilities/           # Utility classes
│       ├── animations.css
│       ├── spacing.css
│       └── typography.css
```

### 7.3 CSS Formatting Standards

#### General Rules
- Use 2 spaces for indentation
- Place one selector per line in multi-selector rules
- Include one space before opening brace in rule declarations
- Place closing braces on new line
- Add meaningful comments for complex selectors

```css
/* Good */
.selector-1,
.selector-2 {
  property: value;
  /* Related properties grouped together */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Avoid */
.selector {property:value;display:flex;}
```

### 7.4 React Component Naming

#### File Naming
- Use PascalCase for component files: `Card.tsx`, `ButtonGroup.tsx`
- Use camelCase for utility files: `useStyles.ts`, `constants.ts`

#### Component Structure
```tsx
// ComponentName.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  variant = 'primary',
  size = 'md',
  children,
}) => {
  return (
    <div
      className={cn(
        'component-name',
        `component-name--${variant}`,
        `component-name--${size}`
      )}
    >
      {children}
    </div>
  );
};
```

### 7.5 Import Organization

#### CSS Imports
```css
/* 1. External libraries */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* 2. Global variables and mixins */
@import './globals/variables.css';
@import './globals/mixins.css';

/* 3. Component styles */
@import './components/buttons.css';
@import './components/forms.css';

/* 4. Utility classes */
@import './utilities/animations.css';
```

---

## 8. Brand Voice & Tone

InfluencerOS maintains a professional, innovative, and trustworthy brand voice that emphasizes our AI-driven technology platform while building confidence with users.

### 8.1 Brand Personality

#### Core Characteristics
- **Professional**: Demonstrate expertise and reliability in influencer marketing technology
- **Innovative**: Highlight cutting-edge AI capabilities and forward-thinking solutions
- **Trustworthy**: Build confidence through transparency, security, and proven results

#### Voice Attributes
- **Expert**: Use industry terminology appropriately, demonstrate deep knowledge
- **Clear**: Communicate complex features in accessible, jargon-free language
- **Confident**: Express certainty about platform capabilities without overpromising

### 8.2 Tone Variations

#### Technical Documentation (Current)
- **Formal but approachable**: Professional tone with clear explanations
- **Precise**: Use accurate technical terminology
- **Educational**: Explain concepts while respecting user intelligence

#### Marketing Copy
- **Benefit-focused**: Emphasize outcomes and value proposition
- **Confident**: Use assertive language about platform capabilities
- **User-centric**: Focus on how features solve real problems

#### Error Messages
- **Helpful**: Provide clear guidance for resolution
- **Empathetic**: Acknowledge user frustration
- **Actionable**: Include specific steps to resolve issues

### 8.3 Content Style Principles

#### Writing Guidelines
- **Active voice**: "The platform generates insights" vs "Insights are generated"
- **Present tense**: "Users access real-time data" vs "Users will access"
- **Concise**: Eliminate unnecessary words while maintaining clarity
- **Consistent terminology**: Use established terms consistently

#### Key Messages
- **AI-Powered**: Emphasize intelligent automation and insights
- **Real-Time**: Highlight live data and immediate results
- **Scalable**: Communicate ability to grow with business needs
- **Integrated**: Showcase seamless platform connections

#### Prohibited Language
- Avoid hype: "revolutionary", "game-changing", "paradigm-shifting"
- Skip jargon: "synergistic", "bleeding-edge", "disruptive"
- Eliminate ambiguity: Be specific about features and benefits

### 8.4 Messaging Examples

#### Feature Descriptions
**Good**: "AI-powered insights help you identify top-performing influencer partnerships"
**Avoid**: "Revolutionary AI technology disrupts influencer marketing"

#### Error Messages
**Good**: "Unable to load campaign data. Please check your connection and try again."
**Avoid**: "Something went wrong. This feature isn't working right now."

#### Call-to-Action Buttons
**Good**: "Create Campaign", "View Analytics", "Export Report"
**Avoid**: "Let's Go!", "Click Here!", "Do It Now!"

---

## 9. Implementation Guide

### 9.1 Getting Started

1. **Theme Setup**: Include CSS custom properties in your root stylesheet
2. **Typography**: Import Inter font and configure Tailwind typography scale
3. **Components**: Use defined component classes or build custom components
4. **Responsive**: Apply mobile-first responsive classes consistently

### 9.2 Testing Checklist

- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible and consistent
- [ ] Screen reader compatibility verified
- [ ] Responsive design works across all breakpoints
- [ ] Animations respect reduced motion preferences

### 9.3 Maintenance

- Review and update color combinations when adding new themes
- Test accessibility with each component update
- Update this guide when introducing new patterns or conventions
- Regular audits ensure continued compliance with standards

---

*This style guide is a living document. Update it regularly to reflect new components, patterns, and standards as the InfluencerOS platform evolves.*
```