import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { ArrowRight2, Calendar, Eye, User } from "iconsax-reactjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetGorkhapatraByIdQuery } from "../../../../services/gorkhapatraApi";
import { formatDateForDisplay } from "../../../../utils/dateFormat";
import { renderHtml } from "../../../../utils/renderHtml";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

const SCROLL_OFFSET = 100;

export default function SingleGorkhapatraRoot() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    const { data, isLoading } = useGetGorkhapatraByIdQuery(
        { id: Number(id) },
        { skip: !id }
    );

    const gorkhapatraData = data?.data;
    const date: string = formatDateForDisplay(gorkhapatraData?.created_at);

    // Extract headings and create TOC
    useEffect(() => {
        if (!contentRef.current || !gorkhapatraData?.content) return;

        const timer = setTimeout(() => {
            const contentElement = contentRef.current;
            if (!contentElement) return;

            const headings = contentElement.querySelectorAll("h2, h3");
            const items: TocItem[] = [];

            headings.forEach((heading, index) => {
                const headingId = `heading-${index}`;
                heading.id = headingId;

                items.push({
                    id: headingId,
                    text: heading.textContent || "",
                    level: heading.tagName === "H2" ? 2 : 3,
                });
            });

            setTocItems(items);

            if (items.length > 0) {
                setActiveId(items[0].id);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [gorkhapatraData?.content]);

    const handleScroll = useCallback(() => {
        const contentElement = contentRef.current;
        const scrollContainer = scrollContainerRef.current;

        if (!contentElement || !scrollContainer || tocItems.length === 0) return;

        const headings = contentElement.querySelectorAll("h2, h3");
        if (!headings.length) return;

        const scrollTop = scrollContainer.scrollTop;
        let newActiveId = tocItems[0]?.id || "";

        for (let i = headings.length - 1; i >= 0; i--) {
            const heading = headings[i] as HTMLElement;
            const headingTop = heading.offsetTop;

            if (scrollTop >= headingTop - SCROLL_OFFSET) {
                newActiveId = heading.id;
                break;
            }
        }

        if (activeId !== newActiveId) {
            setActiveId(newActiveId);
        }
    }, [tocItems, activeId]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;

        if (!scrollContainer || tocItems.length === 0) return;

        handleScroll();

        scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
        };
    }, [tocItems, handleScroll]);

    const scrollToHeading = useCallback((headingId: string) => {
        const element = document.getElementById(headingId);
        const scrollContainer = scrollContainerRef.current;

        if (!element || !scrollContainer) return;

        const targetPosition = element.offsetTop - SCROLL_OFFSET;

        scrollContainer.scrollTo({
            top: targetPosition,
            behavior: "smooth",
        });

        setActiveId(headingId);
    }, []);

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleTocItemClick = (itemId: string) => {
        scrollToHeading(itemId);
    };

    return (
        <div
            ref={scrollContainerRef}
            className="single__gorkhapatra__root h-full overflow-auto"
        >
            <Button
                variant="text"
                startIcon={<ArrowBack />}
                onClick={handleBackClick}
                sx={{
                    color: (theme) => theme.palette.separator.darkest
                }}
            >
                <Typography color="text.middle">Back to Gorkhapatras</Typography>
            </Button>

            <Typography className="text-center mt-8!" variant="h3" fontWeight={600}>
                {gorkhapatraData?.title}
            </Typography>

            <Divider className="mt-2! mb-6!" />

            <Box
                className="image__wrapper aspect-1460/534 rounded-lg flex flex-col justify-center items-center mb-8 overflow-hidden"
                sx={{
                    background: (theme) => theme.palette.primary.dark,
                    color: (theme) => theme.palette.primary.contrastText,
                }}
            >
                {gorkhapatraData?.thumbnail_url ? (
                    <img
                        src={gorkhapatraData.thumbnail_url}
                        alt={gorkhapatraData?.title || "Gorkhapaatra thumbnail"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="max-w-[80%] mx-auto text-center">
                        <Typography variant="h1" fontWeight={600}>
                            {gorkhapatraData?.title}
                        </Typography>
                        {gorkhapatraData?.description ? <Typography className="text.middle" color="warning.main">
                            {renderHtml(gorkhapatraData?.description || "")}
                        </Typography> : ""}
                    </div>
                )}
            </Box>

            <Stack className="justify-between">
                <Stack className="items-center! gap-2 mb-6">
                    {gorkhapatraData?.added_by && (
                        <Stack className="items-center! gap-1">
                            <User />
                            <Typography variant="subtitle2" color="text.middle">
                                Presenter: {gorkhapatraData.added_by}
                            </Typography>
                        </Stack>
                    )}
                    {gorkhapatraData?.created_at && (
                        <Stack className="items-center! gap-1">
                            <Calendar />
                            <Typography variant="subtitle2" color="text.middle">
                                {date}
                            </Typography>
                        </Stack>
                    )}
                    {gorkhapatraData?.views !== undefined && gorkhapatraData.views > 0 && (
                        <Stack className="items-center! gap-1">
                            <Eye />
                            <Typography variant="subtitle2" color="text.middle">
                                {gorkhapatraData.views} Views
                            </Typography>
                        </Stack>
                    )}
                </Stack>
                <Stack>
                    <Typography variant="subtitle2" color="text.middle">
                        Share:
                    </Typography>
                </Stack>
            </Stack>

            {gorkhapatraData?.content && (
                <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12">
                    <div className="lg:col-span-4 sticky top-4 self-start">
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            className="mb-2!"
                        >
                            Table of Content
                        </Typography>

                        {tocItems.length > 0 ? (
                            <Stack className="gap-2 flex-col!">
                                {tocItems.map((item) => {
                                    const isActive = activeId === item.id;

                                    return (
                                        <Box
                                            key={item.id}
                                            className="flex items-center justify-between py-4! px-5!"
                                            onClick={() => handleTocItemClick(item.id)}
                                            sx={{
                                                paddingLeft: item.level === 3 ? 2 : 0,
                                                paddingY: 1,
                                                paddingRight: 1,
                                                borderRadius: 1,
                                                cursor: "pointer",
                                                transition: "all 0.2s",
                                                ...(isActive && {
                                                    background: (theme) => theme.palette.primary.light,
                                                    color: (theme) => theme.palette.primary.main,
                                                }),
                                                "&:hover": {
                                                    background: (theme) => theme.palette.primary.light,
                                                    color: (theme) => theme.palette.primary.main,
                                                },
                                                "&:active": {
                                                    background: (theme) => theme.palette.primary.light,
                                                    color: (theme) => theme.palette.primary.main,
                                                },
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                color={isActive ? "primary.main" : "text.dark"}
                                                fontWeight={500}
                                                className="line-clamp-1"
                                            >
                                                {item.text}
                                            </Typography>
                                            <ArrowRight2 size={16} />
                                        </Box>
                                    );
                                })}
                            </Stack>
                        ) : (
                            <Typography variant="caption" color="text.disabled">
                                No headings found
                            </Typography>
                        )}
                    </div>

                    <div
                        ref={contentRef}
                        className="content general__content__box styled__list lg:col-span-8"
                    >
                        {renderHtml(gorkhapatraData.content)}
                    </div>
                </div>
            )}
        </div>
    );
}