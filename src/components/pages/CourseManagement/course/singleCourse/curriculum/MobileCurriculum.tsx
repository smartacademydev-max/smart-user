import { Box, Collapse, useTheme } from '@mui/material';
import { useState } from 'react';
import type { ChapterProps, ChildLessonProps, CurriculumMediaProps, CurriculumProps, LessonProps, UnitProps } from '../../../../../../types/course';
import type { MediaProps } from '../../../../../../types/media';
import CustomCollapseIcon from '../../../../../atom/CustomCollapseIcon';
import MediaCard from '../../../../../organism/Cards/MediaCard';

interface Props {
    data?: CurriculumProps[];
    havePurchased: boolean;
    courseId?: number | null;
}

interface ResourceCounts {
    notes: number;
    videos: number;
    audios: number;
}



// Utility function to count resources recursively
const countResources = (item: any): ResourceCounts => {
    let notes = 0;
    let videos = 0;
    let audios = 0;

    if (item.media && Array.isArray(item.media)) {
        item.media.forEach((mediaItem: CurriculumMediaProps) => {
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

    if (item.child_lessons) {
        item.child_lessons.forEach((childLesson: ChildLessonProps) => {
            const childCounts = countResources(childLesson);
            notes += childCounts.notes;
            videos += childCounts.videos;
            audios += childCounts.audios;
        });
    }

    if (item.lessons) {
        item.lessons.forEach((lesson: LessonProps) => {
            const lessonCounts = countResources(lesson);
            notes += lessonCounts.notes;
            videos += lessonCounts.videos;
            audios += lessonCounts.audios;
        });
    }

    if (item.units) {
        item.units.forEach((unit: UnitProps) => {
            const unitCounts = countResources(unit);
            notes += unitCounts.notes;
            videos += unitCounts.videos;
            audios += unitCounts.audios;
        });
    }

    if (item.chapters) {
        item.chapters.forEach((chapter: ChapterProps) => {
            const chapterCounts = countResources(chapter);
            notes += chapterCounts.notes;
            videos += chapterCounts.videos;
            audios += chapterCounts.audios;
        });
    }

    return { notes, videos, audios };
};

interface ResourceCounterProps {
    item: CurriculumProps;
    isWhite?: boolean;
}

const ResourceCounter = ({ item, isWhite = false }: ResourceCounterProps) => {
    const counts = countResources(item);
    const textColorClass = isWhite ? "text-white" : "text-slate-500";

    return (
        <ul className={`features flex justify-start items-center gap-3 ${textColorClass}`}>
            <li className="flex gap-1 items-center">
                <svg width="16" height="16" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.81871 4.93047L13.7961 5.9902M8.96611 8.09446L10.9548 8.62433M9.06503 14.0554L9.86051 14.2673C12.1105 14.8668 13.2355 15.1665 14.1217 14.6577C15.008 14.1489 15.3094 13.0303 15.9123 10.793L16.7649 7.62899C17.3678 5.39171 17.6692 4.27307 17.1576 3.3918C16.6459 2.51053 15.5209 2.21079 13.2709 1.61131L12.4754 1.39937C10.2255 0.799887 9.10047 0.500148 8.2142 1.00895C7.32793 1.51775 7.02649 2.63639 6.42362 4.87368L5.57102 8.03767C4.96814 10.275 4.6667 11.3936 5.17839 12.2749C5.69007 13.1561 6.81506 13.4559 9.06503 14.0554Z" stroke={isWhite ? "#ffffff" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M9.08333 16.5379L8.28971 16.754C6.04502 17.3653 4.92268 17.6709 4.03849 17.1521C3.15431 16.6333 2.85358 15.4927 2.25211 13.2116L1.40152 9.98552C0.800052 7.70435 0.499321 6.56377 1.00981 5.66521C1.45139 4.88794 2.41667 4.91624 3.66667 4.91614" stroke={isWhite ? "#ffffff" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-sm">{counts.notes}</span>
            </li>
            <li className="flex gap-1 items-center">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.3327 6.66667L13.3327 10L18.3327 13.3333V6.66667Z" stroke={isWhite ? "#ffffff" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.666 5H3.33268C2.41221 5 1.66602 5.74619 1.66602 6.66667V13.3333C1.66602 14.2538 2.41221 15 3.33268 15H11.666C12.5865 15 13.3327 14.2538 13.3327 13.3333V6.66667C13.3327 5.74619 12.5865 5 11.666 5Z" stroke={isWhite ? "#ffffff" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm">{counts.videos}</span>
            </li>
            <li className="flex gap-1 items-center">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0007 15.0003C10.0007 16.8413 8.50827 18.3337 6.66732 18.3337C4.82637 18.3337 3.33398 16.8413 3.33398 15.0003C3.33398 13.1594 4.82637 11.667 6.66732 11.667C8.50827 11.667 10.0007 13.1594 10.0007 15.0003ZM10.0007 15.0003V1.66699L15.834 5.00033" stroke={isWhite ? "#ffffff" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm">{counts.audios}</span>
            </li>
        </ul>
    );
};


const MobileChildLesson = ({ childLesson, havePurchased, courseId }: {
    childLesson: any;
    havePurchased: boolean;
    courseId?: number | null;
}) => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box className="mb-2 ml-4">
            <Box
                style={{ background: theme.palette.background.paper }}
                className="rounded-md py-2.5 px-3 flex items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                    border: `1px solid ${theme.palette.textField.border}`
                }}
            >
                <div className="flex-col lg:flex-row flex gap-2 flex-1 min-w-0 mr-2">
                    <span className="text-sm truncate">{childLesson.name}</span>
                    <ResourceCounter item={childLesson} />
                </div>
                <CustomCollapseIcon isOpen={isOpen} />
            </Box>

            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box className="p-3 mt-2 rounded-md" sx={{
                    border: `1px solid ${theme.palette.textField.border}`
                }}>
                    <div
                        className="general__content__box mb-3 text-sm"
                        dangerouslySetInnerHTML={{ __html: childLesson.description }}
                    />
                    {childLesson?.media?.length ? (
                        <div className="flex flex-col gap-3">
                            {childLesson.media.map((item: CurriculumMediaProps & MediaProps) => (
                                <MediaCard havePurchased={havePurchased} type={item.type} media={item} courseId={courseId} />
                            ))}
                        </div>
                    ) : null}
                </Box>
            </Collapse>
        </Box>
    );
};

