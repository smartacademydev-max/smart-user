import type {
    ChapterProps,
    ChildLessonProps,
    CurriculumCommonProps,
    CurriculumMediaProps,
    CurriculumProps,
    LessonProps,
    UnitProps,
} from "../../../../types/course";
import type {
    CanvasContent,
    CanvasContentType,
    CurriculumNode,
} from "../../../../types/learningCanvas";

/**
 * Map the API media type ("temp_video" / "temp_audios" / "temp_notes")
 * to the canvas content type used by the player switch.
 */
function mediaToContentType(type: CurriculumMediaProps["type"]): CanvasContentType {
    switch (type) {
        case "temp_video": return "video";
        case "temp_audios": return "audio";
        case "temp_notes": return "note";
        default: return "video";
    }
}

/** Build a CanvasContent[] from a curriculum node's media array. */
function mediaToContents(
    media: CurriculumMediaProps[] | undefined,
    parentId: number,
): CanvasContent[] {
    if (!media?.length) return [];
    return media.map((m) => ({
        id: m.id || parentId * 1000 + Math.floor(Math.random() * 1000),
        title: m.file_name,
        content_type: mediaToContentType(m.type),
        completion_status: "not_started",
        is_locked: false,
        reference_id: m.id,
        url: m.url,
        file_name: m.file_name,
    }));
}

/**
 * Build the per-node content list: media items first, then the attached test (if any).
 * The test gets a synthetic id derived from the test_id so it doesn't collide with media ids.
 */
function buildNodeContents(node: CurriculumCommonProps, parentId: number): CanvasContent[] {
    const out = mediaToContents(node.media, parentId);
    if (node.test) {
        const d = node.test.duration;
        const totalMinutes = (Number(d?.hours ?? 0) * 60) + Number(d?.minutes ?? 0);
        out.push({
            id: -node.test.id, // negative to avoid clashing with positive media ids
            title: node.test.name,
            content_type: "test",
            completion_status: "not_started",
            is_locked: false,
            reference_id: node.test.id,
            duration_minutes: totalMinutes,
        });
    }
    return out;
}

function transformChildLesson(node: ChildLessonProps, idx: number): CurriculumNode {
    const id = node.id ?? idx + 1;
    return {
        id,
        level: "child_lesson",
        name: node.name,
        description: node.description || undefined,
        order: idx + 1,
        contents: buildNodeContents(node, id),
    };
}

function transformLesson(node: LessonProps, idx: number): CurriculumNode {
    const id = node.id ?? idx + 1;
    return {
        id,
        level: "lesson",
        name: node.name,
        description: node.description || undefined,
        order: idx + 1,
        contents: buildNodeContents(node, id),
        children: node.child_lessons?.map((cl, i) => transformChildLesson(cl, i)),
    };
}

function transformUnit(node: UnitProps, idx: number): CurriculumNode {
    const id = node.id ?? idx + 1;
    return {
        id,
        level: "unit",
        name: node.name,
        description: node.description || undefined,
        order: idx + 1,
        contents: buildNodeContents(node, id),
        children: node.lessons?.map((l, i) => transformLesson(l, i)),
    };
}

function transformChapter(node: ChapterProps, idx: number): CurriculumNode {
    const id = node.id ?? idx + 1;
    return {
        id,
        level: "chapter",
        name: node.name,
        description: node.description || undefined,
        order: idx + 1,
        contents: buildNodeContents(node, id),
        children: node.units?.map((u, i) => transformUnit(u, i)),
    };
}

/**
 * Top-level transformer: API subjects → CurriculumNode tree.
 * Subjects sit above chapters in the API hierarchy.
 */
export function transformCurriculum(subjects: CurriculumProps[] | undefined): CurriculumNode[] {
    if (!subjects?.length) return [];
    return subjects.map((s, idx) => {
        const id = s.id ?? idx + 1;
        return {
            id,
            level: "subject",
            name: s.name,
            description: s.description || undefined,
            order: idx + 1,
            contents: mediaToContents(s.media, id),
            children: s.chapters?.map((c, i) => transformChapter(c, i)),
        };
    });
}
