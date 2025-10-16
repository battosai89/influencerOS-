# Migration Guide: From React to Next.js

This guide provides a step-by-step process for migrating the current single-page React application to a modern Next.js 14+ application using the App Router. The goal is to preserve all existing functionality, styling, and UI.

---

### Step 1: Set Up the New Next.js Project

First, create a new Next.js project in a separate directory. This ensures you have a clean working environment.

```bash
npx create-next-app@latest influencer-os-nextjs
```

During the setup prompts, choose the following options:
- **Would you like to use TypeScript?** Yes
- **Would you like to use ESLint?** Yes
- **Would you like to use Tailwind CSS?** Yes
- **Would you like to use `src/` directory?** Yes
- **Would you like to use App Router?** Yes
- **Would you like to customize the default import alias?** No (or configure as you wish)

---

### Step 2: Migrate Files and Folders

Copy your existing source files from the current project into the new Next.js project's `src/` directory.

1.  **Copy Directories:** Copy the following folders from your old project into the `src/` directory of your new Next.js project:
    - `components/`
    - `data/`
    - `hooks/`
    - `services/`
2.  **Copy `types.ts`:** Copy your `types.ts` file into `src/`.
3.  **Handle `pages/`:** Rename your existing `pages/` directory to something else, like `views/`, and copy it into `src/`. This avoids conflicts with Next.js's routing system. We will manually convert these files into Next.js routes in a later step.

Your new `src/` directory should look something like this:
```
src/
├── app/              # Next.js routes
├── components/
├── data/
├── hooks/
├── services/
├── views/            # Your old 'pages' folder
└── types.ts
```

---

### Step 3: Configure Global Styles & Fonts

Next.js handles global styles and fonts differently than your `index.html`.

1.  **Copy CSS Variables:** Open your old `index.html` file. Copy the entire contents of the `<style>` block (from `:root { ... }` to `*:focus-visible { ... }`).
2.  **Paste into `globals.css`:** Open `src/app/globals.css` in your new project. Delete the existing content and paste the CSS you just copied *after* the initial `@tailwind` directives.

    ```css
    /* src/app/globals.css */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    /* Paste all your CSS variables and custom styles here */
    :root {
      --color-bg: #111111;
      /* ...and so on... */
    }
    ```

3.  **Configure Tailwind CSS:** Open `tailwind.config.ts`. Copy the `theme.extend` object from the script in your old `index.html` into this file.

    ```ts
    // tailwind.config.ts
    import type { Config } from 'tailwindcss'

    const config: Config = {
      content: [
        './src/views/**/*.{js,ts,jsx,tsx,mdx}', // Point to your old pages
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      darkMode: 'class', // Add this line
      theme: {
        extend: {
          // Paste the entire 'extend' object here
          fontFamily: {
            sans: ['var(--font-inter)', 'sans-serif'], // We will set up the font variable next
            display: ['var(--font-inter)', 'sans-serif'],
          },
          colors: {
            'brand-bg': 'var(--color-bg)',
            // ... all your custom colors
          },
          // ... all your custom animations, keyframes, etc.
        },
      },
      plugins: [],
    }
    export default config
    ```
---

### Step 4: Create the Root Layout

The `src/app/layout.tsx` file replaces your `index.html` and `App.tsx` shell. It defines the global structure for your entire application.

1.  **Set up Font:** Use `next/font/google` to optimize the Inter font loading.
2.  **Add Theme Script:** The "theme flash" prevention script from `index.html` must be placed in the layout using `next/script`.
3.  **Replicate App Structure:** Import and add your `<Sidebar />` and other global components.

Here is what your `src/app/layout.tsx` should look like:

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header' // Note: Header will be moved to page layouts
import CommandBar from '@/components/CommandBar' // Will need to be managed by a client component
import Search from '@/components/Search' // Will need to be managed by a client component
import InfluencerOSAssistantCard from '@/components/AgencyOSAssistantCard'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Create a CSS variable for the font
})