const MobileLesson = ({ lesson, havePurchased, courseId }: {
    lesson: any;
    havePurchased: boolean;
    courseId?: number | null;

}) => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box className="mb-2 ml-3">
            <Box
                style={{ background: theme.palette.primary.light }}
                className="rounded-md py-2.5 px-3 flex items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex-col lg:flex-row flex gap-2 flex-1 min-w-0 mr-2">
                    <span className="text-sm font-medium truncate">{lesson.name}</span>
                    <ResourceCounter item={lesson} />
                </div>
                <CustomCollapseIcon isOpen={isOpen} />
            </Box>

            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box className="p-3 mt-2 rounded-md" sx={{
                    border: `1px solid ${theme.palette.textField.border}`
                }}>
                    <div
                        className="general__content__box mb-3 text-sm"
                        dangerouslySetInnerHTML={{ __html: lesson.description }}
                    />

                    {lesson?.media?.length ? (
                        <div className="flex flex-col gap-3 mb-3">
                            {lesson.media.map((item: CurriculumMediaProps & MediaProps) => (
                                <MediaCard havePurchased={havePurchased} type={item.type} media={item} courseId={courseId} />
                            ))}
                        </div>
                    ) : null}

                    {lesson.child_lessons?.length > 0 && (
                        <div className="space-y-2">
                            {lesson.child_lessons.map((childLesson: any) => (
                                <MobileChildLesson
                                    key={childLesson.id}
                                    childLesson={childLesson}
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


const MobileUnit = ({ unit, havePurchased, courseId }: {
    unit: any;
    havePurchased: boolean;
    courseId?: number | null;

}) => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box className="mb-2 ml-2">
            <Box
                style={{ background: theme.palette.primary.main }}
                className="rounded-md py-3 px-3 flex items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex-col lg:flex-row flex gap-2 flex-1 min-w-0 mr-2">
                    <span className="text-sm font-semibold text-white truncate">{unit.name}</span>
                    <ResourceCounter item={unit} isWhite />
                </div>
                <CustomCollapseIcon isOpen={isOpen} />
            </Box>

            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box className="p-3 mt-2 rounded-md" sx={{
                    border: `1px solid ${theme.palette.textField.border}`
                }}>
                    <div
                        className="general__content__box mb-3 text-sm"
                        dangerouslySetInnerHTML={{ __html: unit.description }}
                    />

                    {unit?.media?.length ? (
                        <div className="flex flex-col gap-3 mb-3">
                            {unit.media.map((item: CurriculumMediaProps & MediaProps) => (
                                <MediaCard havePurchased={havePurchased} type={item.type} media={item} courseId={courseId} />
                            ))}
                        </div>
                    ) : null}

                    {unit.lessons?.map((lesson: any) => (
                        <MobileLesson
                            key={lesson.id}
                            lesson={lesson}
                            havePurchased={havePurchased}
                            courseId={courseId}
                        />
                    ))}
                </Box>
            </Collapse>
        </Box>
    );
};


const MobileChapter = ({ chapter, havePurchased, courseId }: {
    chapter: any;
    havePurchased: boolean;
    courseId?: number | null;

}) => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box className="mb-2 ml-1">
            <Box
                style={{ background: theme.palette.primary.light }}
                className="rounded-md py-3 px-4 flex items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex-col lg:flex-row flex gap-2 flex-1 min-w-0 mr-2">
                    <span className="text-base font-medium truncate">{chapter.name}</span>
                    <ResourceCounter item={chapter} />
                </div>
                <CustomCollapseIcon isOpen={isOpen} />
            </Box>

            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box className="p-4 mt-2 rounded-md" sx={{
                    border: `1px solid ${theme.palette.textField.border}`
                }}>
                    <div
                        className="general__content__box mb-3"
                        dangerouslySetInnerHTML={{ __html: chapter.description }}
                    />

                    {chapter?.media?.length ? (
                        <div className="flex flex-col gap-3 mb-3">
                            {chapter.media.map((item: CurriculumMediaProps & MediaProps) => (
                                <MediaCard havePurchased={havePurchased} type={item.type} media={item} courseId={courseId} />

                            ))}
                        </div>
                    ) : null}

                    {chapter.units?.map((unit: any) => (
                        <MobileUnit
                            key={unit.id}
                            unit={unit}
                            havePurchased={havePurchased}
                            courseId={courseId}
                        />
                    ))}
                </Box>
            </Collapse>
        </Box>
    );
};


const MobileSubject = ({ subject, havePurchased, courseId }: {
    subject: CurriculumProps;
    havePurchased: boolean;
    courseId?: number | null;

}) => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box className="mb-3">
            <Box
                style={{ background: theme.palette.primary.main }}
                className="rounded-md py-3.5 px-4 flex items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-col lg:flex-row gap-3 flex-1 min-w-0 mr-2">
                    <span className="text-base font-semibold text-white truncate">{subject.name}</span>
                    <ResourceCounter item={subject} isWhite />
                </div>
                <CustomCollapseIcon isOpen={isOpen} />
            </Box>

            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box className="p-4 mt-2 rounded-md" sx={{
                    border: `1px solid ${theme.palette.textField.border}`
                }}>
                    {subject.description && (
                        <div
                            className="general__content__box mb-3"
                            dangerouslySetInnerHTML={{ __html: subject.description }}
                        />
                    )}

                    {subject.chapters && subject.chapters.length > 0 ? (
                        subject.chapters.map((chapter: any) => (
                            <MobileChapter
                                key={chapter.id}
                                chapter={chapter}
                                havePurchased={havePurchased}
                                courseId={courseId}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            No chapters available
                        </div>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
};

export default function MobileCurriculum({ data, havePurchased, courseId }: Props) {
    return (
        <div className="space-y-2">
            {data?.map((subject) => (
                <MobileSubject
                    key={subject.id}
                    subject={subject}
                    havePurchased={havePurchased}
                    courseId={Number(courseId)}
                />
            ))}
        </div>
    );
}