# Bigest Mall PWA

This branch (pwa-staging) contains a Progressive Web App front-end for the Bigest Mall site. It is a mobile-first PWA with a client-side product catalog and search.

Local testing

1. Clone the repo and checkout the branch:
   ```bash
   git clone https://github.com/habibullahshahin19970-png/Bigest-Mall.git
   cd Bigest-Mall
   git fetch origin
   git checkout pwa-staging
   ```

2. Start a local static server from the repository root. Example using Python:
   ```bash
   python -m http.server 8000
   # or with node http-server
   # npx http-server -c-1
   ```

3. Open http://localhost:8000/ in your mobile browser or desktop to test. The app will register a service worker and cache assets for offline use.

How to update products

- Replace `products/products.json` with your real product objects. Each product should contain: id, name, price, currency, category, image (path), description.

Deploy

- Merge `pwa-staging` into your default branch (e.g., main) and ensure GitHub Pages is configured to serve from the branch/folder you prefer.

Notes

- Icons are SVG placeholders; replace `assets/icons/icon-192.svg` and `icon-512.svg` with proper PNG icons if you want maximum compatibility.
- For larger catalogs or server-side search, consider adding a small backend or Algolia/Firebase for indexing.
