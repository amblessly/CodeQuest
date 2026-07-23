# QuizCode Architecture Flow

## High-Level Flow

``` text
User
  │
  ▼
Next.js (App Router)
  ├── Authentication (Better Auth/Auth.js)
  ├── Dashboard
  ├── Category Pages
  ├── Level Map
  ├── Quiz Engine
  ├── Profile
  └── API Routes
          │
          ▼
      Prisma ORM
          │
          ▼
     PostgreSQL
```

## User Journey

``` text
Landing
  ↓
Sign Up / Login
  ↓
Dashboard
  ↓
Choose Category
  ↓
Level Map
  ↓
Select Unlocked Level
  ↓
Quiz (5–10 Questions)
  ↓
Instant Feedback
  ↓
XP Awarded
  ↓
Progress Saved
  ↓
Unlock Next Level
  ↓
Back to Dashboard
```

## Quiz Flow

``` text
Start Quiz
 ↓
Fetch Questions
 ↓
Shuffle Questions
 ↓
Display Question
 ↓
User Answers
 ↓
Check Correct?
 ├─ Yes → Show Explanation
 └─ No  → Show Explanation
 ↓
Next Question
 ↓
Finished?
 ├─ No → Continue
 └─ Yes
      ↓
Calculate Score
      ↓
Award XP
      ↓
Save Progress
      ↓
Unlock Next Level
      ↓
Results Screen
```

## API Flow

``` text
Frontend
  │
  ▼
API Route
  │
Validation
  │
Prisma
  │
PostgreSQL
  │
Return JSON
```

## Database

-   users
-   categories
-   levels
-   questions
-   progress

Relations

``` text
User
 └── Progress
       └── Level
              └── Category

Level
 └── Questions
```

## Folder Structure

``` text
app/
  auth/
  dashboard/
  category/[slug]/
  level/[id]/
  quiz/[levelId]/
  profile/
  api/

components/
  dashboard/
  quiz/
  map/
  profile/
  ui/

lib/
  prisma.ts
  auth.ts

prisma/
  schema.prisma
```

## XP Flow

``` text
Finish Quiz
 ↓
Count Correct Answers
 ↓
Calculate XP
 ↓
Update User XP
 ↓
Update Player Level
 ↓
Save Progress
```

## Future Extensions

-   Leaderboard
-   Achievements
-   Daily Challenge
-   Hearts
-   Multiplayer
-   PWA
