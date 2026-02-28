import { defineConfig, defineCollection, s } from "velite";

// Editorial gate — 4 questions. At least one must be true.
// If ALL are false, the build FAILS (editorial rule enforcement).
// Ref: docs/content/CONTENT_GOVERNANCE.md + AI_EXECUTION_SHEET.md
function editorialGate(meta: {
  clarifiesDecision: boolean;
  preventsMistake: boolean;
  revealsCost: boolean;
  explainsTradoff: boolean;
}) {
  const passes =
    meta.clarifiesDecision ||
    meta.preventsMistake ||
    meta.revealsCost ||
    meta.explainsTradoff;

  if (!passes) {
    throw new Error(
      `[Editorial Gate FAIL] This content does not clarify a decision, prevent a mistake, reveal a cost, or explain a trade-off. It cannot be published. See docs/content/CONTENT_GOVERNANCE.md.`
    );
  }
  return true;
}

// Article collection — the core content type
const articles = defineCollection({
  name: "Article",
  pattern: "articles/**/*.mdx",
  schema: s.object({
    // Required metadata
    title: s.string().min(10).max(100),
    slug: s.path(),
    description: s.string().min(50).max(300),
    publishedAt: s.isodate(),
    updatedAt: s.isodate().optional(),

    // MDX compiled body — rendered via useMDXComponent in article pages
    code: s.mdx(),

    // Topic taxonomy
    topic: s.enum([
      "platform",
      "operations",
      "marketing",
      "finance",
      "technology",
      "team",
      "strategy",
      "logistics",
      "customer",
    ]),
    topicLabel: s.string(), // Human-readable label for the badge

    // Content quality
    readingTime: s.number().min(1).max(60), // minutes

    // Editorial gate — at least one must be true (build fails if all false)
    clarifiesDecision: s.boolean().default(false),
    preventsMistake: s.boolean().default(false),
    revealsCost: s.boolean().default(false),
    explainsTradoff: s.boolean().default(false),

    // Optional content flags
    affiliateLinks: s.boolean().default(false),
    featured: s.boolean().default(false),
    draft: s.boolean().default(false),

    // SEO
    canonicalUrl: s.string().url().optional(),
  }).transform((data) => {
    // Editorial gate enforcement at build time
    editorialGate({
      clarifiesDecision: data.clarifiesDecision,
      preventsMistake: data.preventsMistake,
      revealsCost: data.revealsCost,
      explainsTradoff: data.explainsTradoff,
    });
    // s.path() returns the file path relative to the content root, e.g.
    // "articles/my-article". Strip the collection folder prefix so the
    // slug is just "my-article" — matching the /articles/[slug] route.
    const slug = data.slug.split("/").pop() ?? data.slug;
    return {
      ...data,
      slug,
      url: `/articles/${slug}`,
      isNew:
        new Date(data.publishedAt) >
        new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days
    };
  }),
});

// Product collection — digital products (Phase 3)
const products = defineCollection({
  name: "Product",
  pattern: "products/**/*.mdx",
  schema: s.object({
    title: s.string(),
    slug: s.path(),
    description: s.string().max(300),
    price: s.number().min(0),
    priceLabel: s.string(), // e.g. "$97 one-time"
    lemonSqueezyProductId: s.string(),
    lemonSqueezyVariantId: s.string(),
    draft: s.boolean().default(false),
    featured: s.boolean().default(false),
    features: s.array(s.string()),
    targetAudience: s.string(),
  }).transform((data) => {
    const slug = data.slug.split("/").pop() ?? data.slug;
    return {
      ...data,
      slug,
      url: `/products/${slug}`,
    };
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:8].[ext]",
    clean: true,
  },
  collections: { articles, products },
  mdx: {
    // Syntax highlighting, math, etc. can be added here
    rehypePlugins: [],
    remarkPlugins: [],
  },
});
