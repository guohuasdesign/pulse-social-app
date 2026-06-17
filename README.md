# Pulse Social App

A simple social feed app built with Next.js and MongoDB using mongoose.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## File Structure

```text
app/
├── about/
│   └── page.jsx
├── api/
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.js
│   │   ├── logout/
│   │   │   └── route.js
│   │   └── register/
│   │       └── route.js
│   └── tweets/
│       ├── [id]/
│       │   └── route.js
│       └── route.js
├── tweet/
│   └── [id]/
│       └── page.js
├── globals.css
├── layout.js
└── page.js

components/
├── Header.js
├── Sidebar.js
├── TweetCard.js
└── TweetForm.js

lib/
├── db/
│   └── database.js
├── models/
│   └── Tweet.js
└── tweets.js
```
