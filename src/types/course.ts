
import type { Pagination } from ".";
import type { GlobalResponse } from "./user";

export interface SelectionType {
    mega_category: number[];
    category: { [megaCategoryId: number]: number[] };
    sub_category: { [categoryId: number]: number[] };
    position_ids: number[];
}

export type CourseTypeProps = "free" | "expiry" | "subscription"
export type DiscountTypeProps = "percentage" | "amount"
export type BillingCycle = "days" | "months" | "years"
export type CurriculumType = "subject" | "chapter" | "unit" | "lesson" | "child_lesson";

export interface DurationProps {
    hours: number;
    minutes: number;
}

export interface CourseExpiry {
    start_date: string;
    end_date: string;
    price: string;
    discount: number
    discount_type: DiscountTypeProps;
}

export interface CourseSubscription {
    name: string
    subscription_id: number;
    price: string;
    billing_cycle: BillingCycle
    number: number;
}

export interface Teacher {
    id: number;
    name: string;
    profile: string;
    designation: string;
}

export interface CourseProps {
    id?: number;
    name: string;
    slug: string;
    duration: DurationProps;
    description: string;
    thumbnail: File | null;
    thumbnail_url?: string;
    selections: SelectionType;
    about_this_course: string;
    teachers: Teacher[];
    course_type: CourseTypeProps
    course_expiry: CourseExpiry;
    free_type_description?: string;
    subjects?: number;
    created_at?: string;
    subscriptions?: CourseSubscription[] | null;
    marked_price?: string,
    sale_price?: string,
    mega_categories?: string[];
    user: {
        has_taken_freetrial: false,
        is_free_trial_valid: false,
        has_purchased: false
        free_trial_count: number;
    },
    is_bookmarked?: boolean;
    no_of_notes: number;
    no_of_audios: number;
    no_of_videos: number;
    no_of_tests: number;
    progress: number;
    end_at?: string;
    started_from?: string;
}

export interface CourseList extends GlobalResponse {
    data: {
        data: CourseProps[];
        pagination: Pagination;
    }
}

export type courseTabType = "overview" | "curriculum" | "notes" | "test" | "audios" | "videos" | "live_classes";

export const CourseTabs: { label: string; value: courseTabType }[] = [
    {
        label: "Overview",
        value: "overview"
    },
    {
        label: "Curriculum",
        value: "curriculum"
    },
    {
        label: "Notes",
        value: "notes"
    },
    {
        label: "Test",
        value: "test"
    },
    {
        label: "Audios",
        value: "audios"
    },
    {
        label: "Videos",
        value: "videos"
    },
    {
        label: "Live Classes",
        value: "live_classes"
    },
]

// Media type for curriculum items
export type CurriculumMediaType = "temp_audios" | "temp_video" | "temp_notes"

export interface CurriculumMediaProps {
    id: number;
    file_name: string;
    url: string;
    size: number;
    type: CurriculumMediaType;
}

// Base props for all curriculum items
export interface CurriculumCommonProps {
    id?: number;
    name: string;
    description: string;
    media: CurriculumMediaProps[];
}

// Hierarchy of curriculum items
export interface ChildLessonProps extends CurriculumCommonProps { }

export interface LessonProps extends CurriculumCommonProps {
    child_lessons: ChildLessonProps[];
}

export interface UnitProps extends CurriculumCommonProps {
    lessons: LessonProps[];
}

export interface ChapterProps extends CurriculumCommonProps {
    units: UnitProps[];
}

export interface SubjectProps extends CurriculumCommonProps {
    chapters: ChapterProps[] | null;
}

export interface CurriculumProps extends SubjectProps { }

export interface CurriculumList extends GlobalResponse {
    data: {
        data: CurriculumProps[];
        pagination: Pagination;
    }
}