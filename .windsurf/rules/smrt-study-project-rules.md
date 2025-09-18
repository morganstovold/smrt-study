---
trigger: always_on
---

# SmrtStudy Project Rules

## Project Identity

- App name: **SmrtStudy** (abbreviated spelling)
- Tagline: "Study smarter, not harder"
- Purpose: AI-powered study platform with adaptive learning, multi-source content processing, and intelligent question generation

<tech_stack>

- Frontend: Next.js 15+ App Router, TypeScript, Tailwind CSS
- Backend: Convex (database, functions, real-time, file storage)
- Authentication: Better-Auth (convex component)
- Billing: Autumn (convex component)
- Email: Resend (convex component)
- AI: OpenAI GPT models for content processing and question generation
- Content: Firecrawl for web scraping and content extraction
- Storage: Cloudflare R2 for large files (PDFs, videos, audio)
- Icons: Lucide React only
- Transcription: AssemblyAI for audio lecture transcription (future feature)
  </tech_stack>

<design_system>

- Primary: `#3B82F6` (Blue 500) - trust, intelligence, focus
- Secondary: `#8B5CF6` (Violet 500) - AI, innovation, creativity
- Accent: `#10B981` (Emerald 500) - success, progress, achievements
- Background: `#F8FAFC` (Slate 50) - clean, minimal
- Text: `#1E293B` (Slate 800) - high readability
- Muted: `#64748B` (Slate 500) - secondary text
- Error: `#EF4444` (Red 500)
- Warning: `#F59E0B` (Amber 500)
- Border radius: 8px for friendliness
- Use generous whitespace for reduced cognitive load
- Subtle blue-violet gradients for AI elements
- Focus-driven design to minimize distractions
  </design_system>

<pricing_strategy>

- Free: 25 AI questions, 5 responses, 2 study sets, 3 file uploads
- Pro ($14.99): 200 questions, 100 responses, 15 study sets, 25 files, web scraping
- Premium ($24.99): 750 questions, 300 responses, unlimited sets, 100 files, priority support
- Audio Plus (+$9.99): 200 minutes recording/month with transcription
- Target gross margins: 75-85%
- Usage-based cost controls and monitoring
  </pricing_strategy>

<file_organization>

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── study-sets/
│   │   │   ├── page.tsx
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── edit/page.tsx
│   │   │       └── study/page.tsx
│   │   ├── study/[sessionId]/page.tsx
│   │   ├── progress/page.tsx
│   │   ├── billing/page.tsx
│   │   └── settings/page.tsx
│   ├── (public)/
│   │   ├── explore/page.tsx
│   │   ├── subjects/page.tsx
│   │   └── community/page.tsx
│   └── api/
│       ├── webhooks/
│       └── upload/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── progress.tsx
│   └── features/        # Feature-specific components
│       ├── study/
│       │   ├── question-card.tsx
│       │   ├── study-session.tsx
│       │   ├── flashcard.tsx
│       │   └── quiz-interface.tsx
│       ├── content/
│       │   ├── file-upload.tsx
│       │   ├── url-scraper.tsx
│       │   └── content-processor.tsx
│       ├── analytics/
│       │   ├── progress-chart.tsx
│       │   └── performance-stats.tsx
│       ├── auth/
│       │   ├── login-form.tsx
│       │   └── signup-form.tsx
│       └── billing/
│           ├── subscription-card.tsx
│           └── usage-meter.tsx
└── lib/
    ├── convex.ts        # Convex client
    ├── utils.ts
    ├── constants.ts
    └── types.ts

convex/
├── schema.ts           # Database schema
├── auth.ts            # Authentication logic
├── billing.ts         # Subscription management
├── users.ts           # User management
├── study/
│   ├── sets.ts        # Study set management
│   ├── sessions.ts    # Study sessions
│   ├── questions.ts   # Question generation and management
│   ├── progress.ts    # Learning analytics
│   └── ai.ts          # AI content processing
├── content/
│   ├── files.ts       # File upload and processing
│   ├── scraping.ts    # Web scraping with Firecrawl
│   └── processing.ts  # Content analysis and extraction
├── notifications.ts   # Email notifications with Resend
└── http.ts           # HTTP endpoints for webhooks
```

</file_organization>

<naming_conventions>

- Files: kebab-case (`study-sessions.ts`, `question-card.tsx`)
- Functions: camelCase (`createStudySession`, `generateQuestions`)
- Components: PascalCase (`StudyDashboard`, `QuestionCard`)
- Database tables: camelCase (`studySets`, `studySessions`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`, `AI_QUESTION_COST`)
- Types/Interfaces: PascalCase (`StudySet`, `QuestionType`)
  </naming_conventions>

<component_patterns>

- Use Server Components by default for layouts and static content
- Add `"use client"` only for state management and interactivity
- Wrap data fetching in Suspense boundaries with loading states
- Use Lucide icons consistently throughout the app
- Follow Tailwind utility-first approach with custom component variants
- Create reusable UI components in `components/ui/`
- Feature components in `components/features/` for specific functionality
- Handle loading, error, and empty states gracefully
- Show progress indicators for AI processing and file uploads
  </component_patterns>

<ai_integration_patterns>

- Store all AI responses in Convex for persistence and caching
- Use actions for external AI API calls (OpenAI, Firecrawl)
- Implement cost tracking for all AI operations
- Handle AI errors gracefully with fallback responses
- Show real-time loading states during AI processing
- Cache AI results to avoid regeneration costs
- Implement usage limits based on subscription tier
- Use progressive question generation to manage costs
- Batch AI requests when possible to reduce API calls
  </ai_integration_patterns>

<learning_features>

- Support multiple question types: flashcards, multiple choice, short answer, matching, fill-in-blank
- Implement spaced repetition algorithm for optimal retention
- Adaptive difficulty based on user performance
- Multi-source content aggregation (PDFs, URLs, text, future: audio)
- Real-time study sessions with progress tracking
- Performance analytics and learning insights
- Gamification with streaks, achievements, and levels
- Community features for sharing study sets
- Accessibility features and voice interaction support
  </learning_features>

<content_processing>

- Multi-source content ingestion with cost tracking
- Smart content merging and deduplication
- Progressive AI processing to manage costs
- User editing capabilities with free/paid distinction
- Content similarity detection to prevent waste
- Intelligent content chunking for optimal AI processing
- Metadata extraction and tagging
- Quality scoring for generated questions
  </content_processing>

<subscription_management>

- Usage tracking for all billable operations
- Real-time cost monitoring with alerts
- Subscription tier enforcement
- Graceful upgrade prompts when limits reached
- Billing integration with Autumn
- Usage analytics for optimization
- Cost per user monitoring
- Circuit breakers for unusual usage patterns
  </subscription_management>

<performance_optimization>

- Optimize AI API calls with batching and caching
- Use Convex real-time updates for study sessions
- Implement progressive loading for large content
- Cache frequently accessed data
- Use CDN for static assets via Cloudflare R2
- Minimize re-processing of similar content
- Efficient database queries with proper indexing
- Background processing for heavy operations
  </performance_optimization>
