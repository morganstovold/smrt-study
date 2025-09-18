---
trigger: always_on
---

# Next.js App Router Rules for SmrtStudy

<app_router_structure>
Use src/app/ directory structure
Server Components by default (no "use client" needed)
Add "use client" only for interactivity/state/real-time updates
Use route groups with parentheses: (auth), (dashboard), (public)
Nested layouts for shared UI patterns (dashboard layout, auth layout)
Loading/error boundaries with loading.tsx and error.tsx
Dynamic routes for study sessions: [sessionId], [studySetId]
Parallel routes for modals: @modal/(.)upgrade/page.tsx
</app_router_structure>

<smrtstudy_routing>
// Route structure for SmrtStudy
src/app/
├── (auth)/
│ ├── layout.tsx # Auth-specific layout
│ ├── login/page.tsx # Login page
│ └── register/page.tsx # Registration page
├── (dashboard)/
│ ├── layout.tsx # Dashboard layout with navigation
│ ├── dashboard/page.tsx # Main dashboard
│ ├── study-sets/
│ │ ├── page.tsx # Study sets list
│ │ ├── create/page.tsx # Create new study set
│ │ └── [id]/
│ │ ├── page.tsx # Study set details
│ │ ├── edit/page.tsx # Edit study set
│ │ └── study/
│ │ └── page.tsx # Study session
│ ├── progress/page.tsx # Analytics and progress
│ ├── billing/page.tsx # Subscription management
│ └── settings/page.tsx # User settings
├── (public)/
│ ├── layout.tsx # Public layout
│ ├── explore/page.tsx # Explore public study sets
│ ├── subjects/page.tsx # Browse by subject
│ └── community/page.tsx # Community features
└── api/
├── webhooks/
│ └── stripe/route.ts # Billing webhooks
└── upload/route.ts # File upload handling
</smrtstudy_routing>

<convex_integration>
// app/layout.tsx - ConvexProvider with authentication
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth } from "convex/react-auth";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body className="antialiased">
<ConvexProviderWithAuth client={convex}>
{children}
</ConvexProviderWithAuth>
</body>
</html>
);
}

// Client component for study sessions with real-time updates
"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/\_generated/api";

export default function StudySession({ studySetId }: { studySetId: string }) {
const session = useQuery(api.study.sessions.getCurrent, { studySetId });
const updateSession = useMutation(api.study.sessions.updateProgress);

if (session === undefined) return <StudySessionSkeleton />;
if (session === null) return <NoActiveSession />;

return (
<div className="study-session">
<QuestionCard
question={session.currentQuestion}
onAnswer={(answer) => updateSession({ sessionId: session.\_id, answer })}
/>
</div>
);
}
