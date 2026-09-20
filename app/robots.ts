import type { MetadataRoute } from 'next';
import { SITE_URL, absoluteUrl } from '@/lib/seo/site';

/**
 * Nothing here is a grant the default was not already making — an absent
 * robots.txt allows every crawler — but naming the answer engines makes the
 * policy explicit and reviewable. To keep the site out of model training while
 * staying in search, remove `GPTBot`, `ClaudeBot`, `Google-Extended` and
 * `Applebot-Extended` from the list below and disallow them instead; the
 * search and retrieval agents (`OAI-SearchBot`, `ChatGPT-User`,
 * `PerplexityBot`, `Claude-SearchBot`) are what feed the answers themselves.
 */
const answerEngines = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'meta-externalagent',
  'Bytespider',
  'CCBot',
  'cohere-ai',
];

/** The panel, its API and the login screen are never worth a crawl. */
const disallow = ['/admin', '/api/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      { userAgent: answerEngines, allow: '/', disallow },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    // Yandex — which matters in this market — reads `Host` as a bare hostname,
    // not as a URL.
    host: new URL(SITE_URL).host,
  };
}
