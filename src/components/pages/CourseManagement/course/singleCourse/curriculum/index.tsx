import { Box, Collapse, Divider, useTheme } from '@mui/material';
import { ArrowRight2 } from 'iconsax-reactjs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { CurriculumMediaProps, CurriculumProps } from '../../../../../../types/course';
import CustomCollapseIcon from '../../../../../atom/CustomCollapseIcon';
import MediaCard from '../../../../../organism/Cards/MediaCard';
import MobileCurriculum from './MobileCurriculum';

interface Props {
    data?: CurriculumProps[];
    isLoading: boolean;
    havePurchased: boolean;
}

interface ResourceCounts {
    notes: number;
    videos: number;
    audios: number;
}

interface MediaItem {
    id: number;
    file_name: string;
    url: string;
    size: number | null;
    type: "temp_audios" | "temp_video" | "temp_notes";
}

interface ResourceItem {
    media?: MediaItem[];
    lessons?: ResourceItem[];
    child_lessons?: ResourceItem[];
    units?: ResourceItem[];
}

interface ResourceCounterProps {
    item: ResourceItem;
    isWhite?: boolean;
}

// Utility function to count resources recursively based on media.type
const countResources = (item: ResourceItem): ResourceCounts => {
    let notes = 0;
    let videos = 0;
    let audios = 0;

    // Count current item based on media array
    if (item.media && Array.isArray(item.media)) {
        item.media.forEach(mediaItem => {
            switch (mediaItem.type) {
                case "temp_notes":
                    notes++;
                    break;
                case "temp_video":
                    videos++;
                    break;
                case "temp_audios":
                    audios++;
                    break;
            }
        });
    }

    // Count from child lessons
    if (item.child_lessons) {
        item.child_lessons.forEach(childLesson => {
            const childCounts = countResources(childLesson);
            notes += childCounts.notes;
            videos += childCounts.videos;
            audios += childCounts.audios;
        });
    }

    // Count from lessons
    if (item.lessons) {
        item.lessons.forEach(lesson => {
            const lessonCounts = countResources(lesson);
            notes += lessonCounts.notes;
            videos += lessonCounts.videos;
            audios += lessonCounts.audios;
        });
    }

    // Count from units
    if (item.units) {
        item.units.forEach(unit => {
            const unitCounts = countResources(unit);
            notes += unitCounts.notes;
            videos += unitCounts.videos;
            audios += unitCounts.audios;
        });
    }

    return { notes, videos, audios };
};

