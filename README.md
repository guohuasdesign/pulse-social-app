# Pulse Social App

Pulse is a small social feed app built with Next.js, MongoDB, Mongoose, JWT auth, and Tailwind CSS. Users can register, log in, post tweets, like, dislike, bookmark, repost, comment, delete their own content, and use ElevenLabs speech-to-text to write tweets or comments by voice.

## Features

- User registration, login, logout, and protected pages
- JWT authentication stored in an httpOnly cookie
- Password reset flow with optional Resend email delivery
- Create and delete tweets
- Like, dislike, bookmark, and repost Pulse tweets
- Dedicated bookmarks page
- Tweet detail pages with full comment threads
- Inline comments directly under tweets on the home feed
- Users can delete their own comments
- Voice-to-text for tweets and comments using ElevenLabs Speech to Text
- Like and dislike sound effects
- Responsive sidebar that becomes bottom navigation on small screens
- Warm glass-style UI built with Tailwind CSS and CSS variables

## Tech Stack

- Next.js 16 App Router
- React 19
- MongoDB with Mongoose
- JWT with `jsonwebtoken`
- Password hashing with `bcryptjs`
- Tailwind CSS v4
- ElevenLabs Speech to Text API
- Optional Resend email API for password reset emails

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=pulse-social-app
JWT_SECRET=your_long_random_secret

ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Optional: password reset emails.
# If RESEND_API_KEY is missing, reset links are printed in the server console.
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM="Pulse <onboarding@resend.dev>"
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run build
```

Builds the production app. The project uses `next build --webpack` because the default Turbopack production build can hang in the current local setup.

```bash
npm run start
```

Starts the production server after a successful build.

## Project Structure

```text
app/
  api/
    auth/                 Auth, logout, register, password reset
    speech-to-text/       ElevenLabs speech-to-text proxy
    tweets/               Tweet, reaction, and comment APIs
  bookmarks/              Saved tweets page
  home/                   Main feed
  tweet/[id]/             Tweet detail page
  login/                  Login page
  register/               Register page
  forgot-password/        Password reset request page
  reset-password/         Password reset form page

components/
  CommentForm.js          Full comment form for tweet detail pages
  TweetCard.js            Feed card with reactions, reposts, comments
  TweetForm.js            Tweet creation form with voice input
  VoiceTranscribeButton.js Shared voice recording/transcription button
  Sidebar.js              Responsive navigation
  Header.js               Top navigation

lib/
  auth.js                 JWT helpers
  comments.js             Comment data helpers
  tweets.js               Tweet data helpers
  db/database.js          MongoDB connection helper
  email.js                Password reset email helper

models/
  User.js
  Tweet.js
  Comment.js
  PasswordResetToken.js
```

## API Overview

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

Tweets:

- `GET /api/tweets`
- `POST /api/tweets`
- `GET /api/tweets/:id`
- `PATCH /api/tweets/:id`
- `DELETE /api/tweets/:id`

Comments:

- `GET /api/tweets/:id/comments`
- `POST /api/tweets/:id/comments`
- `DELETE /api/tweets/:id/comments/:commentId`

Speech to text:

- `POST /api/speech-to-text`

## Voice Input

Voice input is handled in the browser with `MediaRecorder`. The recorded audio is sent to the server route `/api/speech-to-text`, which forwards the file to ElevenLabs:

```text
POST https://api.elevenlabs.io/v1/speech-to-text
model_id=scribe_v2
```

The ElevenLabs API key is only used server-side and should never be exposed to the browser.

## Notes

- Reactions, bookmarks, reposts, and comments only apply to Pulse tweets stored in MongoDB.
- External demo tweets from DummyJSON are shown in the feed but do not support interactions.
- Password reset emails require `RESEND_API_KEY`; without it, the reset link is logged in the server console.
- Microphone access requires browser permission and usually works best on `localhost` or HTTPS.
