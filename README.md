# kunalrdeshmukh.github.io

My resume website — https://kunalrdeshmukh.github.io

A single, hand-written static page (terminal theme). No framework, no build step:
just `index.html`, `sitemap.xml`, `robots.txt`, and `images/`.

## Local preview

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Pushing to `master` runs `.github/workflows/deploy.yml`, which copies the static
files into `dist/` and deploys to Cloudflare Pages via Wrangler.

## Writing section (auto-updated)

The "Writing" list is generated from my Medium feed
(`medium.com/@kunaldeshmukh27`). A daily scheduled workflow
(`.github/workflows/update-writing.yml`) runs `scripts/update-writing.mjs`, which
rewrites everything between the `MEDIUM:START` / `MEDIUM:END` markers in
`index.html`, commits any change, and redeploys. Entries listed *after* the
`MEDIUM:END` marker (e.g. the Ericsson blog post) are pinned and never touched.
Don't hand-edit between the markers. Run it on demand from the Actions tab
("Update Writing from Medium" → Run workflow).

Suggestions / contact: kunaldeshmukh27@gmail.com