const ResourceCounter = ({ item, isWhite = false }: ResourceCounterProps) => {
    const counts = countResources(item);
    const textColorClass = isWhite ? "text-white" : "text-slate-500";

    return (
        <ul className={`features flex justify-start items-center gap-4 ${textColorClass}`}>
            <li className="flex gap-1.5 items-center">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.81871 4.93047L13.7961 5.9902M8.96611 8.09446L10.9548 8.62433M9.06503 14.0554L9.86051 14.2673C12.1105 14.8668 13.2355 15.1665 14.1217 14.6577C15.008 14.1489 15.3094 13.0303 15.9123 10.793L16.7649 7.62899C17.3678 5.39171 17.6692 4.27307 17.1576 3.3918C16.6459 2.51053 15.5209 2.21079 13.2709 1.61131L12.4754 1.39937C10.2255 0.799887 9.10047 0.500148 8.2142 1.00895C7.32793 1.51775 7.02649 2.63639 6.42362 4.87368L5.57102 8.03767C4.96814 10.275 4.6667 11.3936 5.17839 12.2749C5.69007 13.1561 6.81506 13.4559 9.06503 14.0554Z" stroke={isWhite ? "#ffffff" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M9.08333 16.5379L8.28971 16.754C6.04502 17.3653 4.92268 17.6709 4.03849 17.1521C3.15431 16.6333 2.85358 15.4927 2.25211 13.2116L1.40152 9.98552C0.800052 7.70435 0.499321 6.56377 1.00981 5.66521C1.45139 4.88794 2.41667 4.91624 3.66667 4.91614" stroke={isWhite ? "#ffffff" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-base">{counts.notes} Notes</span>
            </li>
            <li className="flex gap-1.5 items-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.3327 6.66667L13.3327 10L18.3327 13.3333V6.66667Z" stroke={isWhite ? "#ffffff" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.666 5H3.33268C2.41221 5 1.66602 5.74619 1.66602 6.66667V13.3333C1.66602 14.2538 2.41221 15 3.33268 15H11.666C12.5865 15 13.3327 14.2538 13.3327 13.3333V6.66667C13.3327 5.74619 12.5865 5 11.666 5Z" stroke={isWhite ? "#ffffff" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-base">{counts.videos} Videos</span>
            </li>
            <li className="flex gap-1.5 items-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0007 15.0003C10.0007 16.8413 8.50827 18.3337 6.66732 18.3337C4.82637 18.3337 3.33398 16.8413 3.33398 15.0003C3.33398 13.1594 4.82637 11.667 6.66732 11.667C8.50827 11.667 10.0007 13.1594 10.0007 15.0003ZM10.0007 15.0003V1.66699L15.834 5.00033" stroke={isWhite ? "#ffffff" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-base">{counts.audios} Audios</span>
            </li>
        </ul>
    );
};

interface SubjectSidebarProps {
    subjects: CurriculumProps[];
    openSubjectId: number | null;
    activeChapterId: number | null;
    onSubjectToggle: (subjectId: number) => void;
    onChapterSelect: (chapterId: number) => void;
}

const SubjectSidebar = ({
    subjects,
    openSubjectId,
    activeChapterId,
    onSubjectToggle,
    onChapterSelect
}: SubjectSidebarProps) => {
    const theme = useTheme();

    return (
        <div className="lg:col-span-3">
            {subjects.map((subject) => {
                const isOpen = openSubjectId === subject.id;

                return (
                    <Box key={subject.id} className="accordion__item mb-2 rounded-md" sx={{
                        border: `1px solid ${theme.palette.textField.border}`
                    }}>
                        <Box
                            style={{ background: theme.palette.primary.main }}
                            className="rounded-md px-4 py-2 lg:py-4 lg:px-5 flex justify-between items-center cursor-pointer"
                            onClick={() => onSubjectToggle(Number(subject.id))}
                        >
                            <span className="font-semibold text-white line-clamp-1 text-lg">
                                {subject.name}
                            </span>
                            <CustomCollapseIcon isOpen={isOpen} />
                        </Box>

                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                            <Box className="space-y-2 p-4">
                                {subject.chapters?.map((chapter) => (
                                    <div
                                        key={chapter.id}
                                        style={{
                                            background: activeChapterId === chapter.id ? theme.palette.primary.light : '',
                                            borderBottom: `1px solid ${activeChapterId === chapter.id ? "transparent" : theme.palette.textField.border}`,
                                        }}
                                        className="rounded-md px-4 py-2 lg:py-4 lg:px-5 flex justify-between items-center cursor-pointer"
                                        onClick={() => onChapterSelect(Number(chapter.id))}
                                    >
                                        <span className="text-sm truncate">
                                            {chapter.name}
                                        </span>
                                        <ArrowRight2 size={16} />
                                    </div>
                                ))}
                            </Box>
                        </Collapse>
                    </Box>
                );
            })}
        </div>
    );
};

interface ChildLessonProps {
    childLesson: any;
    isOpen: boolean;
    onToggle: (childLessonId: number) => void;
    havePurchased: boolean;
    courseId?: number | null;
}

const ChildLesson = ({ childLesson, isOpen, onToggle, havePurchased, courseId }: ChildLessonProps) => {
    const theme = useTheme();

    return (
        <Box className="mb-2">
            <Box
                style={{ background: theme.palette.primary.light }}
                className="rounded-md py-3 px-4 flex justify-between items-center cursor-pointer"
                onClick={() => onToggle(Number(childLesson.id))}
            >
                <CustomCollapseIcon isOpen={isOpen} />
                <span className="text-base truncate flex-1 mx-4">
                    {childLesson.name}
                </span>
                <ResourceCounter item={childLesson} />
            </Box>

            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box className="p-4 rounded-md" sx={{
                    border: `1px solid ${theme.palette.textField.border}`
                }}>
                    <div
                        className="general__content__box mb-4 text-sm"
                        dangerouslySetInnerHTML={{ __html: childLesson.description }}
                    />
                    {childLesson?.media?.length ? (
                        <div className="flex flex-col md:grid md:grid-cols-2  xl:grid-cols-3 gap-4">
                            {childLesson.media.map((item: CurriculumMediaProps) => (
                                <div className="col-span-1" key={item.id}>
                                    <MediaCard havePurchased={havePurchased} type={item.type} media={item} courseId={courseId} />
                                </div>
                            ))}
                        </div>
                    ) : null}
                </Box>
            </Collapse>
        </Box>
    );
};

interface LessonItemProps {
    lesson: any;
    isOpen: boolean;
    openChildLessonIds: Set<number>;
    onToggle: (lessonId: number) => void;
    onChildLessonToggle: (childLessonId: number) => void;
    havePurchased: boolean;
    courseId?: number | null;
}

const LessonItem = ({ lesson, isOpen, openChildLessonIds, onToggle, onChildLessonToggle, havePurchased, courseId }: LessonItemProps) => {
    const theme = useTheme();

    return (
        <Box className="mb-2">
            <Box
                style={{ background: theme.palette.primary.light }}
                className="rounded-md px-4 py-2 lg:py-4 lg:px-5 flex justify-between items-center cursor-pointer"
                onClick={() => onToggle(Number(lesson.id))}
            >
                <CustomCollapseIcon isOpen={isOpen} />
                <span className="text-lg truncate flex-1 mx-4">
                    {lesson.name}
                </span>
                <ResourceCounter item={lesson} />
            </Box>

            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box className="p-4 rounded-md" sx={{
                    border: `1px solid ${theme.palette.textField.border}`
                }}>
                    <div
                        className="general__content__box mb-4"
                        dangerouslySetInnerHTML={{ __html: lesson.description }}
                    />

                    {lesson?.media?.length ? (
                        <div className="flex flex-col md:grid md:grid-cols-2  xl:grid-cols-3 gap-4 mb-4">
                            {lesson.media.map((item: CurriculumMediaProps) => (
                                <div className="col-span-1" key={item.id}>
                                    <MediaCard havePurchased={havePurchased} type={item.type} media={item} courseId={courseId} />
                                </div>
                            ))}
                        </div>
                    ) : null}

                    {lesson.child_lessons?.length > 0 && (
                        <div className="space-y-2">
                            {lesson.child_lessons.map((childLesson: any) => (
                                <ChildLesson
                                    key={childLesson.id}
                                    childLesson={childLesson}
                                    isOpen={openChildLessonIds.has(childLesson.id)}
                                    onToggle={onChildLessonToggle}
                                    havePurchased={havePurchased}
                                    courseId={courseId}
                                />
                            ))}
                        </div>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
};

interface UnitItemProps {
    unit: any;
    isOpen: boolean;
    openLessonIds: Set<number>;
    openChildLessonIds: Set<number>;
    onUnitToggle: (unitId: number) => void;
    onLessonToggle: (lessonId: number) => void;
    onChildLessonToggle: (childLessonId: number) => void;
    havePurchased: boolean;
    courseId?: number | null;
}

const UnitItem = ({ unit, isOpen, openLessonIds, openChildLessonIds, onUnitToggle, onLessonToggle, onChildLessonToggle, havePurchased, courseId }: UnitItemProps) => {
    const theme = useTheme();

    return (
        <div className="accordion__item">
            <Box
                style={{ background: theme.palette.primary.main }}
                className="rounded-md px-4 py-2 lg:py-4 lg:px-5 flex justify-between items-center cursor-pointer"
                onClick={() => onUnitToggle(Number(unit.id))}
            >
                <CustomCollapseIcon isOpen={isOpen} />
                <span className="font-semibold text-white truncate text-lg flex-1 mx-4">
                    {unit.name}
                </span>
                <ResourceCounter item={unit} isWhite />
            </Box>

            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box className="p-6 rounded-md" sx={{
                    border: `1px solid ${theme.palette.textField.border}`
                }}>
                    <div
                        className="general__content__box mb-4"
                        dangerouslySetInnerHTML={{ __html: unit.description }}
                    />

                    {unit?.media?.length ? (
                        <div className="flex flex-col md:grid md:grid-cols-2  xl:grid-cols-3 gap-4 mb-4">
                            {unit.media.map((item: CurriculumMediaProps) => (
                                <div className="col-span-1" key={item.id}>
                                    <MediaCard havePurchased={havePurchased} type={item.type} media={item} courseId={courseId} />
                                </div>
                            ))}
                        </div>
                    ) : null}

                    {unit.lessons?.map((lesson: any) => (
                        <LessonItem
                            key={lesson.id}
                            lesson={lesson}
                            isOpen={openLessonIds.has(lesson.id)}
                            openChildLessonIds={openChildLessonIds}
                            onToggle={onLessonToggle}
                            onChildLessonToggle={onChildLessonToggle}
                            havePurchased={havePurchased}
                            courseId={courseId}
                        />
                    ))}
                </Box>
            </Collapse>
        </div>
    );
};

interface ChapterContentProps {
    activeSubject: CurriculumProps | undefined;
    activeChapter: any;
    openUnitIds: Set<number>;
    openLessonIds: Set<number>;
    openChildLessonIds: Set<number>;
    onUnitToggle: (unitId: number) => void;
    onLessonToggle: (lessonId: number) => void;
    onChildLessonToggle: (childLessonId: number) => void;
    havePurchased: boolean;
    courseId?: number | null;
}

const ChapterContent = ({
    activeSubject,
    activeChapter,
    openUnitIds,
    openLessonIds,
    openChildLessonIds,
    onUnitToggle,
    onLessonToggle,
    onChildLessonToggle,
    havePurchased,
    courseId
}: ChapterContentProps) => {
    return (
        <div>
            <div className="mb-6">
                <span className="text-base text-gray-500 mb-1.5 block">{activeSubject?.name}</span>
                <h2 className="text-2xl font-semibold mb-1 block">{activeChapter.name}</h2>
                <div
                    className="general__content__box"
                    dangerouslySetInnerHTML={{ __html: activeChapter.description }}
                />
                <ResourceCounter item={activeChapter} />
            </div>
            {activeChapter?.media?.length ? (
                <div className="flex flex-col md:grid md:grid-cols-2  xl:grid-cols-3 gap-4 mb-4">
                    {activeChapter.media.map((item: CurriculumMediaProps) => (
                        <div className="col-span-1" key={item.id}>
                            <MediaCard havePurchased={havePurchased} type={item.type} media={item} courseId={courseId} />
                        </div>
                    ))}
                </div>
            ) : null}

            <Divider className="my-5 mb-4" />

            <Box className="space-y-2 rounded-md">
                {activeChapter.units?.map((unit: any) => (
                    <UnitItem
                        key={unit.id}
                        unit={unit}
                        isOpen={openUnitIds.has(unit.id)}
                        openLessonIds={openLessonIds}
                        openChildLessonIds={openChildLessonIds}
                        onUnitToggle={onUnitToggle}
                        onLessonToggle={onLessonToggle}
                        onChildLessonToggle={onChildLessonToggle}
                        havePurchased={havePurchased}
                        courseId={courseId}
                    />
                ))}
            </Box>
        </div>
    );
};

const EmptyChaptersState = () => {
    return (
        <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
                <svg
                    className="mx-auto mb-4"
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="40" cy="40" r="40" fill="#F1F5F9" />
                    <path
                        d="M50 30H30C28.8954 30 28 30.8954 28 32V48C28 49.1046 28.8954 50 30 50H50C51.1046 50 52 49.1046 52 48V32C52 30.8954 51.1046 30 50 30Z"
                        stroke="#94A3B8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M35 36H45M35 40H45M35 44H40"
                        stroke="#94A3B8"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">
                    Chapters Coming Soon
                </h3>
                <p className="text-gray-500">
                    We are currently adding chapters to this course. Please check back later for updated content.
                </p>
            </div>
        </div>
    );
};

export default function SingleCourseCurriculum({ data, havePurchased }: Props) {
    const { id } = useParams();

    const [openSubjectId, setOpenSubjectId] = useState<number | null>(null);
    const [activeChapterId, setActiveChapterId] = useState<number | null>(null);
    const [openUnitIds, setOpenUnitIds] = useState<Set<number>>(new Set());
    const [openLessonIds, setOpenLessonIds] = useState<Set<number>>(new Set());
    const [openChildLessonIds, setOpenChildLessonIds] = useState<Set<number>>(new Set());

    // Set first subject and chapter active on load
    useEffect(() => {
        if (data && data.length > 0) {
            setOpenSubjectId(Number(data[0].id));
            if (data[0].chapters && data[0].chapters.length > 0) {
                setActiveChapterId(Number(data[0].chapters[0].id));
            }
        }
    }, [data]);

    const toggleSubject = (subjectId: number) => {
        const newSubjectId = openSubjectId === subjectId ? null : subjectId;
        setOpenSubjectId(newSubjectId);

        // Auto-select first chapter when opening a subject
        if (newSubjectId !== null) {
            const subject = data?.find(s => s.id === newSubjectId);
            if (subject?.chapters && subject.chapters.length > 0) {
                setActiveChapterId(Number(subject.chapters[0].id));
            } else {
                setActiveChapterId(null);
            }
        }
    };

    const handleChapterSelect = (chapterId: number) => {
        setActiveChapterId(chapterId);
    };

    const toggleUnit = (unitId: number) => {
        setOpenUnitIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(unitId)) {
                newSet.delete(unitId);
            } else {
                newSet.add(unitId);
            }
            return newSet;
        });
    };

    const toggleLesson = (lessonId: number) => {
        setOpenLessonIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(lessonId)) {
                newSet.delete(lessonId);
            } else {
                newSet.add(lessonId);
            }
            return newSet;
        });
    };

    const toggleChildLesson = (childLessonId: number) => {
        setOpenChildLessonIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(childLessonId)) {
                newSet.delete(childLessonId);
            } else {
                newSet.add(childLessonId);
            }
            return newSet;
        });
    };

    const activeSubject = data?.find(s => s.id === openSubjectId);
    const activeChapter = activeSubject?.chapters?.find(c => c.id === activeChapterId);

    // Check if active subject has no chapters
    const hasNoChapters = activeSubject && (!activeSubject.chapters || activeSubject.chapters.length === 0);

    return (
        <div className="pb-4">
            <div className="2xl:grid gap-6 2xl:grid-cols-12 hidden ">
                <SubjectSidebar
                    subjects={data || []}
                    openSubjectId={openSubjectId}
                    activeChapterId={activeChapterId}
                    onSubjectToggle={toggleSubject}
                    onChapterSelect={handleChapterSelect}
                />

                <div className="lg:col-span-9">
                    {hasNoChapters ? (
                        <EmptyChaptersState />
                    ) : activeChapter ? (
                        <ChapterContent
                            activeSubject={activeSubject}
                            activeChapter={activeChapter}
                            openUnitIds={openUnitIds}
                            openLessonIds={openLessonIds}
                            openChildLessonIds={openChildLessonIds}
                            onUnitToggle={toggleUnit}
                            onLessonToggle={toggleLesson}
                            onChildLessonToggle={toggleChildLesson}
                            havePurchased={havePurchased}
                            courseId={Number(id)}
                        />
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p>Select a subject and chapter from the sidebar to view curriculum details</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="2xl:hidden">
                <MobileCurriculum havePurchased={havePurchased} data={data} courseId={Number(id)} />
            </div>
        </div>
    );
}