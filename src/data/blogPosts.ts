export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateISO: string;
  readTime: string;
  category: string;
  coverImage: string;
  layout: "standard" | "wide" | "tall";
  content: string;
}

type BlogLayout = "standard" | "wide" | "tall";

const WORDS_PER_MINUTE = 220;

const postFiles = import.meta.glob("../content/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default"
}) as Record<string, string>;

function parseFrontmatter(markdown: string): { meta: Record<string, string>; body: string } {
  const normalized = markdown.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    throw new Error("Markdown post is missing frontmatter.");
  }

  const frontmatterEnd = normalized.indexOf("\n---\n", 4);
  if (frontmatterEnd === -1) {
    throw new Error("Markdown post frontmatter is malformed.");
  }

  const frontmatter = normalized.slice(4, frontmatterEnd);
  const body = normalized.slice(frontmatterEnd + 5).trim();
  const meta: Record<string, string> = {};

  frontmatter.split("\n").forEach((line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      return;
    }
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['\"]|['\"]$/g, "");
    if (key) {
      meta[key] = value;
    }
  });

  return { meta, body };
}

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeISODate(input?: string): string | null {
  if (!input) {
    return null;
  }

  const value = input.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
}

function formatReadableDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map((part) => Number(part));
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(utcDate);
}

function calculateReadTime(markdown: string): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = text ? text.split(" ").length : 0;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

function parseBlogPost(filePath: string, rawMarkdown: string): Omit<BlogPost, "id" | "layout"> {
  const { meta, body } = parseFrontmatter(rawMarkdown);

  const title = meta.title?.trim();
  const excerpt = meta.excerpt?.trim();
  const coverImage = meta.coverImage?.trim();

  if (!title || !excerpt || !coverImage) {
    throw new Error("Missing required frontmatter field. Required: title, excerpt, coverImage.");
  }

  const fileName = filePath.split("/").pop() ?? "";
  const slugBase = meta.slug?.trim() || fileName || title;
  const slug = createSlug(slugBase);

  if (!slug) {
    throw new Error(`Unable to derive slug for post file: ${filePath}`);
  }

  const dateISO = normalizeISODate(meta.dateISO);
  if (!dateISO) {
    throw new Error(`Missing required frontmatter field dateISO (YYYY-MM-DD) in post: ${filePath}`);
  }

  return {
    slug,
    title,
    excerpt,
    date: formatReadableDate(dateISO),
    dateISO,
    readTime: calculateReadTime(body),
    category: meta.category?.trim() || "General",
    coverImage,
    content: body
  };
}

const parsedPosts = Object.entries(postFiles)
  .filter(([path, rawPost]) => {
    const fileName = path.split("/").pop() ?? "";
    const isHelperFile = fileName.startsWith("_") || fileName.toLowerCase() === "readme.md";
    return !isHelperFile && rawPost.trimStart().startsWith("---");
  })
  .map(([path, rawPost]) => parseBlogPost(path, rawPost));

const LAYOUT_CYCLE: BlogLayout[] = ["tall", "standard", "standard"];

export const blogPosts: BlogPost[] = parsedPosts
  .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
  .map((post, index) => ({
    ...post,
    id: index + 1,
    // Latest post is always wide; the rest cycle through the remaining layouts automatically
    layout: index === 0 ? "wide" : LAYOUT_CYCLE[(index - 1) % LAYOUT_CYCLE.length]
  }));

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find((post) => post.slug === slug);
};