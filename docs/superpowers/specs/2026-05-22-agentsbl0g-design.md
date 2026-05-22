# agentsbl0g Design

## Goal

Build `agentsbl0g` as a static technical blog for GitHub Pages. Source content lives as Markdown in the repository and Eleventy turns it into HTML, CSS, JavaScript, feeds, and index pages during an automated GitHub Actions deployment.

The existing `index.html` is a visual reference only. The implementation should borrow its dark technical-console direction, dense-but-readable layout, cyan/green accent language, mono details, sticky navigation, and polished responsive behavior without treating the file as production source.

## Audience And Tone

The blog is for technical writing: project notes, agent/tooling experiments, development logs, and concise engineering posts. The visual tone is dark, precise, technical, and readable. It should feel like documentation and a workbench rather than a marketing site.

The public brand is `agentsbl0g`.

## Architecture

Use Eleventy as the static-site generator.

- Markdown posts live in `src/posts/`.
- Global pages live in `src/`, for example `index.njk`, `about.md`, and `archive.njk`.
- Layouts and partials live in `src/_includes/`.
- Site data lives in `src/_data/`.
- CSS and small browser JavaScript live in `src/assets/`.
- Eleventy writes the generated site to `_site/`.
- GitHub Actions installs dependencies, runs the Eleventy build, and publishes `_site/` to GitHub Pages.

The project should stay simple: no bundler unless later requirements need one.

## Pages And Content

Initial site structure:

- Home page with a featured/latest post, recent posts, topic chips, and a short identity block for `agentsbl0g`.
- Post detail pages generated from Markdown front matter.
- Archive page listing all posts by date.
- Tag pages generated from post tags.
- About page explaining the blog in a concise technical voice.
- RSS feed and sitemap for discovery.

Start with three sample posts using different dates and tags so the home, archive, feed, and tag views are visible immediately.

Post front matter should include:

- `title`
- `description`
- `date`
- `tags`
- optional `featured`

## Visual Design

Direction: Technical Console.

Core traits:

- Dark background with subtle grid or technical texture.
- Cyan and green accents, with amber used sparingly for metadata or status details.
- Distinct typography pairing similar to the reference: readable sans text and mono UI details.
- Sticky header with brand, navigation, and GitHub link area.
- Strong reading layout for posts: narrow content column, clear headings, code block styling, metadata, and tag chips.
- Home page should show the blog identity immediately and reveal recent content in the first viewport.
- Responsive layout must remain usable on mobile without overlapping text or oversized decorative elements.

Cards may be used for repeated post previews. Avoid nested cards and keep border radii restrained.

## Behavior

JavaScript should be small and progressive. Initial behavior can include:

- Active navigation state.
- Copy-to-clipboard buttons for code blocks if simple to implement cleanly.
- Optional reduced-motion-friendly reveal effects.

The site must remain readable and navigable without JavaScript.

## GitHub Pages Deployment

Use GitHub Actions to publish automatically when changes land on `main`.

Expected workflow:

1. Checkout repository.
2. Setup Node.js.
3. Install dependencies with `npm ci`.
4. Run the production build.
5. Upload `_site/` as a Pages artifact.
6. Deploy to GitHub Pages.

Include npm scripts for local development and production builds.

## Testing And Verification

Verification should include:

- `npm run build`
- Eleventy output inspection for home, posts, archive, tags, feed, and sitemap.
- Basic responsive browser check on desktop and mobile widths.
- GitHub Actions YAML syntax and Pages output path review.

No automated test suite is required for the first version unless implementation complexity grows.

## Out Of Scope

- CMS integration.
- Comments.
- Search.
- Authentication.
- Analytics.
- Heavy client-side app framework.
- Custom admin UI for writing posts.
