Modern Furniture Store + Admin Panel
A stylish and responsive site for a made-to-measure furniture workshop. Built with Next.js (App Router), TypeScript and Tailwind CSS, focusing on speed, aesthetics, and user experience.

The catalogue and contact details are no longer hard-coded: they live in a JSON store the owner edits from /admin, so products can change without a deploy.

🌟 Key Features
Category Catalogue: Products are grouped into categories (kitchen, living room, bedroom, wardrobe, office, kids). /products lists the categories, /products/:slug the products inside one.

Product Pages: A main photo, a thumbnail gallery of additional photos, a full description, and a WhatsApp enquiry button. Starred products surface on the home page.

Admin Panel: Email and password protected at /admin. Add, edit, delete and star products; manage categories; edit contact details.

Multi-Language Support: i18next for the interface (AZ/EN/RU), plus three-language fields on every product and category. Missing translations fall back to Azerbaijani.

Responsive Design: Fully optimized for mobile, tablet, and desktop screens.

Animations: GSAP + ScrollTrigger reveals, driven by useGSAP so they clean up across client-side navigations.

🔐 Admin access
Copy .env.example to .env.local and set the account:

  ADMIN_EMAIL=you@your-domain.az
  ADMIN_PASSWORD=your-own-password

Without them the panel falls back to admin@mebeltech.az / mebeltech2024 — fine locally, not for production. The address is compared case-insensitively. ADMIN_SECRET is optional; when unset the session cookie is signed with a key derived from the password, so changing the password signs everyone out.

The session is an HMAC-signed, httpOnly cookie valid for seven days. Both the panel pages and every /api/admin route check it.

🗄️ Where the content lives
data/store.json holds categories, products and contact details. It is created on first run from lib/store/defaults.ts and is git-ignored, because from then on the running server owns it.

Uploaded photos are written to public/uploads/ (also git-ignored). Both paths are ordinary files, so the site needs a host with a persistent disk — on an ephemeral filesystem (Vercel's default, for instance) admin edits and uploads would not survive a redeploy.

🛠️ Tech Stack
Core: Next.js (App Router) + React + TypeScript

Styling: Tailwind CSS

Internationalization: i18next + react-i18next

Fonts: next/font/google (Poppins, Allura, Inter), self-hosted

Storage: JSON file on disk, mutated through serialized read-modify-write

🚀 Getting Started
Clone the repository: git clone [https://github.com/NurlanQadirov/furniture-ecommerce-store.git](https://github.com/NurlanQadirov/furniture-ecommerce-store.git)

Install dependencies:  npm install 

Set the admin account:  cp .env.example .env.local  and edit it

Run the development server:  npm run dev

Build for production:  npm run build  then  npm start 

Type-check:  npm run typecheck 

📂 Project Structure
├── app/
│   ├── layout.tsx              # Root: fonts only, so /admin can drop the site chrome
│   ├── (site)/                 # Public site — header, footer, i18n, contact data
│   │   ├── page.tsx            # Home
│   │   ├── products/           # Categories, and /products/:slug
│   │   ├── product/[productId] # Product detail + gallery
│   │   ├── about/  contact/
│   ├── admin/
│   │   ├── login/              # Sign-in screen (outside the panel shell)
│   │   └── (panel)/            # Dashboard, products, categories, contact
│   └── api/                    # /api/admin/* (guarded)
├── components/
│   ├── admin/                  # Panel UI: managers, three-language inputs, uploads
│   ├── products/  home/        # Public catalogue and home sections
├── lib/
│   ├── store/                  # JSON store, schema, seed data, input coercion
│   ├── i18n/                   # Locales, server language resolution, localized-content helper
│   └── seo/                    # Site URL + hreflang, JSON-LD builders, metadata builder
├── proxy.ts                    # Guards /admin/*, and turns ?lang= into the render language
├── types/                      # Shared TypeScript types
├── public/uploads/             # Admin-uploaded photos
└── tailwind.config.ts

🔎 SEO and answer engines
Every public page emits a linked schema.org graph, server-rendered as plain <script type="application/ld+json"> so crawlers that do not run JavaScript still read it. Three nodes carry stable @ids and everything else points at them:

  <origin>/#organization    the brand — products reference it as brand, manufacturer and seller
  <origin>/#localbusiness   the Baku storefront: address, coordinates, service area, price range
  <origin>/#website         the site, publisher → #organization

On top of that each page adds its own: WebPage/CollectionPage/ItemPage, a BreadcrumbList, an ItemList of the categories or products it shows, and a Product + Offer on a product page. Nothing is invented — there are no opening hours, ratings or reviews, because the store holds none, and a product without a price in the panel is published without an Offer rather than with a made-up one.

🌍 One page, three languages, three URLs
The interface language is a cookie, which a crawler never sends. So the language is also addressable as ?lang=az|en|ru: proxy.ts reads the parameter, forwards it to the render as a header and mirrors it into the cookie. Azerbaijani keeps the bare URL and is x-default. Every page therefore has a self-referencing canonical plus a full hreflang cluster, and sitemap.xml lists all three variants of all three languages with the whole cluster attached to each.

Set NEXT_PUBLIC_SITE_URL before going live: canonicals, hreflang, @ids, OpenGraph images, robots.txt and sitemap.xml are all built from it.

robots.txt names the answer-engine crawlers explicitly (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended…) and allows them. An absent robots.txt already allowed everything, so this grants nothing new — it just makes the policy visible in one place. To stay in search while opting out of model training, move the training crawlers to a Disallow rule in app/robots.ts.

🌐 Live Demo
Check out the live version here: https://furniture-ecommerce-store-rosy.vercel.app/

Designed & Developed by Nurlan Qadirov
