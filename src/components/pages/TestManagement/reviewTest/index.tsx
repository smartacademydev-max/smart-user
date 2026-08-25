import { Box, Checkbox, Divider, Radio, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { Book1, Calendar1, Clock, CloseCircle, TickCircle, Timer1 } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetTestResultQuery, useReviewTestResultQuery } from "../../../../services/testApi";
import { formatDateCustom, formatDateTime } from "../../../../utils/dateFormat";
import { renderHtml } from "../../../../utils/renderHtml";
import { gapsAsBlanks, splitOnGaps } from "../../../../utils/questionText";
import { EmptyList } from "../../../molecules/EmptyList";
import TestResultSummary from "../../../organism/ResultScreen";

/** Formats answered by filling gaps in the passage. */
const isGapFormat = (q: any) => q?.question_type === "drag_into_text";

/** Highlight has no options at all — its answer is spans over a passage. */
const isHighlightFormat = (q: any) => q?.question_type === "highlight";

/** Formats whose options belong to a row, blank or zone. */
const hasGroups = (q: any) =>
    Array.isArray(q?.groups) && q.groups.length > 0 &&
    ["matrix", "cloze", "bow_tie"].includes(q?.question_type);

export default function ReviewTestRoot() {
    const theme = useTheme();
    const { courseId, testId } = useParams();
    const { data, isLoading } = useReviewTestResultQuery({ courseId: Number(courseId), testId: Number(testId) });
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (_: any, newValue: number) => setTabIndex(newValue);

    useEffect(() => {
        const RESULT_KEY = `mcq_test_result_${courseId}_${testId}`;
        const STORAGE_KEY = `mcq_test_progress_${courseId}_${testId}`;
        localStorage.removeItem(RESULT_KEY);
        localStorage.removeItem(STORAGE_KEY);
    }, [courseId, testId]);

    const items = [
        { icon: Book1, label: "Total Questions:", value: `${data?.data?.total_questions} Questions` },
        { icon: Timer1, label: "Timer:", value: data?.data?.timer },
        { icon: Calendar1, label: "Start Date:", value: formatDateCustom(data?.data?.start_date || "", { shortMonth: true }) },
        { icon: Clock, label: "Start Time:", value: formatDateTime(data?.data?.start_time) },
        { icon: Clock, label: "End Time:", value: formatDateTime(data?.data?.end_time) },
    ];

    const renderOption = (option: any, isCorrect: boolean, isUserWrong?: boolean) => {
        const bgColor = isCorrect
            ? theme.palette.success.light
            : isUserWrong
                ? theme.palette.error.light
                : "transparent";

        const borderColor = isCorrect
            ? theme.palette.success.main
            : isUserWrong
                ? theme.palette.error.main
                : theme.palette.separator.dark;

        const Icon = isCorrect ? TickCircle : isUserWrong ? CloseCircle : undefined;

        return (
            <Box
                key={option.option + option.id}
                className="rounded-lg p-3 col-span-1 flex items-center gap-1"
                sx={{ border: `1px solid ${borderColor}`, backgroundColor: bgColor }}
            >
                {Icon && <Icon variant="Bold" color={isCorrect ? theme.palette.success.main : theme.palette.error.main} />}
                <Typography variant="body2">{renderHtml(option.option)}</Typography>
            </Box>
        );
    };

    /**
     * Bow-tie zones and drag-into-text gaps are answered in a shape of their
     * own, so review redraws that shape instead of listing the options flat —
     * which showed raw [[1]] markers and gave no clue which zone was wrong.
     */
    const renderGrouped = (q: any, yourAnswerIds: number[]) => {
        const groups: any[] = q.groups ?? [];
        const detail = q.group_detail ?? {};

        /**
         * A bow-tie is reviewed as the bow-tie the student filled in — the
         * shape carries the meaning, so a flat stack of zones loses it.
         */
        if (q.question_type === "bow_tie") {
            return renderBowTieReview(q, detail);
        }

        // A matrix is reviewed as its grid, for the same reason.
        if (q.question_type === "matrix" && (q.columns ?? []).length > 0) {
            return renderMatrixReview(q, detail);
        }

        return (
            <div className="flex flex-col gap-4">
                {groups.map((group: any, index: number) => {
                    const groupOptions = (q.options ?? []).filter(
                        (o: any) => o.group_key === group.key
                    );
                    const outcome = detail[group.key];
                    const palette =
                        [theme.palette.success, theme.palette.secondary, theme.palette.info][index % 3];

                    return (
                        <div key={group.key} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Typography variant="subtitle2" sx={{ color: palette.main }}>
                                    {group.label || group.key}
                                </Typography>
                                {outcome && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: outcome.is_correct
                                                ? theme.palette.success.main
                                                : theme.palette.error.main
                                        }}
                                    >
                                        {outcome.is_correct ? "Correct" : "Incorrect"}
                                    </Typography>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
                                {groupOptions.map((option: any) =>
                                    renderOption(
                                        option,
                                        option.is_correct,
                                        yourAnswerIds.includes(option.id) && !option.is_correct
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    /**
     * Bow-tie review: the diagram as the student filled it, each drop area
     * showing what they put there against what was expected.
     */
    const renderBowTieReview = (q: any, detail: any) => {
        const zones: any[] = q.groups ?? [];
        const counts = q.bow_tie_zone_counts ?? {};
        const byId = new Map((q.options ?? []).map((o: any) => [o.id, o]));
        const zonePalette = [theme.palette.success, theme.palette.secondary, theme.palette.info];

        const slot = (zone: any, index: number, slotIndex: number) => {
            const outcome = detail[zone.key];
            const chosen: number[] = outcome?.selected_option_ids ?? [];
            const expected: number[] = outcome?.correct_option_ids ?? [];
            const optionId = chosen[slotIndex];
            const option = optionId != null ? (byId.get(optionId) as any) : undefined;
            const isRight = optionId != null && expected.includes(optionId);
            const palette = zonePalette[index % 3];

            return (
                <Box
                    key={`${zone.key}-${slotIndex}`}
                    className="w-full rounded-lg px-3 py-3 text-center"
                    sx={{
                        border: "1px solid",
                        minHeight: "3.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        borderColor: option
                            ? isRight
                                ? theme.palette.success.main
                                : theme.palette.error.main
                            : theme.palette.separator.dark,
                        backgroundColor: option
                            ? isRight
                                ? theme.palette.success.light
                                : theme.palette.error.light
                            : "transparent"
                    }}
                >
                    {option ? (
                        <>
                            {isRight ? (
                                <TickCircle variant="Bold" size={18} color={theme.palette.success.main} />
                            ) : (
                                <CloseCircle variant="Bold" size={18} color={theme.palette.error.main} />
                            )}
                            <Typography variant="body2">{renderHtml(option.option)}</Typography>
                        </>
                    ) : (
                        <Typography variant="caption" sx={{ color: palette.main }}>
                            Not answered
                        </Typography>
                    )}
                </Box>
            );
        };

        const [left, centre, right] = [zones[0], zones[1], zones[2]];
        const slotsOf = (zone: any) => (zone ? Math.max(1, counts[zone.key] ?? 1) : 0);

        return (
            <div className="flex flex-col gap-4">
                <Box
                    className="flex items-stretch gap-2 rounded-xl p-4 md:gap-3"
                    sx={{ backgroundColor: theme.palette.gray.gray1 }}
                >
                    {[left, centre, right].map((zone, index) => (
                        <div key={zone?.key ?? index} className="flex flex-1 flex-col justify-center gap-3">
                            {Array.from({ length: slotsOf(zone) }).map((_, slotIndex) =>
                                zone ? slot(zone, index, slotIndex) : null
                            )}
                        </div>
                    ))}
                </Box>

                {/* What each zone expected, for any the student got wrong. */}
                {zones.map((zone: any) => {
                    const outcome = detail[zone.key];
                    if (!outcome || outcome.is_correct) return null;

                    const expected = (outcome.correct_option_ids ?? [])
                        .map((id: number) => (byId.get(id) as any)?.option ?? "")
                        .filter(Boolean);

                    return (
                        <Typography key={zone.key} variant="caption" color="text.secondary">
                            {zone.label || zone.key}: correct answer was{" "}
                            <strong>{expected.join(", ")}</strong>
                        </Typography>
                    );
                })}
            </div>
        );
    };

    /**
     * Matrix review: the same grid the student answered in — striped rows,
     * one control per cell — with their selection coloured right or wrong and
     * the expected cell outlined where they differ.
     */
    const renderMatrixReview = (q: any, detail: any) => {
        const rows: any[] = q.groups ?? [];
        const columns: any[] = q.columns ?? [];
        const multiplePerRow = Boolean(q.multiple_per_row);

        const optionIdFor = (rowKey: string, column: any) =>
            (q.options ?? []).find(
                (o: any) => o.group_key === rowKey && o.option === (column.label || column.key)
            )?.id ?? null;

        const Control = multiplePerRow ? Checkbox : Radio;

        return (
            <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-3 text-left" />
                            {columns.map((column: any) => (
                                <th key={column.key} className="p-3 text-center min-w-[110px]">
                                    <Typography variant="subtitle2" color="text.dark" className="font-semibold">
                                        {column.label || column.key}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row: any, index: number) => {
                            const outcome = detail[row.key];
                            const chosen: number[] = outcome?.selected_option_ids ?? [];
                            const expected: number[] = outcome?.correct_option_ids ?? [];

                            return (
                                <tr
                                    key={row.key}
                                    style={{
                                        background: index % 2 === 0 ? theme.palette.action.hover : "transparent"
                                    }}
                                >
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <Typography color="text.dark">{row.label || row.key}</Typography>
                                            {outcome && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: outcome.is_correct
                                                            ? theme.palette.success.main
                                                            : theme.palette.error.main
                                                    }}
                                                >
                                                    {outcome.is_correct ? "Correct" : "Incorrect"}
                                                </Typography>
                                            )}
                                        </div>
                                    </td>
                                    {columns.map((column: any) => {
                                        const optionId = optionIdFor(row.key, column);
                                        const isChosen = optionId !== null && chosen.includes(optionId);
                                        const isExpected = optionId !== null && expected.includes(optionId);

                                        /**
                                         * The student's own selection is
                                         * coloured; a cell they missed is
                                         * outlined so the right answer is
                                         * still visible without pretending
                                         * they chose it.
                                         */
                                        const tone = isChosen
                                            ? isExpected
                                                ? theme.palette.success.main
                                                : theme.palette.error.main
                                            : theme.palette.separator.darker;

                                        return (
                                            <td key={column.key} className="p-3 text-center">
                                                <Box
                                                    className="inline-flex items-center justify-center rounded-full"
                                                    sx={{
                                                        border: isExpected && !isChosen ? "2px dashed" : "none",
                                                        borderColor: theme.palette.success.main,
                                                        padding: isExpected && !isChosen ? "2px" : 0
                                                    }}
                                                >
                                                    <Control
                                                        checked={isChosen}
                                                        disabled
                                                        sx={{
                                                            "&.Mui-disabled": { color: tone },
                                                            padding: "6px"
                                                        }}
                                                    />
                                                </Box>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <Typography variant="caption" color="text.secondary">
                    A dashed green ring marks the answer that was expected.
                </Typography>
            </div>
        );
    };

    /**
     * Highlight review: the passage with the student's marks and the author's
     * expected ones drawn over it. It has no options, so the flat option list
     * rendered nothing at all — a blank question in the review.
     */
    const renderHighlight = (q: any) => {
        const passage: string = q.passage ?? "";
        const expected: any[] = q.expected_spans ?? [];
        const submitted: any[] = q.submitted_spans ?? [];

        if (!passage) {
            return (
                <Typography variant="body2" color="text.secondary">
                    This question has no passage to review.
                </Typography>
            );
        }

        /**
         * Both sets of spans are drawn over one pass of the text, so every
         * boundary — from either set — becomes a segment edge.
         */
        const edges = new Set<number>([0, passage.length]);
        for (const span of [...expected, ...submitted]) {
            edges.add(Math.max(0, Number(span.start) || 0));
            edges.add(Math.min(passage.length, Number(span.end) || 0));
        }

        const points = [...edges].sort((a, b) => a - b);
        const covers = (spans: any[], from: number, to: number) =>
            spans.some((sp) => Number(sp.start) <= from && Number(sp.end) >= to);

        type Segment = { text: string; state: "correct" | "wrong" | "missed" | "plain" };

        /**
         * Every span boundary becomes an edge, so a phrase the student marked
         * in one go still arrives here as several pieces — one per word and
         * one per space between them. Neighbouring pieces that mean the same
         * thing are merged back into a single run, so a highlighted sentence
         * reads as one block rather than a box around every word. A word in
         * the middle with a different state still breaks the run, which is
         * exactly where the distinction matters.
         */
        const segments = points.slice(0, -1).reduce<Segment[]>((merged, from, index) => {
            const to = points[index + 1];
            if (to <= from) return merged;

            const text = passage.slice(from, to);
            const wasExpected = covers(expected, from, to);
            const wasMarked = covers(submitted, from, to);
            const state: Segment["state"] = wasMarked
                ? wasExpected
                    ? "correct"
                    : "wrong"
                : wasExpected
                    ? "missed"
                    : "plain";

            const previous = merged[merged.length - 1];

            if (previous && previous.state === state) {
                previous.text += text;

                return merged;
            }

            /**
             * Marking four words individually leaves the spaces between them
             * unhighlighted, which would draw a box around every word. A run
             * of pure whitespace between two identical states is absorbed, so
             * the phrase reads as one block. Anything with a character in it
             * still breaks the run — a differently-marked word in the middle
             * is exactly the distinction worth showing.
             */
            const beforeGap = merged[merged.length - 2];

            if (
                previous &&
                previous.state === "plain" &&
                previous.text.trim() === "" &&
                beforeGap &&
                beforeGap.state === state
            ) {
                beforeGap.text += previous.text + text;
                merged.pop();

                return merged;
            }

            return [...merged, { text, state }];
        }, []);

        return (
            <div className="flex flex-col gap-3">
                <Typography component="div" className="leading-8">
                    {segments.map((segment, index) => {
                        if (segment.state === "plain") {
                            return <span key={index}>{segment.text}</span>;
                        }

                        /**
                         * A missed span has to be as visible as a wrong one —
                         * it is the answer the student needed to see.
                         */
                        const tone =
                            segment.state === "correct"
                                ? theme.palette.success
                                : segment.state === "wrong"
                                    ? theme.palette.error
                                    : theme.palette.info;

                        return (
                            <Box
                                key={index}
                                component="span"
                                className="rounded px-1 py-0.5"
                                sx={{
                                    backgroundColor: tone.light,
                                    border: "1px solid",
                                    borderColor: tone.main,
                                    fontWeight: 500,
                                    // Keeps a highlighted phrase readable when
                                    // it wraps across a line.
                                    boxDecorationBreak: "clone",
                                    WebkitBoxDecorationBreak: "clone"
                                }}
                            >
                                {segment.text}
                            </Box>
                        );
                    })}
                </Typography>

                <div className="flex flex-wrap gap-3">
                    <Typography variant="caption" color="text.secondary">
                        <Box
                            component="span"
                            className="mr-1 inline-block h-3 w-3 rounded-sm align-middle"
                            sx={{ backgroundColor: theme.palette.success.light }}
                        />
                        Correctly highlighted
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        <Box
                            component="span"
                            className="mr-1 inline-block h-3 w-3 rounded-sm align-middle"
                            sx={{ backgroundColor: theme.palette.error.light }}
                        />
                        Highlighted but not expected
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        <Box
                            component="span"
                            className="mr-1 inline-block h-3 w-3 rounded-sm align-middle"
                            sx={{
                                backgroundColor: theme.palette.info.light,
                                border: "1px solid",
                                borderColor: theme.palette.info.main
                            }}
                        />
                        Missed &mdash; this was the correct answer
                    </Typography>
                </div>
            </div>
        );
    };

    /**
     * Drag into text: the passage with each gap showing what the student put
     * there and, when they differ, the answer that was expected.
     */
    const renderGaps = (q: any) => {
        const detail = q.gap_detail ?? {};
        const byId = new Map((q.options ?? []).map((o: any) => [o.id, o]));
        const label = (id: any) => (byId.get(id) as any)?.option ?? "—";

        return (
            <div className="flex flex-col gap-3">
                <Typography component="div" className="leading-9">
                    {splitOnGaps(q.question ?? "").map((part, index) => {
                        if (part.gap === null) return <span key={index}>{part.text}</span>;

                        const outcome = detail[part.gap] ?? detail[String(part.gap)];
                        const chosen = outcome?.selected_option_id;
                        const isRight = Boolean(outcome?.is_correct);
                        // A gap the author never keyed cannot be judged, so it
                        // shows the student's answer without a verdict.
                        const isUngraded = Boolean((outcome as any)?.ungraded);
                        const answered = chosen != null;

                        const tone = !answered
                            ? theme.palette.separator.darker
                            : isUngraded
                                ? theme.palette.info.main
                                : isRight
                                    ? theme.palette.success.main
                                    : theme.palette.error.main;

                        const fill = !answered
                            ? "transparent"
                            : isUngraded
                                ? theme.palette.info.light
                                : isRight
                                    ? theme.palette.success.light
                                    : theme.palette.error.light;

                        return (
                            <Box
                                key={index}
                                component="span"
                                className="mx-1 inline-block rounded px-2 py-1"
                                sx={{
                                    border: "1px solid",
                                    borderColor: tone,
                                    backgroundColor: fill
                                }}
                            >
                                <Typography variant="body2" component="span">
                                    {answered ? renderHtml(String(label(chosen))) : "Not answered"}
                                </Typography>
                            </Box>
                        );
                    })}
                </Typography>

                <div className="flex flex-col gap-1">
                    {Object.entries(detail)
                        .filter(([, outcome]: any) => !outcome?.is_correct && !outcome?.ungraded)
                        .map(([gap, outcome]: any) => (
                            <Typography key={gap} variant="caption" color="text.secondary">
                                Gap {gap}: correct answer was{" "}
                                <strong>{String(label(outcome?.correct_option_id))}</strong>
                            </Typography>
                        ))}
                </div>
            </div>
        );
    };

    const renderQuestions = (questions: any[], type: "correct" | "incorrect" | "skipped") => {
        if (!isLoading && questions.length === 0) {
            return <EmptyList
                title={`No Question Found in ${type}`}
                description=""
            />;
        }
        return questions.map((q) => {
            /**
             * Multi-select answers arrive as `your_answer_ids`; the scalar
             * `your_answer_id` is only the first selection and is all that
             * older stored results carry.
             */
            const yourAnswerIds: number[] = q.your_answer_ids?.length
                ? q.your_answer_ids
                : q.your_answer_id != null
                    ? [q.your_answer_id]
                    : [];

            return (
                <div className="question__box" key={q.question}>
                    <Typography className="mb-4!" variant="h6">
                        {renderHtml(gapsAsBlanks(q.question ?? ""))}
                    </Typography>

                    {isHighlightFormat(q) ? (
                        renderHighlight(q)
                    ) : isGapFormat(q) ? (
                        renderGaps(q)
                    ) : hasGroups(q) ? (
                        renderGrouped(q, yourAnswerIds)
                    ) : (
                        <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                            {q.options.map((option: any) => {
                                if (type === "correct") {
                                    return option.is_correct ? renderOption(option, true) : null;
                                } else if (type === "incorrect") {
                                    return renderOption(option, option.is_correct, yourAnswerIds.includes(option.id));
                                } else if (type === "skipped") {
                                    return renderOption(option, option.is_correct);
                                }
                                return null;
                            })}
                        </div>
                    )}
                </div>
            );
        });
    };

    const { data: result } = useGetTestResultQuery({ courseId: Number(courseId), testId: Number(testId) });

    return (
        <div className="test__review__root h-full overflow-auto">
            <Typography className="text2Xl mb-4!">{data?.data?.test_name}</Typography>

            <ul className="flex flex-wrap items-center gap-4">
                {items
                    .filter(item => item.value !== null && item.value !== undefined && item.value !== "")
                    .map((item, index, filteredItems) => {
                        const Icon = item.icon;

                        return (
                            <li
                                key={index}
                                className="flex items-center gap-1 pr-4"
                                style={{
                                    borderRight:
                                        index !== filteredItems.length - 1
                                            ? `1px solid ${theme.palette.separator.dark}`
                                            : "none",
                                }}
                            >
                                <Icon variant="Linear" />
                                <Typography variant="subtitle2" color="text.middle">
                                    {item.label}
                                </Typography>
                                <Typography variant="subtitle2" color="text.dark">
                                    {item.value}
                                </Typography>
                            </li>
                        );
                    })}
            </ul>


            <Divider className="mt-2! mb-6!" />

            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-6">
                <div className="col-span-7 2xl:col-span-8">
                    {/* Tabs */}
                    <Tabs value={tabIndex} onChange={handleTabChange} aria-label="answer categories">
                        <Tab label={`Correct (${data?.data?.correct_answers?.length || 0})`} />
                        <Tab label={`Incorrect (${data?.data?.incorrect_answers?.length || 0})`} />
                        <Tab label={`Skipped (${data?.data?.skipped_answers?.length || 0})`} />
                    </Tabs>

                    <Box className="mt-4 space-y-4">
                        {tabIndex === 0 && renderQuestions(data?.data?.correct_answers || [], "correct")}
                        {tabIndex === 1 && renderQuestions(data?.data?.incorrect_answers || [], "incorrect")}
                        {tabIndex === 2 && renderQuestions(data?.data?.skipped_answers || [], "skipped")}
                    </Box></div>
                <div className="col-span-5 2xl:col-span-4">
                    <TestResultSummary
                        testName={data?.data?.test_name}
                        correct={result?.data?.correct || 0}
                        percentage={result?.data?.percentage || 0}
                        incorrect={result?.data?.incorrect || 0}
                        time_taken={result?.data?.time_taken || ""}
                        total_questions={result?.data?.total_questions || 0}
                    />
                </div>
            </div>
        </div>
    );
}
