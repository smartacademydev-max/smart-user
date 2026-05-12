# Backend Requirements — Learning Canvas & My Course

Consolidated punch-list for the backend team. Every dynamic feature the frontend
needs is listed below. Items marked **NEW** require new endpoints/fields;
**MODIFIED** items extend existing payloads.

---

## 1. Tests attached to curriculum nodes

### `GET /course/{id}/curriculum` — **MODIFIED**

Each `chapter`, `unit`, `lesson`, `child_lesson` node in the existing nested
response must now carry an optional hydrated `test` object:

```ts
test: {
    id: number
    name: string
    test_type: string                       // "mock" | "practice" | etc.
    duration: { hours: number, minutes: number }
    total_questions: number
} | null
```

Subject-level nodes do **not** carry a test. Field is optional — omit / send
`null` when no test is linked.

### `POST /admin/course/curriculum/{id}?type=chapter|unit|lesson|child_lesson` — **MODIFIED** (admin)

Accept new optional field in the body:

```ts
test_id: number | null
```

When set, link the curriculum node to that test. When `null`, clear the link.
Subject (`?type=subject`) should reject or ignore `test_id`.

---

## 2. Canvas per-content progress (resume + watched %)

### `GET /course/{id}/canvas/contents-progress` — **NEW**

Returns the current user's per-content progress for this course.

```ts
{
    data: Array<{
        content_id: number
        content_type: "video" | "audio" | "note" | "test" | "quiz" | "assignment"
        position: number                    // seconds — resume point
        percent: number                     // 0..100 — watched / listened fraction
        completed: boolean
        updated_at?: string
    }>
}
```

If the user has no progress yet, return `{ data: [] }`.

### `POST /course/{id}/canvas/progress` — **NEW**

Throttled per-content tick from the client (~5s while playing, plus on pause /
end / unmount). Idempotent upsert keyed by `(user_id, course_id, content_id)`.

```ts
Body: {
    content_id: number
    content_type: "video" | "audio" | "note" | "test" | "quiz" | "assignment"
    position: number                        // floor()-ed seconds, clamp >= 0
    percent: number                         // 0..100, clamp
}
```

Rules:
- Last-write-wins. No conflict resolution required.
- Never flip `completed: true` from a tick — `completed` is only set via
  `/canvas/complete`.
- Cap `percent` at 100 server-side as a safety net.

### `POST /course/{id}/canvas/complete` — **MODIFIED**

Already exists. After marking complete, the matching row in
`contents-progress` must be set to `completed: true, percent: 100` so the
next read reflects completion without a stale window.

---

## 3. Canvas course progress (sidebar cards)

### `GET /course/{id}/canvas/progress` — **MODIFIED**

Existing endpoint. Extend its response to include the optional fields the
sidebar surfaces:

```ts
{
    data: {
        progress: number                    // existing, 0..100
        lessons_done: number                // existing
        quizzes_passed: number              // existing

        assignments_done?: number           // NEW — used by ProgressCard pill
        total_assignments?: number          // NEW — for ratio displays

        expires_on?: string | null          // NEW — short label ("1st April") or ISO date

        study_streak: Array<{ date: string, has_activity: boolean }>   // existing
        next_up: {
            content_id: number
            content_title: string
            content_type: CanvasContentType
            section_name: string
            duration_label?: string         // NEW — e.g. "Video · 18 min"
        } | null

        course_stats: {
            total_subjects: number          // existing
            total_notes: number             // existing
            total_audios: number            // existing
            total_videos: number            // existing
            total_tests: number             // existing

            videos_watched?: number         // NEW — count of videos with completed=true
            audios_listened?: number        // NEW — same for audio
            notes_read?: number             // NEW — same for notes
        }
    }
}
```

All `NEW` fields are optional. When absent the frontend renders 0 / hides the
relevant row gracefully.

---

## 4. Course rating (banner)

### `GET /course/{id}` — **MODIFIED**

Add two optional fields to the existing course payload:

```ts
rating?: number                              // 0..5
reviews_count?: number | string              // "2.4k" or numeric
```

When absent, the rating row in the my-course banner is hidden.

---

## 5. Existing canvas endpoints (no change required)

These were already wired client-side and remain unchanged. Listed for
completeness so they aren't deprecated by mistake:

| Route | Verb | Notes |
|---|---|---|
| `/course/{id}/canvas/curriculum` | GET | Flat sections/items shape. Now unused (we render from `/course/{id}/curriculum`); safe to leave or remove. |
| `/course/{id}/canvas/completion` | GET | Returns certificate / completion details when fully done. |
| `/course/{id}/canvas/complete` | POST | See §2 — note the side-effect required. |

---

## 6. URL paths the frontend uses

No backend change needed for these — only the data they consume:

| Path | Renders |
|---|---|
| `/my-course` | Existing my-course list |
| `/my-course/:id` | Single course detail in "my course" mode (reuses `GET /course/{id}` etc.) |
| `/learning-canvas`, `/learning-canvas/:courseId/...` | Learning canvas viewer (reuses `GET /course/{id}/curriculum` and the canvas endpoints above) |

---

## TL;DR

1. **Hydrate `test`** on every chapter/unit/lesson/child_lesson in `GET /course/{id}/curriculum`.
2. **Accept `test_id`** in the admin `POST /admin/course/curriculum/{id}?type=...` payload.
3. **Build** `GET /course/{id}/canvas/contents-progress` (array of per-content rows).
4. **Build** `POST /course/{id}/canvas/progress` (idempotent upsert; last-write-wins; capped %).
5. **Make** `POST /course/{id}/canvas/complete` also flip the matching `contents-progress` row to `completed: true, percent: 100`.
6. **Extend** `GET /course/{id}/canvas/progress` with `assignments_done`, `expires_on`, `next_up.duration_label`, and `course_stats.videos_watched / audios_listened / notes_read`.
7. **Add** `rating` and `reviews_count` to `GET /course/{id}`.

Once these land, every dynamic feature added in this session is fully
backend-driven with no client-side stubbing.
