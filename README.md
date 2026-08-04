# Fake Product AI

Fake Product AI is a production-quality web application that generates AI-powered fake products using the Gemini API. It continuously learns from user feedback (upvotes/downvotes) to adjust preference weights and generate more tailored products.

The application is deployed entirely using Cloudflare's free-tier services.

## Tech Stack

* **Frontend:** Cloudflare Pages (HTML, Tailwind CSS, Vanilla JS)
* **Backend:** Cloudflare Workers (ES Modules)
* **Database:** Cloudflare D1 (SQLite)
* **AI Provider:** Google Gemini API

## Project Structure

- `/pages`: Contains the frontend static files (`index.html`, `admin.html`, `style.css`, `app.js`).
- `/worker`: Contains the Cloudflare Worker backend and D1 schema.

## Local Development

### Prerequisites

1. Install [Node.js](https://nodejs.org/).
2. Install Wrangler CLI: `npm install -g wrangler`
3. Get a Google Gemini API Key from Google AI Studio.

### Setup

1. **Database Setup**
   Run the following to initialize the local D1 database:
   ```bash
   cd worker
   npx wrangler d1 execute fake-product-db --local --file=./schema.sql
   ```

2. **Configure Secrets**
   For local development, create a `.dev.vars` file in the `/worker` directory:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   ```

3. **Start the Backend**
   ```bash
   cd worker
   npx wrangler dev
   ```

4. **Start the Frontend**
   You can serve the `/pages` directory using any local web server. For example:
   ```bash
   npx serve pages
   # or
   python3 -m http.server -d pages
   ```

## Deployment

1. **Create D1 Database**
   ```bash
   npx wrangler d1 create fake-product-db
   ```
   *Update `wrangler.jsonc` with the output `database_id`.*

2. **Apply Schema to Production**
   ```bash
   npx wrangler d1 execute fake-product-db --file=./worker/schema.sql --remote
   ```

3. **Set Production Secrets**
   ```bash
   npx wrangler secret put GEMINI_API_KEY
   ```

4. **Deploy Backend**
   ```bash
   cd worker
   npx wrangler deploy
   ```

5. **Deploy Frontend**
   ```bash
   npx wrangler pages deploy pages
   ```
