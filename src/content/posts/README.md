# Blog Authoring Guide

Every blog post is a Markdown file inside this folder.

## Quick Start

1. Create a new file in `src/content/posts/`, for example `my-new-post.md`.
2. Paste the frontmatter template below.
3. Write your article in Markdown under the frontmatter.
4. Add a cover image under `public/images/blog/` and reference it as `/images/blog/your-image.jpg`.
5. Start the app and open `/blog` to confirm the post appears.

## Frontmatter Template

```md
---
title: Your Post Title
excerpt: One line summary shown on cards and in SEO description.
dateISO: 2026-03-17
category: Frontend
coverImage: /images/blog/your-image.jpg
# Optional override if you do not want to use the filename-based slug:
# slug: custom-url-slug
---

Write your post content here.
```

## What Is Automatic Now

- `slug`: generated from the file name by default.
- `readTime`: calculated from your Markdown content.
- `layout`: assigned automatically by the blog layout cycle.
- `date`: auto-formatted from `dateISO` — no need to write it manually.

## Required Fields

- `title`
- `excerpt`
- `dateISO` (format: `YYYY-MM-DD`)
- `coverImage`

## Markdown Support

The blog renderer supports a broad set of Markdown features:

- Standard Markdown headings, lists, links, images, blockquotes, and code blocks
- GitHub Flavored Markdown (tables, task lists, strikethrough, autolinks)
- Footnotes
- Soft line breaks
- LaTeX math via `$...$` and `$$...$$`
- Raw HTML embedded in Markdown
- Syntax-highlighted fenced code blocks
- Auto-linked heading anchors

## Recommended Writing Workflow

1. Start with an `h1` in frontmatter (`title`) and use `h2`/`h3` in the body.
2. Keep the excerpt to around 120-170 characters.
3. Use short sections and meaningful subheadings for scanability.
4. Add alt text to images for accessibility and SEO.
5. Use internal links where useful (for example to `/projects` or other posts).

## Date Rules

- `dateISO` is required and must be in `YYYY-MM-DD` format.
- The human-readable date shown on post cards and headers is auto-formatted from `dateISO`.
- Posts are sorted by `dateISO` descending (newest first).

## Troubleshooting

- Post not showing up: check that frontmatter starts and ends with `---`.
- Build fails with missing field: verify required frontmatter keys.
- Wrong URL slug: rename the file or add explicit `slug` in frontmatter.
- Wrong publish order: set explicit `dateISO`.
