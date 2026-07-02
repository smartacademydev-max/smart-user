import {
    Box,
    List,
    ListItem,
    Typography,
    useTheme
} from "@mui/material";
import { useEffect, useRef } from "react";

interface TabOption<T> {
    label: string;
    value: T;
    count?: string | null;
}

interface TabControllerProps<T> {
    options?: TabOption<T>[];
    setActiveTab: (value: T) => void;
    currentActive: T;
    size?: "sm" | "md";
}

export default function TabController<T extends string | number>({
    setActiveTab,
    currentActive,
    options = [],
    size = "md"
}: TabControllerProps<T>) {
    const theme = useTheme();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll active tab to the start of the container whenever it changes
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        const active = container.querySelector<HTMLElement>("[data-active='true']");
        if (!active) return;
        const containerLeft = container.getBoundingClientRect().left;
        const activeLeft = active.getBoundingClientRect().left;
        container.scrollTo({
            left: container.scrollLeft + activeLeft - containerLeft,
            behavior: "smooth",
        });
    }, [currentActive]);

    const tabItem = (tab: TabOption<T>, isActive: boolean) => (
        <div className={
            `${size === "sm" ? "px-2.5 py-1" : "px-6 py-2"} rounded-md cursor-pointer flex items-center gap-1.5 ${isActive ? "active__tab__controller" : ""}`
        }>
            <Typography
                variant="subtitle2"
                color="text.middle"
                className="text-nowrap"
            >
                {tab.label}
            </Typography>
            {tab.count ? (
                <Typography
                    component="span"
                    variant="caption"
                    color="text.dark"
                    className="w-4.5 h-4.5 rounded-full flex justify-center items-center"
                    sx={{ background: (t) => t.palette.primary.contrastText }}
                >
                    {tab.count}
                </Typography>
            ) : null}
        </div>
    );

    return (
        <>
            {/* Mobile — native horizontal scroll with smooth active-to-start */}
            <Box
                ref={scrollRef}
                className="p-1! rounded-md"
                sx={{
                    background: theme.palette.tab.background,
                    display: { xs: "flex", lg: "none" },
                    overflowX: "auto",
                    flexWrap: "nowrap",
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {options.map((tab) => {
                    const isActive = currentActive === tab.value;
                    return (
                        <Box
                            key={tab.value as string | number}
                            data-active={isActive ? "true" : undefined}
                            onClick={() => setActiveTab(tab.value)}
                            sx={{ flexShrink: 0 }}
                        >
                            {tabItem(tab, isActive)}
                        </Box>
                    );
                })}
            </Box>

            {/* Desktop */}
            <List
                sx={{
                    background: theme.palette.tab.background,
                    display: { xs: "none", lg: "flex" },
                    overflow: "auto",
                }}
                className="p-1! rounded-md max-w-fit flex items-center"
            >
                {options.map((tab) => (
                    <ListItem
                        key={tab.value as string | number}
                        onClick={() => setActiveTab(tab.value)}
                    >
                        {tabItem(tab, currentActive === tab.value)}
                    </ListItem>
                ))}
            </List>
        </>
    );
}
