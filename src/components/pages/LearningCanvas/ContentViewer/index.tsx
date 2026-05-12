import { Box, Button, CircularProgress, Drawer, IconButton, LinearProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ArrowLeft2, ArrowRight2, Bookmark, HamburgerMenu, Maximize4, TickCircle } from "iconsax-reactjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import {
    useGetCanvasContentsProgressQuery,
    useGetCourseByIdQuery,
    useGetCourseCurriculumByIdQuery,
    useMarkCanvasContentCompleteMutation,
    useSaveCanvasContentProgressMutation,
} from "../../../../services/courseApi";
import type { CanvasContent, CurriculumNode } from "../../../../types/learningCanvas";
import { canMarkComplete, COMPLETION_THRESHOLD_PERCENT, computeCourseProgress, findProgress } from "../../../../utils/canvasProgress";
import { renderHtml } from "../../../../utils/renderHtml";
import AudioPlayer from "../../../molecules/MediaPlayer/AudioPlayer";
import NotesViewer from "../../../molecules/MediaPlayer/NotesViewer";
import VideoPlayer from "../../../molecules/MediaPlayer/VideoPlayer";
import CurriculumSidebar from "./CurriculumSidebar";
import { transformCurriculum } from "./transformCurriculum";

// ─── Flatten nodes → ordered list of content rows (depth-first) ─────────────
function flattenContents(nodes: CurriculumNode[]): CanvasContent[] {
    const out: CanvasContent[] = [];
    const walk = (n: CurriculumNode) => {
        n.contents?.forEach((c) => out.push(c));
        n.children?.forEach(walk);
    };
    nodes.forEach(walk);
    return out;
}

/** Find the parent node that owns the given content id — used for description / breadcrumbs. */
function findOwningNode(nodes: CurriculumNode[], contentId: number): CurriculumNode | null {
    for (const n of nodes) {
        if (n.contents?.some((c) => c.id === contentId)) return n;
        if (n.children) {
            const inner = findOwningNode(n.children, contentId);
            if (inner) return inner;
        }
    }
    return null;
}

// ─── Description block (CK editor HTML) ─────────────────────────────────────
function DescriptionBlock({ html }: { html: string }) {
    const theme = useTheme();
    return (
        <Box
            className="general__content__box styled__list"
            sx={{
                mt: 3,
                p: 2.5,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
            }}
        >
            {renderHtml(html)}
        </Box>
    );
}

