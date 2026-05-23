# agentsbl0g

Static technical blog built with Eleventy and deployed to GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

Eleventy serves the site locally and rebuilds when files change.
Open the local URL printed by Eleventy, usually `http://localhost:8080/`.

## Production build

```bash
npm run build
```

The generated site is written to `_site/`.

## Writing posts

Create Markdown files in `src/posts/` with this front matter:

```yaml
---
layout: post.njk
title: Post title
description: Short summary for listings and feeds.
date: 2026-05-22
tags:
  - agents
  - workflow
---
```

## GitHub Pages

The workflow in `.github/workflows/pages.yml` builds the site on pushes to `main` and deploys `_site/` as the Pages artifact.

In the GitHub repository settings, set Pages source to **GitHub Actions**.

The custom domain is `blog.agentswork.de`. Configure DNS as a CNAME from `blog.agentswork.de` to `agentsw0rk.github.io`.

## Traffic insights

Blog traffic is tracked through GitHub's built-in repository traffic view. No analytics script is embedded in the site.

Open the traffic dashboard at:

```text
https://github.com/agentsw0rk/blog/graphs/traffic
```

GitHub shows recent views, unique visitors, referring sites, and popular content. The data is limited to the recent traffic window GitHub provides.

## Design direction

The initial design reference for this setup informed the Technical Console direction. The production source lives in `src/`.