export const metadata: Metadata = {
  title: 'InfluencerOS',
  description: 'The AI-powered OS for Modern Influencer Agencies.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" data-accent="purple">
      <head>
        {/* The theme-flash prevention script */}
        <Script id="theme-switcher" strategy="beforeInteractive">
          {`
            try {
              const prefsJSON = localStorage.getItem('InfluencerOS_user_prefs');
              if (prefsJSON) {
                  const prefs = JSON.parse(prefsJSON);
                  if (prefs.theme === 'light') {
                      document.documentElement.classList.remove('dark');
                  }
                  if (prefs.accentColor) {
                      document.documentElement.setAttribute('data-accent', prefs.accentColor);
                  }
              }
            } catch (e) {}
          `}
        </Script>
      </head>
      <body className={`${inter.variable} font-sans bg-brand-bg`}>
        {/* 
          Because the App Router uses server components by default,
          stateful components like Sidebar, CommandBar, etc., need to be managed
          in a client component wrapper.
        */}
        <div className="bg-brand-bg text-brand-text-secondary min-h-screen">
            <Sidebar />
            <main className="ml-72">
                <div className="p-8">
                    {children} {/* This is where your page content will be rendered */}
                </div>
            </main>
            {/* 
              Global components like CommandBar, Search, and Assistant
              will need a state management solution that works with Next.js,
              like Zustand with a Provider.
            */}
        </div>
        <div id="modal-root"></div>
      </body>
    </html>
  )
}
```
**Note:** The global components like `Header`, `CommandBar` and `Search` which were in `App.tsx` now need a new home. The `Header` should be moved into each `page.tsx` or a shared `template.tsx` file. Global stateful components like `CommandBar` require a client-side provider at the root of your application to manage their state.

### Step 5: Convert React Router Pages to Next.js Routes

Next.js uses a file-system-based router. You will create folders inside `src/app/` to define your routes.

**Example 1: Dashboard Page**
1.  Create the file `src/app/dashboard/page.tsx`.
2.  Copy the content from `src/views/Dashboard.tsx` into this new file.
3.  Add **`"use client";`** at the very top of the file, because the Dashboard uses React hooks (`useState`, `useEffect`, etc.).
4.  Remove `react-router-dom` imports and replace `<Link>` with `<Link>` from `next/link`.

```tsx
// src/app/dashboard/page.tsx
"use client"; // Required for hooks

import React from 'react';
import useStore from '@/hooks/useStore';
// ... other imports ...

// The rest of your Dashboard component code...
const Dashboard: React.FC = () => {
    // ...
}

export default Dashboard;
```

**Example 2: Dynamic Influencer Page**
1.  Create the file `src/app/influencers/[influencerId]/page.tsx`. The `[influencerId]` folder is a dynamic segment.
2.  Copy the content from `src/views/InfluencerDetail.tsx`.
3.  Add **`"use client";`** at the top.
4.  Replace `useParams` from `react-router-dom` with `useParams` from `next/navigation`.

```tsx
// src/app/influencers/[influencerId]/page.tsx
"use client";

import React from 'react';
import { useParams } from 'next/navigation'; // <-- Change this import
import useStore from '@/hooks/useStore';
// ... other imports ...

const InfluencerDetail: React.FC = () => {
    const params = useParams(); // <-- Usage is slightly different
    const influencerId = params.influencerId as string;
    // ... rest of your component logic
}

export default InfluencerDetail;
```

**Root Page and Redirects**
- Your old app redirected from `/` to `/dashboard`. Create a `src/app/page.tsx` file and use the `redirect` function from `next/navigation`.

```tsx
// src/app/page.tsx
import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/dashboard')
}
```

### Step 6: Final Cleanup

1.  **Update Imports:** Go through all your components and replace `react-router-dom`'s `<Link>` and `<NavLink>` with `<Link>` from `next/link`. The `isActive` prop logic from `NavLink` will need to be replaced with `usePathname` from `next/navigation`.
2.  **Remove Old Files:** Delete `index.html` and `index.tsx` from your project root.
3.  **Uninstall Dependencies:** Remove `react-router-dom` from your `package.json`:
    ```bash
    npm uninstall react-router-dom
    ```
4.  **Client Components:** Add `"use client";` to the top of any component that uses React Hooks (`useState`, `useEffect`, etc.) or browser-specific APIs. This includes `Sidebar`, `Header`, `CommandBar`, and most of your page-level components.

This guide covers the main steps for the migration. The most significant changes are the routing system and the distinction between Server and Client Components in the App Router.
