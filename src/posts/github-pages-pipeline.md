---
layout: post.njk
title: GitHub Pages als statischer Deploy-Pfad
description: Ein schlanker Ablauf für Markdown-Quellen, Eleventy-Build und Pages-Deployment.
date: 2026-05-21
tags:
  - github-pages
  - eleventy
---

GitHub Pages eignet sich gut für Blogs, die ohne Serverlogik auskommen. Der Build läuft in Actions, das Ergebnis ist ein statisches Artefakt.

```bash
npm run build
```

Der wichtige Vertrag ist einfach: Eleventy schreibt nach `_site/`, GitHub Pages veröffentlicht genau diesen Ordner.
