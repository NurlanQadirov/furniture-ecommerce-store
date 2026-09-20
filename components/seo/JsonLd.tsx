import type { JsonLdNode } from '@/lib/seo/jsonld';

/**
 * Serialises a graph into a `<script type="application/ld+json">`.
 *
 * Deliberately a plain `<script>` rather than `next/script`. In the App Router
 * `next/script` hands even `beforeInteractive` inline content to its own client
 * runtime (`self.__next_s.push(...)`), so the block is written by JavaScript
 * after load and is simply absent from the served HTML. Google would still see
 * it; GPTBot, PerplexityBot, ClaudeBot and Bing's crawler largely would not —
 * and those are precisely the readers this markup exists for. React renders the
 * tag below into the server HTML verbatim, which is also what Next's own
 * metadata documentation recommends for JSON-LD.
 */

/**
 * Product names and descriptions come from the admin panel, so the payload is
 * escaped rather than trusted: a `</script>` typed into a description would
 * otherwise close this element and run whatever followed it. The two Unicode
 * separators are legal inside a JSON string and are line terminators to a
 * JavaScript parser, so they go the same way.
 */
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

const ESCAPES: Record<string, string> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
  [LINE_SEPARATOR]: '\\u2028',
  [PARAGRAPH_SEPARATOR]: '\\u2029',
};

const UNSAFE = new RegExp(`[<>&${LINE_SEPARATOR}${PARAGRAPH_SEPARATOR}]`, 'g');

function serialize(data: JsonLdNode): string {
  return JSON.stringify(data).replace(UNSAFE, (character) => ESCAPES[character] ?? character);
}

interface JsonLdProps {
  /** Stable per page, so two graphs on one page never collide. */
  id: string;
  data: JsonLdNode;
}

export default function JsonLd({ id, data }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}