// ─── Test / Assignment cards ────────────────────────────────────────────────
function TestInfoCard({ item, courseId }: { item: CanvasContent; courseId: number }) {
    const navigate = useNavigate();
    const theme = useTheme();
    const minutes = item.duration_minutes ?? 0;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const durationLabel = hours > 0 ? `${hours}Hr ${mins} Mins` : `${mins} Mins`;
    return (
        <Box sx={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${theme.palette.divider}`, mb: 3 }}>
            <Box sx={{ bgcolor: "primary.main", px: 3, py: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 15, color: "primary.contrastText" }}>{item.title}</Typography>
            </Box>
            <Box sx={{ px: 3, py: 2.5, display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                <Box>
                    <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.5 }}>Duration</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{durationLabel}</Typography>
                </Box>
                <Box sx={{ ml: "auto" }}>
                    <Button
                        variant="contained" size="small"
                        onClick={() => navigate(
                            PATH.COURSE_MANAGEMENT.COURSES.VIEW_TEST.ROOT({
                                courseId,
                                testId: item.reference_id,
                            })
                        )}
                        sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
                    >
                        Start Test
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

function AssignmentInfoCard({ item, courseId }: { item: CanvasContent; courseId: number }) {
    const navigate = useNavigate();
    const theme = useTheme();
    return (
        <Box sx={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${theme.palette.divider}`, mb: 3 }}>
            <Box sx={{ bgcolor: "primary.main", px: 3, py: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 15, color: "primary.contrastText" }}>{item.title}</Typography>
            </Box>
            <Box sx={{ px: 3, py: 2.5, display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                <Box sx={{ ml: "auto" }}>
                    <Button
                        variant="contained" size="small"
                        onClick={() => navigate(PATH.LEARNING_CANVAS.ASSIGNMENT.ROOT(courseId, item.reference_id))}
                        sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
                    >
                        Start
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

// ─── Main Content Viewer ─────────────────────────────────────────────────────
export default function ContentViewer() {
    const { courseId, contentId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
    const numCourseId = Number(courseId);
    const contentPanelRef = useRef<HTMLDivElement | null>(null);

    const { data: courseData } = useGetCourseByIdQuery({ id: numCourseId });
    const { data: curriculumApi, isFetching: loadingCurriculum } = useGetCourseCurriculumByIdQuery(
        { id: numCourseId, pageIndex: 1, pageSize: 50 },
        { skip: !numCourseId }
    );
    const { data: progressApi } = useGetCanvasContentsProgressQuery(
        { courseId: numCourseId },
        { skip: !numCourseId }
    );

    const [saveProgress] = useSaveCanvasContentProgressMutation();
    const [markComplete, { isLoading: marking }] = useMarkCanvasContentCompleteMutation();

    const course = courseData?.data;
    const nodes = useMemo(
        () => transformCurriculum(curriculumApi?.data?.data),
        [curriculumApi]
    );
    const progressList = progressApi?.data?.data;

    const orderedContents = useMemo(() => flattenContents(nodes), [nodes]);
    const courseProgress = useMemo(() => computeCourseProgress(progressList, nodes), [progressList, nodes]);

    const [activeItem, setActiveItem] = useState<CanvasContent | null>(null);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Pick the active item once curriculum data lands (or contentId in URL changes)
    useEffect(() => {
        if (!orderedContents.length) return;
        const numContentId = Number(contentId);
        const fromUrl = orderedContents.find((c) => c.id === numContentId);
        setActiveItem(fromUrl ?? orderedContents[0]);
    }, [orderedContents, contentId]);

    const currentIndex = orderedContents.findIndex((c) => c.id === activeItem?.id);
    const owningNode = activeItem ? findOwningNode(nodes, activeItem.id) : null;
    const activeProgress = activeItem ? findProgress(progressList, activeItem.id) : null;

    const handleContentSelect = useCallback((c: CanvasContent) => {
        setActiveItem(c);
        setMobileSidebarOpen(false);
        navigate(PATH.LEARNING_CANVAS.CONTENT_VIEWER.ROOT(numCourseId, c.id), { replace: true });
    }, [numCourseId, navigate]);

    const handlePrev = () => { if (currentIndex > 0) handleContentSelect(orderedContents[currentIndex - 1]); };
    const handleNext = () => { if (currentIndex < orderedContents.length - 1) handleContentSelect(orderedContents[currentIndex + 1]); };

    const handleFullscreen = () => {
        const el = contentPanelRef.current;
        if (!el) return;
        if (document.fullscreenElement) document.exitFullscreen();
        else el.requestFullscreen?.();
    };

    // ─── Persist progress ticks from media players ─────────────────────────
    const handleProgressTick = useCallback((percent: number, position: number) => {
        if (!activeItem) return;
        // Cap percent at 100 to keep server data sane
        const cappedPercent = Math.min(100, Math.max(0, percent));
        saveProgress({
            courseId: numCourseId,
            body: {
                content_id: activeItem.id,
                content_type: activeItem.content_type,
                position: Math.floor(position),
                percent: Math.floor(cappedPercent),
            },
        });
    }, [activeItem, numCourseId, saveProgress]);

    // ─── Mark complete + auto-advance ──────────────────────────────────────
    const eligibleForComplete = activeItem ? canMarkComplete(activeItem.content_type, activeProgress) : false;

    const handleMarkComplete = async () => {
        if (!activeItem || !eligibleForComplete) return;
        try {
            await markComplete({
                courseId: numCourseId,
                body: {
                    content_id: activeItem.id,
                    content_type: activeItem.content_type,
                },
            }).unwrap();
        } catch {
            // Best-effort — keep moving even if backend is offline
        }
        // Auto-advance once the action settles
        if (currentIndex < orderedContents.length - 1) {
            handleContentSelect(orderedContents[currentIndex + 1]);
        }
    };

    // ─── Content header (uses activeProgress to enable Mark Complete) ─────
    const renderContentHeader = (item: CanvasContent) => {
        const isGatedMedia = item.content_type === "audio";
        const watched = activeProgress?.percent ?? 0;
        const isCompleted = !!activeProgress?.completed;
        return (
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1 }}>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }} noWrap>{item.title}</Typography>
                    {isGatedMedia && !isCompleted && (
                        <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.25 }}>
                            {Math.floor(watched)}% listened — reach {COMPLETION_THRESHOLD_PERCENT}% to mark complete
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ cursor: "pointer", p: 0.5, borderRadius: 1, "&:hover": { bgcolor: "action.hover" } }}>
                        <Bookmark size={20} color={theme.palette.text.secondary} />
                    </Box>
                    <Button
                        variant={isCompleted ? "contained" : "outlined"}
                        color={isCompleted ? "success" : "primary"}
                        size="small"
                        disabled={!eligibleForComplete || marking || isCompleted}
                        onClick={handleMarkComplete}
                        startIcon={isCompleted ? <TickCircle size={16} variant="Bold" /> : <Typography sx={{ fontSize: 14 }}>✓</Typography>}
                        sx={{ textTransform: "none", borderRadius: 2, fontSize: 13 }}
                    >
                        {isCompleted ? "Completed" : marking ? "Marking…" : "Mark as Completed"}
                    </Button>
                </Box>
            </Box>
        );
    };

    // ─── Body renderer ─────────────────────────────────────────────────────
    const renderContent = () => {
        if (loadingCurriculum) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <CircularProgress />
                </Box>
            );
        }
        if (!activeItem) {
            return (
                <Typography sx={{ color: "text.secondary", textAlign: "center", py: 8 }}>
                    Select a content item from the sidebar.
                </Typography>
            );
        }

        const initialPosition = activeProgress?.position ?? 0;

        const mediaEl = (() => {
            switch (activeItem.content_type) {
                case "video":
                    return activeItem.url
                        ? <VideoPlayer
                            key={activeItem.id}
                            src={activeItem.url}
                            initialPosition={initialPosition}
                            onProgressTick={handleProgressTick}
                        />
                        : <FallbackBox label="No video URL available for this lesson." />;
                case "audio":
                    return activeItem.url
                        ? <AudioPlayer
                            key={activeItem.id}
                            src={activeItem.url}
                            title={activeItem.title}
                            initialPosition={initialPosition}
                            onProgressTick={handleProgressTick}
                        />
                        : <FallbackBox label="No audio URL available for this lesson." />;
                case "note":
                    return activeItem.url
                        ? <NotesViewer key={activeItem.id} src={activeItem.url} />
                        : <FallbackBox label="No PDF URL available for this lesson." />;
                case "test":
                case "quiz":
                    return <TestInfoCard item={activeItem} courseId={numCourseId} />;
                case "assignment":
                    return <AssignmentInfoCard item={activeItem} courseId={numCourseId} />;
                default:
                    return null;
            }
        })();

        return (
            <Box>
                {renderContentHeader(activeItem)}
                {mediaEl}
                {owningNode?.description && <DescriptionBlock html={owningNode.description} />}
            </Box>
        );
    };

    return (
        <div className="h-full overflow-hidden flex flex-col">
            {/* Header */}
            <Box sx={{ px: { xs: 2, md: 3 }, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Box
                    onClick={() => navigate(PATH.LEARNING_CANVAS.ROOT)}
                    sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1, cursor: "pointer", width: "fit-content" }}
                >
                    <ArrowLeft2 size={14} color={theme.palette.text.secondary} />
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Back to Learning Canvas</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, flexWrap: { xs: "wrap", md: "nowrap" } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1 }}>
                        {!isDesktop && (
                            <IconButton size="small" onClick={() => setMobileSidebarOpen(true)}>
                                <HamburgerMenu size={20} />
                            </IconButton>
                        )}
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 16, md: 20 } }} noWrap>
                            {course?.name || "Course"}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2.5 } }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography sx={{ fontSize: 12, color: "text.secondary", display: { xs: "none", sm: "inline" } }}>Progress</Typography>
                            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{courseProgress.percent}%</Typography>
                            <Box sx={{ width: { xs: 60, md: 100 } }}>
                                <LinearProgress variant="determinate" value={courseProgress.percent} sx={{
                                    height: 6, borderRadius: 3, bgcolor: "#DCFCE7",
                                    "& .MuiLinearProgress-bar": { bgcolor: "#16A34A", borderRadius: 3 },
                                }} />
                            </Box>
                        </Box>
                        <Button
                            variant="contained" size="small"
                            startIcon={<Maximize4 size={16} />}
                            onClick={handleFullscreen}
                            sx={{ textTransform: "none", borderRadius: 2, px: 2, display: { xs: "none", sm: "inline-flex" } }}
                        >
                            Full Screen
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
                {isDesktop ? (
                    <CurriculumSidebar
                        nodes={nodes}
                        progressList={progressList}
                        progress={courseProgress.percent}
                        expiresInDays={32}
                        activeContentId={activeItem?.id ?? null}
                        onContentSelect={handleContentSelect}
                    />
                ) : (
                    <Drawer
                        anchor="left"
                        open={mobileSidebarOpen}
                        onClose={() => setMobileSidebarOpen(false)}
                        slotProps={{ paper: { sx: { width: "85%", maxWidth: 360 } } }}
                    >
                        <CurriculumSidebar
                            nodes={nodes}
                            progressList={progressList}
                            progress={courseProgress.percent}
                            expiresInDays={32}
                            activeContentId={activeItem?.id ?? null}
                            onContentSelect={handleContentSelect}
                        />
                    </Drawer>
                )}

                <Box ref={contentPanelRef} sx={{ flex: 1, overflow: "auto", p: { xs: 2, md: 3 }, bgcolor: "background.default" }}>
                    {renderContent()}

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, pt: 3 }}>
                        {currentIndex > 0 ? (
                            <Button
                                variant="outlined" onClick={handlePrev}
                                startIcon={<ArrowLeft2 size={16} />}
                                sx={{ textTransform: "none", borderRadius: 2, px: 2.5 }}
                            >
                                Previous Content
                            </Button>
                        ) : <Box />}
                        {currentIndex < orderedContents.length - 1 ? (
                            <Button
                                variant="contained" onClick={handleNext}
                                endIcon={<ArrowRight2 size={16} />}
                                sx={{ textTransform: "none", borderRadius: 2, px: 2.5 }}
                            >
                                Next Content
                            </Button>
                        ) : <Box />}
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

// ─── Small helper for missing-URL states ────────────────────────────────────
function FallbackBox({ label }: { label: string }) {
    const theme = useTheme();
    return (
        <Box sx={{
            width: "100%", minHeight: 200, bgcolor: "background.paper",
            borderRadius: 2, border: `1px dashed ${theme.palette.divider}`,
            display: "flex", alignItems: "center", justifyContent: "center", p: 4,
        }}>
            <Typography sx={{ color: "text.secondary", fontSize: 13 }}>{label}</Typography>
        </Box>
    );
}
