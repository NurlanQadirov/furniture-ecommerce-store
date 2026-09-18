Modern Furniture E-commerce Store
A stylish and responsive e-commerce application designed for a premium furniture brand. Built with Next.js (App Router), TypeScript and Tailwind CSS, focusing on speed, aesthetics, and user experience.

Note: This is a frontend-only application using mock data to simulate a real-world shopping experience.

🌟 Key Features
Multi-Language Support: Integrated i18next for seamless language switching (EN/AZ/RU).

Modern Tech Stack: Next.js App Router with static prerendering for every route.

Product Catalog: Interactive product listing with filtering capabilities.

Product Details: Dedicated pages for each item, prerendered at build time via generateStaticParams.

Responsive Design: Fully optimized for mobile, tablet, and desktop screens.

Hero Slider: Dynamic carousel showcasing top products.

Animations: GSAP + ScrollTrigger reveals, driven by useGSAP so they clean up across client-side navigations.

🛠️ Tech Stack
Core: Next.js (App Router) + React + TypeScript

Styling: Tailwind CSS

Routing: Next.js file-system routing

Internationalization: i18next + react-i18next

Fonts: next/font/google (Poppins, Allura, Inter), self-hosted

State Management: React Hooks (useState, useEffect)

🚀 Getting Started
Clone the repository: git clone [https://github.com/NurlanQadirov/furniture-ecommerce-store.git](https://github.com/NurlanQadirov/furniture-ecommerce-store.git)

Install dependencies:  npm install 

Run the development server:  npm run dev

Build for production:  npm run build  then  npm start 

Type-check:  npm run typecheck 

📂 Project Structure
├── app/                    # Routes (App Router)
│   ├── layout.tsx          # Root layout: fonts, i18n provider, Header/Footer
│   ├── page.tsx            # Home
│   ├── about/              # /about
│   ├── contact/            # /contact
│   ├── products/           # /products
│   ├── product/[productId] # /product/:productId
│   └── globals.css         # Tailwind entry point
├── components/             # Client components (Header, ProductCard, sections, …)
├── data/                   # Mock data for products
├── lib/
│   ├── i18n/               # i18next instance, locales (az/en/ru)
│   └── hooks/              # useSectionReveal (GSAP scroll reveals)
├── types/                  # Shared TypeScript types
├── public/                 # Images and icons
└── tailwind.config.ts      # Tailwind configuration

🌐 Live Demo
Check out the live version here: https://furniture-ecommerce-store-rosy.vercel.app/

Designed & Developed by Nurlan Qadirov
