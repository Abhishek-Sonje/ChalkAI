# Local setup

## Requirements

- Node.js 20.9+ and npm.
- Clerk publishable and secret keys.
- A Gemini API key with access to `gemini-2.5-flash-image`.

## Install and configure

From the repository root:

```bash
cd frontend
npm install
```

Create `.env.local` in this directory:

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

Start the app:

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000), sign in and open the board. Connect a Gemini key through the board's key settings.

The backend accepts `GOOGLE_GENERATIVE_AI_API_KEY` as a fallback, but the current board still asks users to connect a key. The image model is defined in [the API route](app/api/complete-diagram/route.ts); setting `GEMINI_MODEL` does not change it.

## Verify manually

1. Draw a few shapes and enter a description.
2. Generate a suggestion and inspect the preview.
3. Press `Tab` to accept it.
4. Generate another suggestion and press `Esc` to dismiss it.

## Troubleshooting

- **Sign-in fails:** check the Clerk keys and application settings, then restart the dev server.
- **No image is returned:** check the Gemini key's model access and quota, then inspect the server error.
- **Voice input is unavailable:** use a browser with speech recognition support, allow microphone access, or use typed input.
- **Production build fails on Windows:** the build script uses Unix `cp` commands; run it in WSL or a compatible shell.
- **Canvas export fails:** try a small sketch and inspect the browser console.

Connected keys are stored in browser local storage and sent to the application server. Prompts and exported sketches are sent to Gemini.

For architecture, API details and development commands, see [the project README](../README.md).
