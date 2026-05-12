import { Box, Collapse, LinearProgress, Typography, useTheme } from "@mui/material";
import { AudioSquare, Book1, ClipboardText, DocumentText, Video } from "iconsax-reactjs";
import { useState } from "react";
import type {
    CanvasContent,
    CanvasContentProgressEntry,
    CanvasContentType,
    CurriculumNode,
} from "../../../../types/learningCanvas";
import { deriveStatus, findProgress } from "../../../../utils/canvasProgress";

// ─── Icon for each content type ─────────────────────────────────────────────
function ContentTypeIcon({ type, size = 16 }: { type: CanvasContentType; size?: number }) {
    const theme = useTheme();
    switch (type) {
        case "video": return <Video size={size} color={theme.palette.primary.main} variant="Bold" />;
        case "audio": return <AudioSquare size={size} color="#8B5CF6" variant="Bold" />;
        case "note": return <DocumentText size={size} color="#F59E0B" variant="Bold" />;
        case "test":
        case "quiz": return <ClipboardText size={size} color="#0EA5E9" variant="Bold" />;
        case "assignment": return <Book1 size={size} color="#EA580C" variant="Bold" />;
    }
}

function CompletionIndicator({ status }: { status: string }) {
    const theme = useTheme();
    if (status === "completed") {
        return (
            <Box sx={{
                width: 18, height: 18, borderRadius: "50%", bgcolor: "#16A34A",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
                <Typography sx={{ fontSize: 10, color: "#fff", lineHeight: 1 }}>✓</Typography>
            </Box>
        );
    }
    return (
        <Box sx={{
            width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
            border: `2px solid ${status === "in_progress" ? theme.palette.primary.main : theme.palette.divider}`,
            position: "relative", overflow: "hidden",
        }}>
            {status === "in_progress" && (
                <Box sx={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
                    bgcolor: theme.palette.primary.main, opacity: 0.2,
                }} />
            )}
        </Box>
    );
}

// ─── A single content row (clickable) ───────────────────────────────────────
function ContentRow({
    content,
    depth,
    isActive,
    onSelect,
    progressList,
}: {
    content: CanvasContent;
    depth: number;
    isActive: boolean;
    onSelect: (c: CanvasContent) => void;
    progressList: CanvasContentProgressEntry[] | undefined;
}) {
    const theme = useTheme();
    const status = deriveStatus(findProgress(progressList, content.id));
    return (
        <Box
            onClick={() => onSelect(content)}
            sx={{
                display: "flex", alignItems: "center", gap: 1.25,
                px: 2.5, py: 1, pl: 2.5 + depth * 1.5,
                cursor: "pointer",
                bgcolor: isActive ? "action.selected" : "transparent",
                borderLeft: isActive
                    ? `3px solid ${theme.palette.primary.main}`
                    : "3px solid transparent",
                "&:hover": { bgcolor: "action.hover" },
            }}
        >
            <ContentTypeIcon type={content.content_type} size={14} />
            <Typography sx={{
                fontSize: 12, flex: 1, lineHeight: 1.4,
                color: isActive ? "text.primary" : "text.secondary",
                fontWeight: isActive ? 600 : 400,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
                {content.title}
            </Typography>
            <CompletionIndicator status={status} />
        </Box>
    );
}

// ─── Recursive node renderer ────────────────────────────────────────────────
function NodeBranch({
    node,
    depth,
    expanded,
    onToggle,
    activeContentId,
    onContentSelect,
    progressList,
}: {
    node: CurriculumNode;
    depth: number;
    expanded: Set<number>;
    onToggle: (id: number) => void;
    activeContentId: number | null;
    onContentSelect: (c: CanvasContent) => void;
    progressList: CanvasContentProgressEntry[] | undefined;
}) {
    const theme = useTheme();
    const isOpen = expanded.has(node.id);
    const isChapter = node.level === "chapter";

    return (
        <Box sx={{ borderBottom: isChapter ? `1px solid ${theme.palette.divider}` : "none" }}>
            {/* Header row for this node */}
            <Box
                onClick={() => onToggle(node.id)}
                sx={{
                    display: "flex", alignItems: "center", gap: 1.25,
                    px: 2.5, py: isChapter ? 1.5 : 1,
                    pl: 2.5 + depth * 1.5,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                }}
            >
                {/* Order chip — only at chapter level for visual parity with the design */}
                {isChapter ? (
                    <Box sx={{
                        width: 26, height: 26, borderRadius: "8px",
                        bgcolor: "primary.main", color: "primary.contrastText",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}>
                        {node.order}
                    </Box>
                ) : (
                    <Box sx={{ width: 14, flexShrink: 0 }} />
                )}

                <Typography sx={{
                    fontSize: isChapter ? 13 : 12,
                    fontWeight: isChapter ? 600 : 500,
                    flex: 1,
                    color: isChapter ? "text.primary" : "text.secondary",
                }}>
                    {node.name}
                </Typography>

                <Typography sx={{
                    fontSize: 11, color: "text.secondary",
                    transition: "transform 0.2s",
                    transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                }}>
                    ▾
                </Typography>
            </Box>

            <Collapse in={isOpen}>
                {/* Content rows directly attached to this node */}
                {node.contents?.map((c) => (
                    <ContentRow
                        key={c.id}
                        content={c}
                        depth={depth + 1}
                        isActive={activeContentId === c.id}
                        onSelect={onContentSelect}
                        progressList={progressList}
                    />
                ))}

                {/* Nested children */}
                {node.children?.map((child) => (
                    <NodeBranch
                        key={child.id}
                        node={child}
                        depth={depth + 1}
                        expanded={expanded}
                        onToggle={onToggle}
                        activeContentId={activeContentId}
                        onContentSelect={onContentSelect}
                        progressList={progressList}
                    />
                ))}
            </Collapse>
        </Box>
    );
}

// ─── Sidebar shell ──────────────────────────────────────────────────────────
interface CurriculumSidebarProps {
    nodes: CurriculumNode[];
    progressList: CanvasContentProgressEntry[] | undefined;
    progress: number;
    expiresInDays: number | null;
    activeContentId: number | null;
    onContentSelect: (c: CanvasContent) => void;
}

export default function CurriculumSidebar({
    nodes,
    progressList,
    progress,
    expiresInDays,
    activeContentId,
    onContentSelect,
}: CurriculumSidebarProps) {
    const theme = useTheme();

    // Expand every chapter by default; nested levels start collapsed unless they contain the active content.
    const [expanded, setExpanded] = useState<Set<number>>(() => {
        const initial = new Set<number>();
        const seed = (n: CurriculumNode) => {
            if (n.level === "chapter") initial.add(n.id);
            n.children?.forEach(seed);
        };
        nodes.forEach(seed);
        return initial;
    });

    const toggle = (id: number) =>
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    return (
        <Box sx={{
            width: { xs: "100%", md: 320 },
            flexShrink: 0,
            borderRight: `1px solid ${theme.palette.divider}`,
            overflow: "auto",
            maxHeight: { md: "calc(100vh - 140px)" },
            bgcolor: "background.paper",
        }}>
            {/* Progress summary */}
            {expiresInDays !== null && (
                <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Progress</Typography>
                        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Expires</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{progress}% Completed</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{expiresInDays} Days left</Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate" value={progress}
                        sx={{
                            height: 6, borderRadius: 3, bgcolor: "#DCFCE7",
                            "& .MuiLinearProgress-bar": { bgcolor: "#16A34A", borderRadius: 3 },
                        }}
                    />
                </Box>
            )}

            {nodes.map((node) => (
                <NodeBranch
                    key={node.id}
                    node={node}
                    depth={0}
                    expanded={expanded}
                    onToggle={toggle}
                    activeContentId={activeContentId}
                    onContentSelect={onContentSelect}
                    progressList={progressList}
                />
            ))}
        </Box>
    );
}
