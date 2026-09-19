Modern Furniture Store + Admin Panel
A stylish and responsive site for a made-to-measure furniture workshop. Built with Next.js (App Router), TypeScript and Tailwind CSS, focusing on speed, aesthetics, and user experience.

The catalogue, contact details and calculator tariffs are no longer hard-coded: they live in a JSON store the owner edits from /admin, so prices and products can change without a deploy.

🌟 Key Features
Category Catalogue: Products are grouped into categories (kitchen, living room, bedroom, wardrobe, office, kids). /products lists the categories, /products/:slug the products inside one.

Product Pages: A main photo, a thumbnail gallery of additional photos, a full description, and a WhatsApp enquiry button. Starred products surface on the home page.

Furniture Calculator: A five-step estimator at /calculator. It never quotes an exact figure — it returns a price band and then asks for a phone number so the workshop can measure on site.

Admin Panel: Password-protected at /admin. Add, edit, delete and star products; manage categories; edit contact details; change every calculator tariff; read the measurement requests the calculator captured.

Multi-Language Support: i18next for the interface (AZ/EN/RU), plus three-language fields on every product and category. Missing translations fall back to Azerbaijani.

Responsive Design: Fully optimized for mobile, tablet, and desktop screens.

Animations: GSAP + ScrollTrigger reveals, driven by useGSAP so they clean up across client-side navigations.

🧮 How the calculator prices work
Kitchens are quoted by the running metre, the way they are sold in Baku:

  lower units  = metres × material's lower rate
  upper units  = metres × material's upper rate
  worktop      = metres × worktop rate
  hardware     = (the three above) × tier multiplier   (economy 1.0 / standard 1.15 / premium 1.35)
  accessories  = cargo, lift-ups, LED, corner pull-outs — fixed prices × quantity
  + installation + delivery
  → shown as a ±rangePercent band, rounded

Wardrobes, bedroom units and TV walls are quoted by facade area (width × height in m²), with multipliers for door type and depth and a per-m² charge for mirror or glass inserts. Beds and chests are quoted per model.

Every rate, multiplier and fee above is editable at /admin/calculator.

🔐 Admin access
Copy .env.example to .env.local and set a password:

  ADMIN_PASSWORD=your-own-password

Without it the panel falls back to mebeltech2024 — fine locally, not for production. ADMIN_SECRET is optional; when unset the session cookie is signed with a key derived from the password, so changing the password signs everyone out.

The session is an HMAC-signed, httpOnly cookie valid for seven days. Both the panel pages and every /api/admin route check it.

🗄️ Where the content lives
data/store.json holds categories, products, contact details, calculator tariffs and captured leads. It is created on first run from lib/store/defaults.ts and is git-ignored, because from then on the running server owns it.

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

Set the admin password:  cp .env.example .env.local  and edit it

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
│   │   ├── calculator/         # The estimator
│   │   ├── about/  contact/
│   ├── admin/
│   │   ├── login/              # Password screen (outside the panel shell)
│   │   └── (panel)/            # Dashboard, products, categories, calculator, contact, leads
│   └── api/                    # /api/leads (public) and /api/admin/* (guarded)
├── components/
│   ├── admin/                  # Panel UI: managers, three-language inputs, uploads
│   ├── calculator/             # Wizard, option cards, lead form
│   ├── products/  home/        # Public catalogue and home sections
├── lib/
│   ├── store/                  # JSON store, schema, seed data, input coercion
│   ├── calc/estimate.ts        # The pricing engine (pure, shared)
│   ├── i18n/                   # i18next instance, locales, localized-content helper
│   └── hooks/                  # useSectionReveal (GSAP scroll reveals)
├── proxy.ts                    # Guards /admin/*
├── types/                      # Shared TypeScript types
├── public/uploads/             # Admin-uploaded photos
└── tailwind.config.ts

🌐 Live Demo
Check out the live version here: https://furniture-ecommerce-store-rosy.vercel.app/

Designed & Developed by Nurlan Qadirov
