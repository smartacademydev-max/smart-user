import { useId, useRef, useState } from "react";
import { Autocomplete, Box, Button, Divider, IconButton, TextField, Tooltip, Typography, useTheme, type Theme } from "@mui/material";
import { CHOICE_GROUP_COLORS, GROUPED_TYPES, MULTI_SELECT_TYPES, type Answers, type OptionProps, type QuestionProps } from "../../../../types/question";
import { renderHtml } from "../../../../utils/renderHtml";
import { splitOnGaps } from "../../../../utils/questionText";
import { useQuizTokens } from "./quizTokens";

interface Props {
    currentQuestion: QuestionProps | null;
    /** Zero-based position in the paper, for the "Question 4" meta line. */
    questionIndex?: number;
    setAttendedQuestion: (newValue: Answers) => void;
    attendedQuestion: Answers[];
    disabled?: boolean;
}

export default function QuestionView({ currentQuestion, questionIndex = 0, setAttendedQuestion, attendedQuestion, disabled = false }: Props) {
    const theme = useTheme();
    const t = useQuizTokens();
    /** One radio group per question, so moving between questions never leaves
     *  two options sharing a name and cancelling each other out. */
    const fieldName = useId();

    // Highlight tool state: which coloured category the next selection marks
    // with. Only asked for when a question offers more than one.
    const passageRef = useRef<HTMLDivElement>(null);
    const [activeHighlightType, setActiveHighlightType] = useState("");
    /** Drag into text: the gap awaiting a choice, when answering by tapping. */
    const [activeGap, setActiveGap] = useState<number | null>(null);
    /** The choice currently being dragged, and the gap hovered under it. */
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [dragOverGap, setDragOverGap] = useState<number | null>(null);
    /** Bow-tie: the drop area hovered under a dragged tile. */
    const [dragOverZone, setDragOverZone] = useState<string | null>(null);

    const currentAnswer = attendedQuestion.find(
        (ans) => ans.question_id === currentQuestion?.id
    );

    const questionType = currentQuestion?.question_type ?? "mcq";
    const isMatrix = questionType === "matrix";
    const isCloze = questionType === "cloze";
    const isHighlight = questionType === "highlight";
    const isBowTie = questionType === "bow_tie";
    const isDragIntoText = questionType === "drag_into_text";
    // Matrix, cloze and bow-tie each render in a shape of their own.
    const isGrouped = GROUPED_TYPES.includes(questionType) && !isMatrix && !isCloze && !isBowTie;
    const isOrdered = questionType === "drag_drop";
    const isMultiSelect = MULTI_SELECT_TYPES.includes(questionType) && !isGrouped && !isOrdered && !isHighlight && !isDragIntoText;

    const selectedOptionId = currentAnswer?.option_id;
    const selectedIds = currentAnswer?.selected_option_ids ?? [];
    const groupAnswers = currentAnswer?.group_answers ?? {};
    const gapAnswers = currentAnswer?.gap_answers ?? {};

    /**
     * Drag into text: the student picks a gap, then a choice. A choice already
     * placed elsewhere moves rather than duplicating, unless it is marked
     * unlimited — those may fill any number of gaps.
     */
    const placeInGap = (gap: number, optionId: number) => {
        const unlimited = currentQuestion?.unlimited_choices ?? [];
        const next: Record<number, number> = { ...gapAnswers };

        if (next[gap] === optionId) {
            delete next[gap];
            emit({ gap_answers: next });
            return;
        }

        /**
         * A choice can only sit in one gap unless it is marked unlimited, so
         * placing it again moves it. When the gap it came from is a different
         * one, that gap silently empties — which reads as an answer being lost,
         * so the two are swapped instead: the displaced gap takes whatever was
         * in the destination.
         */
        if (!unlimited.includes(optionId)) {
            const previousGap = Object.keys(next).find(
                (key) => next[Number(key)] === optionId
            );

            if (previousGap !== undefined && Number(previousGap) !== gap) {
                const displaced = next[gap];

                delete next[Number(previousGap)];

                if (displaced !== undefined) {
                    next[Number(previousGap)] = displaced;
                }
            }
        }

        next[gap] = optionId;
        emit({ gap_answers: next });
    };

    /**
     * Native HTML5 drag and drop. It costs no dependency, but it never fires on
     * touch devices — so tapping a gap and then a choice stays supported
     * alongside it rather than being replaced by it.
     */
    const dragProps = (optionId: number) => ({
        draggable: !disabled,
        onDragStart: (event: React.DragEvent) => {
            setDraggingId(optionId);
            event.dataTransfer.effectAllowed = "move";
            // Firefox ignores a drag that carries no payload.
            event.dataTransfer.setData("text/plain", String(optionId));
        },
        onDragEnd: () => {
            setDraggingId(null);
            setDragOverGap(null);
        }
    });

    const gapDropProps = (gap: number) => ({
        onDragOver: (event: React.DragEvent) => {
            if (disabled) return;
            // Without this the browser refuses the drop.
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
            setDragOverGap(gap);
        },
        onDragLeave: () => setDragOverGap((current) => (current === gap ? null : current)),
        onDrop: (event: React.DragEvent) => {
            if (disabled) return;
            event.preventDefault();

            const dropped = Number(event.dataTransfer.getData("text/plain")) || draggingId;

            /**
             * Dropping a choice back on the gap it already occupies is a
             * no-op. Routing it through placeInGap would toggle it out, so a
             * drag that goes nowhere would silently clear the answer.
             */
            if (dropped && gapAnswers[gap] !== dropped) {
                placeInGap(gap, dropped);
            }

            setDraggingId(null);
            setDragOverGap(null);
            setActiveGap(null);
        }
    });

    /** Drag and drop starts in the order served and is rearranged in place. */
    const orderedIds = currentAnswer?.ordered_option_ids
        ?? (currentQuestion?.options.map((o) => o.id).filter((id): id is number => id !== null) ?? []);

    const emit = (patch: Partial<Answers>) => {
        if (!currentQuestion?.id || disabled) return;
        setAttendedQuestion({
            question_id: currentQuestion.id,
            option_id: null,
            ...patch
        });
    };

    const handleSingle = (optionId: number) => emit({ option_id: optionId });

    const handleToggle = (optionId: number) => {
        const next = selectedIds.includes(optionId)
            ? selectedIds.filter((id) => id !== optionId)
            : [...selectedIds, optionId];

        emit({ selected_option_ids: next });
    };

    /** One decision per row / blank / zone. */
    const handleGroupPick = (groupKey: string, optionId: number) =>
        emit({ group_answers: { ...groupAnswers, [groupKey]: [optionId] } });

    /**
     * A bow-tie zone holds as many tiles as it has drop areas, so tapping a
     * tile adds or removes it rather than replacing the zone's answer. Once the
     * zone is full the oldest tile makes way, which is what dragging a further
     * tile onto a full drop area does.
     */
    const toggleBowTieTile = (zoneKey: string, optionId: number, capacity: number) => {
        const current = groupAnswers[zoneKey] ?? [];

        if (current.includes(optionId)) {
            emit({
                group_answers: {
                    ...groupAnswers,
                    [zoneKey]: current.filter((id) => id !== optionId)
                }
            });
            return;
        }

        const next = [...current, optionId].slice(-Math.max(1, capacity));
        emit({ group_answers: { ...groupAnswers, [zoneKey]: next } });
    };

    /**
     * A matrix cell is the option in that row whose text matches the column
     * label — the backend generates exactly one option per row×column pair.
     */
    const optionIdFor = (rowKey: string, column: { key: string; label?: string | null }): number | null => {
        const label = column.label || column.key;
        const match = currentQuestion?.options.find(
            (o) => o.group_key === rowKey && o.option === label
        );

        return match?.id ?? null;
    };

    /** Matrix rows that accept more than one answer. */
    const toggleCell = (rowKey: string, optionId: number) => {
        const current = groupAnswers[rowKey] ?? [];
        const next = current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : [...current, optionId];

        emit({ group_answers: { ...groupAnswers, [rowKey]: next } });
    };

    /**
     * Question and option text are stored as HTML. An inline cloze splits the
     * sentence around its markers, and a dropdown label has to be a plain
     * string, so both need the tags removed rather than rendered.
     */
    const stripHtml = (html: string): string => {
        const el = document.createElement("div");
        el.innerHTML = html ?? "";

        return (el.textContent ?? "").trim();
    };

    /** An inline cloze prints the sentence itself, so the header would repeat it. */
    /**
     * Formats that re-render the question text as part of answering it hide the
     * plain stem, so the sentence is not shown twice — once inert with its
     * markers exposed, once interactive.
     */
    const hidesQuestionText =
        (isCloze && Boolean(currentQuestion?.has_inline_blanks)) || isDragIntoText;

    const moveOrdered = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= orderedIds.length) return;

        const next = [...orderedIds];
        [next[index], next[target]] = [next[target], next[index]];
        emit({ ordered_option_ids: next });
    };

    /**
     * One answer row, in whichever shape the format needs it. The lettered
     * circle doubles as the control: it becomes a filled tick when chosen, so
     * the row reads the same whether the format takes one answer or several.
     *
     * The real input is still in the DOM, only visually hidden — it is what
     * makes arrow keys, the space bar and screen readers behave the way a
     * student expects, which a styled `div` alone would not.
     */
    const optionBox = (
        option: OptionProps,
        isSelected: boolean,
        onPick: () => void,
        index: number,
        multiple: boolean,
        groupName: string = fieldName
    ) => (
        <Box
            component="label"
            key={option.id}
            className="flex items-start gap-3.5 rounded-xl px-4 py-3.5"
            sx={{
                cursor: disabled ? "not-allowed" : "pointer",
                border: "1px solid",
                borderColor: isSelected ? t.primary : t.border,
                backgroundColor: isSelected ? t.primarySoft : t.surface,
                transition: "border-color .15s ease, background-color .15s ease",
                opacity: disabled ? 0.6 : 1,
                pointerEvents: disabled ? "none" : "auto",
                "&:hover": { borderColor: isSelected ? t.primary : t.borderStrong }
            }}
        >
            <input
                type={multiple ? "checkbox" : "radio"}
                name={groupName}
                className="sr-only"
                checked={isSelected}
                disabled={disabled}
                onChange={onPick}
            />

            <Box
                aria-hidden
                className="flex shrink-0 items-center justify-center rounded-full"
                sx={{
                    mt: "2px",
                    width: 22,
                    height: 22,
                    fontSize: 10.5,
                    fontWeight: 700,
                    border: "1px solid",
                    borderColor: isSelected ? t.primary : t.borderStrong,
                    backgroundColor: isSelected ? t.primary : t.surface,
                    color: isSelected ? t.primaryForeground : t.muted,
                    transition: "border-color .15s ease, background-color .15s ease, color .15s ease"
                }}
            >
                {isSelected ? (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path d="M2.5 6.3 4.8 8.6 9.5 3.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    String.fromCharCode(65 + index)
                )}
            </Box>

            <Box
                className="general__content__box option_image min-w-0 flex-1"
                // general__content__box gives every <p> a 0.75rem vertical margin;
                // inside a one-line option that pushes the text off the circle's
                // centre line.
                sx={{ "& p, & ul, & ol": { margin: 0 } }}
            >
                <Typography fontSize={14.5} lineHeight={1.65} color="text.dark" className="mt-0!">
                    {renderHtml(option.option)}
                </Typography>
            </Box>
        </Box>
    );

    /** Images need room to breathe, so they pair up; text answers read better
     *  as one full-width column. */
    const optionListClass = currentQuestion?.has_image_in_option
        ? "grid gap-3 md:grid-cols-2"
        : "flex flex-col gap-2.5";

    const renderBody = () => {
        if (!currentQuestion?.options) return null;

        /**
         * Highlight: the student drags across the passage to mark spans, so the
         * answer is character ranges rather than option ids.
         */
        if (isHighlight) {
            const passage = currentQuestion.passage ?? "";
            const types = currentQuestion.highlight_types ?? [];
            // Falls back to the first type so the very first selection is never
            // saved with an empty type, which would grade as wrong.
            const activeType = activeHighlightType || types[0]?.key || "default";
            const spans = currentAnswer?.spans ?? [];
            const colorFor = (key: string) =>
                types.find((t) => t.key === key)?.color ?? "#FDE047";

            const markSelection = () => {
                const selection = window.getSelection();
                if (!selection || selection.isCollapsed || !passageRef.current || disabled) return;

                const range = selection.getRangeAt(0);
                if (!passageRef.current.contains(range.commonAncestorContainer)) return;

                const before = range.cloneRange();
                before.selectNodeContents(passageRef.current);
                before.setEnd(range.startContainer, range.startOffset);

                const start = before.toString().length;
                const end = start + range.toString().length;
                if (end <= start) return;

                /**
                 * Dragging back across a mark of the type being applied takes it
                 * off again — which is the whole of what an eraser mode did, so
                 * there is no eraser to switch into. Anything the selection
                 * overlaps is dropped either way, so the same words never end up
                 * carrying two conflicting highlights.
                 */
                const overlapping = spans.filter((sp) => sp.end > start && sp.start < end);
                const undoing =
                    overlapping.length > 0 && overlapping.every((sp) => sp.type === activeType);
                const kept = spans.filter((sp) => sp.end <= start || sp.start >= end);

                emit({
                    spans: undoing
                        ? kept
                        : [...kept, { type: activeType, start, end }].sort((a, b) => a.start - b.start)
                });
                selection.removeAllRanges();
            };

            const pieces: React.ReactNode[] = [];
            let cursor = 0;
            [...spans].sort((a, b) => a.start - b.start).forEach((span, i) => {
                if (span.start > cursor) {
                    pieces.push(<span key={`t-${i}`}>{passage.slice(cursor, span.start)}</span>);
                }
                pieces.push(
                    <mark
                        key={`m-${i}`}
                        style={{ background: colorFor(span.type), borderRadius: 3, padding: "1px 2px" }}
                    >
                        {passage.slice(span.start, span.end)}
                    </mark>
                );
                cursor = span.end;
            });
            if (cursor < passage.length) {
                pieces.push(<span key="tail">{passage.slice(cursor)}</span>);
            }

            return (
                <div className="flex flex-col gap-3">
                    {/* One category is no choice at all, so it is not offered as
                        one — these only appear when there is something to pick
                        between. */}
                    {types.length > 1 && (
                        <div className="flex items-center gap-2 flex-wrap">
                            {types.map((type) => (
                                <Button
                                    key={type.key}
                                    size="small"
                                    variant={activeType === type.key ? "contained" : "outlined"}
                                    disabled={disabled}
                                    onClick={() => setActiveHighlightType(type.key)}
                                    sx={{
                                        background: activeType === type.key ? type.color : undefined,
                                        borderColor: type.color,
                                        color: activeType === type.key ? "#111" : undefined
                                    }}
                                >
                                    {type.label || type.key}
                                </Button>
                            ))}
                        </div>
                    )}

                    <Box
                        className="overflow-hidden rounded-xl"
                        sx={{
                            border: "1px solid",
                            borderColor: t.border,
                            backgroundColor: t.surface,
                            opacity: disabled ? 0.6 : 1
                        }}
                    >
                        {/* Only the passage may be inside this ref: the character
                            offsets a highlight is saved as are counted from its
                            text content, so a stray label would shift every span. */}
                        <Box
                            ref={passageRef}
                            onMouseUp={markSelection}
                            className="p-3.5 leading-relaxed"
                            sx={{
                                whiteSpace: "pre-wrap",
                                userSelect: disabled ? "none" : "text"
                            }}
                        >
                            {pieces}
                        </Box>

                        {/* Clear belongs to the passage, so it sits on it rather
                            than floating above the question. The strip is always
                            rendered and the button only hidden within it — kept
                            conditional, it appeared on the first highlight and
                            pushed the whole passage down the page. */}
                        <Box
                            className="flex items-center justify-between gap-3 px-3.5 py-1.5"
                            sx={{
                                borderTop: "1px solid",
                                borderColor: t.border,
                                backgroundColor: t.surfaceMuted
                            }}
                        >
                            <Typography fontSize={11.5} sx={{ color: t.muted }}>
                                {spans.length
                                    ? `${spans.length} highlighted`
                                    : "Select text to highlight it"}
                            </Typography>

                            <Button
                                size="small"
                                color="error"
                                disabled={disabled}
                                onClick={() => emit({ spans: [] })}
                                tabIndex={spans.length ? 0 : -1}
                                aria-hidden={spans.length ? undefined : true}
                                sx={{
                                    minWidth: 0,
                                    px: 1,
                                    py: 0.25,
                                    fontSize: 12.5,
                                    fontWeight: 600,
                                    visibility: spans.length ? "visible" : "hidden"
                                }}
                            >
                                Clear all
                            </Button>
                        </Box>
                    </Box>
                </div>
            );
        }

        /**
         * A matrix reuses one answer scale across every row, so it renders as
         * a grid with the column headers stated once — not as a stack of
         * separate questions.
         */
        if (isMatrix) {
            const rows = currentQuestion.groups ?? [];
            const columns = currentQuestion.columns ?? [];
            const multiplePerRow = Boolean(currentQuestion.multiple_per_row);

            const pickCell = (rowKey: string, optionId: number) =>
                multiplePerRow ? toggleCell(rowKey, optionId) : handleGroupPick(rowKey, optionId);

            return (
                <Box
                    className="w-full overflow-x-auto rounded-xl"
                    sx={{ border: "1px solid", borderColor: t.border }}
                >
                    <Box component="table" className="w-full border-collapse" sx={{ minWidth: 520 }}>
                        <Box component="thead" sx={{ backgroundColor: t.surfaceMuted }}>
                            <tr>
                                <Box
                                    component="th"
                                    className="p-3 text-left"
                                    sx={{ minWidth: 180, borderBottom: "1px solid", borderColor: t.border }}
                                />
                                {columns.map((column) => (
                                    <Box
                                        component="th"
                                        key={column.key}
                                        className="p-3 text-center"
                                        sx={{
                                            minWidth: 110,
                                            borderBottom: "1px solid",
                                            borderLeft: "1px solid",
                                            borderColor: t.border
                                        }}
                                    >
                                        <Typography fontSize={12.5} fontWeight={700} sx={{ color: t.foreground }}>
                                            {column.label || column.key}
                                        </Typography>
                                    </Box>
                                ))}
                            </tr>
                        </Box>
                        <tbody>
                            {rows.map((row, index) => {
                                const picked = groupAnswers[row.key] ?? [];

                                return (
                                    <Box
                                        component="tr"
                                        key={row.key}
                                        // Zebra striping, as in a printed answer grid, so the
                                        // eye can follow a row across to the right column.
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? "transparent" : t.surfaceMuted
                                        }}
                                    >
                                        <Box
                                            component="td"
                                            className="p-3"
                                            sx={{ borderTop: "1px solid", borderColor: t.border }}
                                        >
                                            <Typography fontSize={14} sx={{ color: t.foreground }}>
                                                {row.label || row.key}
                                            </Typography>
                                        </Box>
                                        {columns.map((column) => {
                                            const optionId = optionIdFor(row.key, column);
                                            const checked = optionId !== null && picked.includes(optionId);
                                            const selectable = !disabled && optionId !== null;

                                            /**
                                             * The whole cell is the target, not just the
                                             * control sitting in it — a grid of small radios
                                             * is a miserable thing to hit, especially on a
                                             * phone. The control stays as the state's
                                             * visual, and the cell carries the role and the
                                             * keyboard handling in its place.
                                             */
                                            return (
                                                <Box
                                                    component="td"
                                                    key={column.key}
                                                    role={multiplePerRow ? "checkbox" : "radio"}
                                                    aria-checked={checked}
                                                    aria-label={`${row.label || row.key}: ${column.label || column.key}`}
                                                    aria-disabled={!selectable}
                                                    tabIndex={selectable ? 0 : -1}
                                                    onClick={() => selectable && optionId !== null && pickCell(row.key, optionId)}
                                                    onKeyDown={(event: React.KeyboardEvent) => {
                                                        if (!selectable || optionId === null) return;
                                                        if (event.key !== " " && event.key !== "Enter") return;
                                                        // Space would otherwise scroll the page out
                                                        // from under the student mid-answer.
                                                        event.preventDefault();
                                                        pickCell(row.key, optionId);
                                                    }}
                                                    className="p-3 text-center"
                                                    sx={{
                                                        borderTop: "1px solid",
                                                        borderLeft: "1px solid",
                                                        borderColor: t.border,
                                                        cursor: selectable ? "pointer" : "not-allowed",
                                                        backgroundColor: checked ? t.primarySoft : "transparent",
                                                        transition: "background-color .15s ease",
                                                        opacity: disabled ? 0.6 : 1,
                                                        outlineOffset: "-2px",
                                                        "&:hover": {
                                                            backgroundColor: checked
                                                                ? t.primarySoft
                                                                : selectable ? theme.palette.action.hover : "transparent"
                                                        },
                                                        "&:focus-visible": { outline: `2px solid ${t.primary}` }
                                                    }}
                                                >
                                                    {/*
                                                      * The same filled circle and tick an option row
                                                      * uses when it is chosen, so one answer looks
                                                      * like an answer wherever it is given. Always
                                                      * laid out and only filled when checked, so
                                                      * working down a column never changes the row
                                                      * heights under the cursor. The cell carries the
                                                      * click and the ARIA state; this is the picture
                                                      * of it.
                                                      */}
                                                    <Box
                                                        aria-hidden
                                                        className="mx-auto flex items-center justify-center rounded-full"
                                                        sx={{
                                                            width: 22,
                                                            height: 22,
                                                            border: "1px solid",
                                                            borderColor: checked ? t.primary : t.border,
                                                            backgroundColor: checked ? t.primary : t.surface,
                                                            color: t.primaryForeground,
                                                            transition: "background-color .15s ease, border-color .15s ease"
                                                        }}
                                                    >
                                                        {checked && (
                                                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                                                                <path
                                                                    d="M2.5 6.3 4.8 8.6 9.5 3.9"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.8"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        )}
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                );
                            })}
                        </tbody>
                    </Box>
                </Box>
            );
        }

        /**
         * Cloze renders as searchable dropdowns. When the question text carries
         * a blank's marker the dropdown is placed in the sentence; otherwise
         * the blanks are listed beneath it.
         */
        if (isCloze) {
            const blanks = currentQuestion.groups ?? [];

            const dropdownFor = (blank: { key: string; label?: string | null }) => {
                const blankOptions = currentQuestion.options.filter((o) => o.group_key === blank.key);
                const pickedId = groupAnswers[blank.key]?.[0];
                const picked = blankOptions.find((o) => o.id === pickedId) ?? null;

                return (
                    <Autocomplete
                        size="small"
                        disabled={disabled}
                        options={blankOptions}
                        value={picked}
                        getOptionLabel={(option) => stripHtml(option.option)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(_, option) => option?.id != null && handleGroupPick(blank.key, option.id)}
                        sx={{ minWidth: 220, display: "inline-flex", verticalAlign: "middle" }}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Search here..." />
                        )}
                    />
                );
            };

            if (currentQuestion.has_inline_blanks) {
                // Split the sentence on each marker and drop the dropdown in.
                const pattern = new RegExp(`(${blanks.map((b) => `\\{\\{${b.key}\\}\\}`).join("|")})`, "g");
                const pieces = stripHtml(currentQuestion.question).split(pattern).filter((p) => p !== "");

                return (
                    <div className="flex flex-wrap items-center gap-2 leading-loose">
                        {pieces.map((piece, i) => {
                            const blank = blanks.find((b) => `{{${b.key}}}` === piece);

                            return blank
                                ? <span key={i}>{dropdownFor(blank)}</span>
                                : <Typography key={i} component="span" color="text.dark">{piece}</Typography>;
                        })}
                    </div>
                );
            }

            return (
                <div className="flex flex-col gap-4">
                    {blanks.map((blank) => (
                        <div key={blank.key} className="flex flex-col gap-1">
                            {blank.label && (
                                <Typography variant="subtitle2" color="text.dark">{blank.label}</Typography>
                            )}
                            {dropdownFor(blank)}
                        </div>
                    ))}
                </div>
            );
        }

        /**
         * Drag into text: the passage carries numbered gaps and the student
         * fills each from the choices below. Tapping a gap arms it, then
         * tapping a choice places it — the same two-tap flow the bow-tie uses,
         * which works identically on touch and with a mouse.
         */
        if (isDragIntoText) {
            const parts = splitOnGaps(currentQuestion.question ?? "");
            const choiceGroups = currentQuestion.choice_groups ?? {};
            const unlimited = currentQuestion.unlimited_choices ?? [];

            const colorFor = (optionId: number | null) => {
                const group = Math.max(1, Number(choiceGroups[optionId ?? -1] ?? 1));

                return CHOICE_GROUP_COLORS[(group - 1) % CHOICE_GROUP_COLORS.length];
            };

            /** The gap a choice currently sits in, if any. */
            const gapHolding = (optionId: number) =>
                Object.entries(gapAnswers).find(([, id]) => Number(id) === optionId)?.[0];

            return (
                <div className="flex flex-col gap-6">
                    <Typography color="text.dark" component="div" className="leading-10">
                        {parts.map((part, index) => {
                            if (part.gap === null) {
                                return <span key={index}>{part.text}</span>;
                            }

                            const placedId = gapAnswers[part.gap];
                            const placed = currentQuestion.options.find((o) => o.id === placedId);
                            const isActive = activeGap === part.gap;
                            const isDragTarget = dragOverGap === part.gap;
                            const isHot = isActive || isDragTarget;

                            return (
                                <Box
                                    key={index}
                                    component="span"
                                    className="mx-1 inline-block rounded px-3 py-1 align-middle"
                                    onClick={() => !disabled && setActiveGap(isActive ? null : part.gap)}
                                    {...gapDropProps(part.gap)}
                                    // A filled gap can be dragged straight into
                                    // another one, so an answer can be moved
                                    // without going back to the choice list.
                                    {...(placed && placed.id !== null ? dragProps(placed.id) : {})}
                                    sx={{
                                        border: isHot ? "2px solid" : "1px dashed",
                                        minWidth: "6rem",
                                        textAlign: "center",
                                        cursor: disabled ? "default" : placed ? "grab" : "pointer",
                                        borderColor: isHot
                                            ? theme.palette.primary.main
                                            : theme.palette.separator.dark,
                                        backgroundColor: placed
                                            ? colorFor(placedId)
                                            : isDragTarget
                                                ? theme.palette.primary.light
                                                : "transparent",
                                        color: placed ? "#111" : theme.palette.text.secondary,
                                        opacity: disabled ? 0.6 : 1,
                                        transition: "border-color 120ms, background-color 120ms"
                                    }}
                                >
                                    {placed ? (
                                        <span className="general__content__box">
                                            {renderHtml(placed.option)}
                                        </span>
                                    ) : (
                                        <Typography variant="caption" component="span">
                                            {isDragTarget
                                                ? "Drop here"
                                                : isActive
                                                    ? "Pick an option"
                                                    : "Drag or tap"}
                                        </Typography>
                                    )}
                                </Box>
                            );
                        })}
                    </Typography>

                    <Divider />

                    {/**
                      * Dropping a choice back here clears the gap it was in,
                      * which is the natural way to undo a placement mid-drag.
                      */}
                    <div
                        className="flex flex-wrap gap-2 rounded-lg p-1"
                        onDragOver={(event) => {
                            if (disabled) return;
                            event.preventDefault();
                            event.dataTransfer.dropEffect = "move";
                        }}
                        onDrop={(event) => {
                            if (disabled) return;
                            event.preventDefault();

                            const dropped =
                                Number(event.dataTransfer.getData("text/plain")) || draggingId;

                            if (dropped) {
                                const next = { ...gapAnswers };
                                for (const key of Object.keys(next)) {
                                    if (next[Number(key)] === dropped) {
                                        delete next[Number(key)];
                                    }
                                }
                                emit({ gap_answers: next });
                            }

                            setDraggingId(null);
                            setDragOverGap(null);
                        }}
                    >
                        {currentQuestion.options.map((option) => {
                            if (option.id === null) return null;

                            const heldBy = gapHolding(option.id);
                            const isUsed = heldBy !== undefined && !unlimited.includes(option.id);
                            const isDragging = draggingId === option.id;

                            return (
                                <Box
                                    key={option.id}
                                    className="rounded-lg px-3 py-2"
                                    onClick={() => {
                                        if (disabled || activeGap === null) return;
                                        placeInGap(activeGap, option.id as number);
                                        setActiveGap(null);
                                    }}
                                    {...dragProps(option.id)}
                                    sx={{
                                        border: "1px solid",
                                        borderColor: theme.palette.separator.dark,
                                        backgroundColor: colorFor(option.id),
                                        color: "#111",
                                        // A consumed choice is dimmed but still
                                        // draggable, so it can be moved.
                                        opacity: disabled ? 0.6 : isDragging ? 0.3 : isUsed ? 0.45 : 1,
                                        cursor: disabled ? "default" : "grab",
                                        userSelect: "none"
                                    }}
                                >
                                    <span className="general__content__box">
                                        {renderHtml(option.option)}
                                    </span>
                                </Box>
                            );
                        })}
                    </div>

                    {activeGap === null && (
                        <Typography variant="caption" color="text.secondary">
                            Drag an option into a gap, or tap a gap to choose what goes in it.
                        </Typography>
                    )}
                </div>
            );
        }

        /**
         * Bow-tie: the student fills the diagram's drop areas from per-column
         * response groups. Tapping places a tile and tapping it again takes it
         * back, which works the same on touch as with a mouse and needs no
         * drag-and-drop dependency.
         */
        if (isBowTie) {
            const zones = currentQuestion.groups ?? [];
            const zoneCounts = currentQuestion.bow_tie_zone_counts ?? {};

            /**
             * The diagram itself: first and last zones sit on the wings, the
             * middle one at the knot, matching the bow-tie the format is named
             * for. A question authored with a different number of zones falls
             * back to a plain row rather than breaking the layout.
             */
            const [leftZone, centreZone, rightZone] =
                zones.length === 3 ? zones : [zones[0], zones[1], zones[2]];

            /**
             * Each column carries its own colour so a tile stays visually tied
             * to the group it came from once it is sitting in the diagram.
             * Taken from the theme rather than hard-coded, so both light and
             * dark render correctly.
             */
            const zonePalette = [
                theme.palette.success,
                theme.palette.secondary,
                theme.palette.info
            ];

            const paletteFor = (zoneKey: string) => {
                const index = zones.findIndex((z) => z.key === zoneKey);

                return zonePalette[(index < 0 ? 0 : index) % zonePalette.length];
            };

            const dropArea = (
                zone: typeof zones[number] | undefined,
                slot: number,
                key: string
            ) => {
                if (!zone) return null;

                const capacity = Math.max(1, zoneCounts[zone.key] ?? 1);
                const picked = groupAnswers[zone.key] ?? [];
                const optionId = picked[slot];
                const option = currentQuestion.options.find((o) => o.id === optionId);
                const isTarget = dragOverZone === zone.key;

                return (
                    <Box
                        key={key}
                        className="w-full rounded-lg px-3 py-3 text-center"
                        // A filled slot can be dragged into another slot of the
                        // same column, so an answer can be rearranged without
                        // going back to the source list.
                        draggable={!disabled && optionId !== undefined}
                        onDragStart={(event) => {
                            if (optionId === undefined) return;
                            setDraggingId(optionId);
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData("text/plain", String(optionId));
                        }}
                        onDragEnd={() => {
                            setDraggingId(null);
                            setDragOverZone(null);
                        }}
                        onDragOver={(event) => {
                            if (disabled) return;
                            event.preventDefault();
                            event.dataTransfer.dropEffect = "move";
                            setDragOverZone(zone.key);
                        }}
                        onDragLeave={() =>
                            setDragOverZone((current) => (current === zone.key ? null : current))
                        }
                        onDrop={(event) => {
                            if (disabled) return;
                            event.preventDefault();

                            const dropped =
                                Number(event.dataTransfer.getData("text/plain")) || draggingId;

                            // Only a tile from this zone's own column fits.
                            const belongs = currentQuestion.options.some(
                                (o) => o.id === dropped && o.group_key === zone.key
                            );

                            if (dropped && belongs && !picked.includes(dropped)) {
                                toggleBowTieTile(zone.key, dropped, capacity);
                            }

                            setDraggingId(null);
                            setDragOverZone(null);
                        }}
                        sx={{
                            position: "relative",
                            border: option ? "1px solid" : isTarget ? "2px dashed" : "1px dashed",
                            minHeight: "4rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            // A filled slot is dragged, not clicked — the minus
                            // button is what clears it.
                            cursor: option && !disabled ? "grab" : "default",
                            borderColor: option || isTarget
                                ? paletteFor(zone.key).main
                                : theme.palette.separator.darker,
                            backgroundColor: option
                                ? paletteFor(zone.key).light
                                : isTarget
                                    ? theme.palette.gray.gray1
                                    : "transparent",
                            boxShadow: option ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                            opacity: disabled ? 0.6 : 1,
                            transition: "border-color 120ms, background-color 120ms, box-shadow 120ms"
                        }}
                    >
                        {option ? (
                            <>
                                <div className="general__content__box px-4">
                                    <Typography
                                        variant="body2"
                                        color="text.dark"
                                        className="mt-0! font-medium"
                                    >
                                        {renderHtml(option.option)}
                                    </Typography>
                                </div>
                                {!disabled && (
                                    <Tooltip title="Remove">
                                        <IconButton
                                            size="small"
                                            aria-label={`Remove ${zone.label || zone.key} response`}
                                            onClick={(event) => {
                                                // The slot itself is draggable,
                                                // so the click must not bubble.
                                                event.stopPropagation();
                                                toggleBowTieTile(zone.key, optionId, capacity);
                                            }}
                                            sx={{
                                                position: "absolute",
                                                top: 4,
                                                right: 4,
                                                width: 22,
                                                height: 22,
                                                border: "1px solid",
                                                borderColor: paletteFor(zone.key).main,
                                                color: paletteFor(zone.key).main,
                                                backgroundColor: theme.palette.primary.white,
                                                "&:hover": {
                                                    backgroundColor: paletteFor(zone.key).main,
                                                    color: theme.palette.primary.white
                                                }
                                            }}
                                        >
                                            <Typography
                                                component="span"
                                                sx={{ fontSize: 16, lineHeight: 1, fontWeight: 600 }}
                                            >
                                                &minus;
                                            </Typography>
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </>
                        ) : (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: isTarget
                                        ? paletteFor(zone.key).main
                                        : theme.palette.separator.darkest,
                                    fontWeight: isTarget ? 600 : 400
                                }}
                            >
                                {isTarget ? "Drop here" : zone.label || zone.key}
                            </Typography>
                        )}
                    </Box>
                );
            };

            const slotsOf = (zone: typeof zones[number] | undefined) =>
                zone ? Math.max(1, zoneCounts[zone.key] ?? 1) : 0;

            return (
                <div className="flex flex-col gap-6">
                    {/* The bow-tie: wings left and right, knot in the middle. */}
                    <Box
                        className="flex items-stretch gap-2 rounded-xl p-4 md:gap-3 md:p-6"
                        sx={{ backgroundColor: theme.palette.gray.gray1 }}
                    >
                        <div className="flex flex-1 flex-col justify-center gap-3">
                            {Array.from({ length: slotsOf(leftZone) }).map((_, slot) =>
                                dropArea(leftZone, slot, `left-${slot}`)
                            )}
                        </div>

                        <BowTieConnector side="left" theme={theme} />

                        <div className="flex flex-1 flex-col justify-center gap-3">
                            {Array.from({ length: slotsOf(centreZone) }).map((_, slot) =>
                                dropArea(centreZone, slot, `centre-${slot}`)
                            )}
                        </div>

                        <BowTieConnector side="right" theme={theme} />

                        <div className="flex flex-1 flex-col justify-center gap-3">
                            {Array.from({ length: slotsOf(rightZone) }).map((_, slot) =>
                                dropArea(rightZone, slot, `right-${slot}`)
                            )}
                        </div>
                    </Box>

                    <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-3">
                        {zones.map((zone) => {
                            const capacity = Math.max(1, zoneCounts[zone.key] ?? 1);
                            const picked = groupAnswers[zone.key] ?? [];
                            const zoneOptions = currentQuestion.options.filter(
                                (o) => o.group_key === zone.key
                            );

                            return (
                                <div key={zone.key} className="flex flex-col">
                                    <Box
                                        className="rounded-t-lg px-3 py-2 text-center"
                                        sx={{
                                            border: "1px solid",
                                            borderColor: paletteFor(zone.key).main,
                                            backgroundColor: paletteFor(zone.key).main
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            className="font-semibold"
                                            sx={{ color: paletteFor(zone.key).contrastText }}
                                        >
                                            {zone.label || zone.key}
                                        </Typography>
                                    </Box>
                                    <Box
                                        className="flex flex-col gap-2 rounded-b-lg p-2"
                                        sx={{
                                            border: "1px solid",
                                            borderTop: 0,
                                            borderColor: paletteFor(zone.key).main
                                        }}
                                    >
                                    {zoneOptions.map((option) => {
                                        const isPicked = option.id !== null && picked.includes(option.id);

                                        return (
                                            <Box
                                                key={option.id}
                                                className="rounded-lg px-3 py-2"
                                                onClick={() =>
                                                    option.id !== null &&
                                                    !disabled &&
                                                    toggleBowTieTile(zone.key, option.id, capacity)
                                                }
                                                draggable={!disabled && option.id !== null}
                                                onDragStart={(event) => {
                                                    if (option.id === null) return;
                                                    setDraggingId(option.id);
                                                    event.dataTransfer.effectAllowed = "move";
                                                    event.dataTransfer.setData("text/plain", String(option.id));
                                                }}
                                                onDragEnd={() => {
                                                    setDraggingId(null);
                                                    setDragOverZone(null);
                                                }}
                                                sx={{
                                                    border: "1px solid",
                                                    cursor: disabled ? "default" : "grab",
                                                    userSelect: "none",
                                                    borderColor: paletteFor(zone.key).main,
                                                    backgroundColor: isPicked
                                                        ? paletteFor(zone.key).light
                                                        : "",
                                                    opacity: disabled ? 0.6 : draggingId === option.id ? 0.3 : 1,
                                                    transition: "box-shadow 120ms, transform 120ms",
                                                    "&:hover": disabled
                                                        ? {}
                                                        : {
                                                            boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
                                                            transform: "translateY(-1px)"
                                                        }
                                                }}
                                            >
                                                <div className="general__content__box option_image">
                                                    <Typography color="text.dark" className="mt-0!">
                                                        {renderHtml(option.option)}
                                                    </Typography>
                                                </div>
                                            </Box>
                                        );
                                    })}
                                    </Box>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        if (isGrouped) {
            const groups = currentQuestion.groups ?? [];

            return (
                <div className="flex flex-col gap-6">
                    {groups.map((group) => {
                        const groupOptions = currentQuestion.options.filter((o) => o.group_key === group.key);
                        const picked = groupAnswers[group.key]?.[0];

                        return (
                            <div key={group.key} className="flex flex-col gap-2">
                                <Typography variant="subtitle2" color="text.dark" className="font-semibold">
                                    {group.label || group.key}
                                </Typography>
                                <div className={optionListClass}>
                                    {groupOptions.map((option, index) =>
                                        optionBox(
                                            option,
                                            picked === option.id,
                                            () => option.id !== null && handleGroupPick(group.key, option.id),
                                            index,
                                            false,
                                            `${fieldName}-${group.key}`
                                        )
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (isOrdered) {
            const byId = new Map(currentQuestion.options.map((o) => [o.id, o]));

            return (
                <div className="flex flex-col gap-3">
                    {orderedIds.map((id, index) => {
                        const option = byId.get(id);
                        if (!option) return null;

                        return (
                            <Box
                                key={id}
                                className="rounded-lg flex items-center justify-between gap-3 px-4 py-2"
                                sx={{
                                    border: `1px solid ${theme.palette.separator.dark}`,
                                    opacity: disabled ? 0.6 : 1,
                                    pointerEvents: disabled ? "none" : "auto"
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <Typography variant="subtitle2" color="primary" className="font-bold">
                                        {index + 1}
                                    </Typography>
                                    <Typography color="text.dark">{renderHtml(option.option)}</Typography>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button size="small" onClick={() => moveOrdered(index, -1)} disabled={index === 0}>
                                        ↑
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={() => moveOrdered(index, 1)}
                                        disabled={index === orderedIds.length - 1}
                                    >
                                        ↓
                                    </Button>
                                </div>
                            </Box>
                        );
                    })}
                </div>
            );
        }

        if (isMultiSelect) {
            return (
                <div className={optionListClass}>
                    {currentQuestion.options.map((option, index) =>
                        optionBox(
                            option,
                            option.id !== null && selectedIds.includes(option.id),
                            () => option.id !== null && handleToggle(option.id),
                            index,
                            true
                        )
                    )}
                </div>
            );
        }

        return (
            <div className={optionListClass} role="radiogroup">
                {currentQuestion.options.map((option, index) =>
                    optionBox(
                        option,
                        selectedOptionId === option.id,
                        () => option.id !== null && handleSingle(option.id),
                        index,
                        false
                    )
                )}
            </div>
        );
    };

    /**
     * Select N legitimately states how many to pick. Every other multi-select
     * format must not — the number of correct answers is the question.
     */
    const instruction = (() => {
        if (isOrdered) return "Arrange the steps into the correct order.";
        if (isMatrix) return "Make one selection in every row.";
        if (isCloze) return "Choose an answer for each dropdown.";
        if (isHighlight) return "Select the relevant text to highlight it.";
        if (isBowTie) return "Drag a response from its column into the diagram, or tap it.";
        if (isDragIntoText) return "Drag an option into a gap, or tap a gap and then an option.";
        if (isGrouped) return "Make one selection in every row.";
        if (questionType === "select_n" && currentQuestion?.required_selection_count) {
            return `Select ${currentQuestion.required_selection_count} options.`;
        }
        if (isMultiSelect) return "Select all that apply.";
        return null;
    })();

    const marks = currentQuestion?.points ?? 0;

    return (
        <Box
            // Re-keying on the question restarts the entrance animation, which is
            // what tells the student the paper moved — the layout around it does
            // not change between questions.
            key={currentQuestion?.id ?? "question"}
            className="question__wrapper"
            sx={{
                animation: "quizFadeUp .2s ease-out",
                "@keyframes quizFadeUp": {
                    from: { opacity: 0, transform: "translateY(4px)" },
                    to: { opacity: 1, transform: "translateY(0)" }
                }
            }}
        >
            <Box className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
                <Typography
                    fontSize={12.5}
                    fontWeight={700}
                    className="tabular-nums"
                    sx={{ color: t.foreground }}
                >
                    Question {questionIndex + 1}
                </Typography>

                <Typography aria-hidden fontSize={12.5} sx={{ color: t.muted }}>
                    ·
                </Typography>

                {/* Plain multiple choice states no rule of its own, and a student
                    still needs telling that only one answer is taken. */}
                <Typography fontSize={12.5} sx={{ color: t.muted }}>
                    {instruction ?? "Choose one"}
                </Typography>

                {marks > 0 && (
                    <Box
                        className="ml-auto rounded-lg tabular-nums"
                        sx={{
                            px: 1.25,
                            py: 0.375,
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: t.muted,
                            border: "1px solid",
                            borderColor: t.border,
                            backgroundColor: t.surfaceMuted
                        }}
                    >
                        {marks} {marks === 1 ? "mark" : "marks"}
                    </Box>
                )}
            </Box>

            {!hidesQuestionText && (
                <Box
                    className={`general__content__box mt-4 ${currentQuestion?.has_image_in_option ? "md:max-w-[70%]" : ""}`}
                    sx={{ "& p:first-of-type": { marginTop: 0 } }}
                >
                    <Typography
                        component="div"
                        fontSize={17}
                        fontWeight={500}
                        lineHeight={1.7}
                        sx={{ color: t.foreground }}
                    >
                        {renderHtml(currentQuestion?.question || "")}
                    </Typography>
                </Box>
            )}

            <Box className="mt-6">{renderBody()}</Box>
        </Box>
    );
}

/**
 * The diagonal strokes joining a bow-tie's wings to its knot. Drawn as an SVG
 * rather than borders so the lines meet the centre cleanly at any height, and
 * hidden on narrow screens where the three columns stack.
 */
function BowTieConnector({
    side,
    theme
}: {
    side: "left" | "right";
    theme: Theme;
}) {
    return (
        <svg
            className="hidden w-6 shrink-0 self-stretch md:block"
            viewBox="0 0 24 100"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            {/* Wing slots sit at a quarter and three quarters of the height. */}
            <line
                x1={side === "left" ? 0 : 24}
                y1="25"
                x2={side === "left" ? 24 : 0}
                y2="50"
                stroke={theme.palette.separator.dark}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
            />
            <line
                x1={side === "left" ? 0 : 24}
                y1="75"
                x2={side === "left" ? 24 : 0}
                y2="50"
                stroke={theme.palette.separator.dark}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
