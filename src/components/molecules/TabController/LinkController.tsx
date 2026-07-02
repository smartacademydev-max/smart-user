import {
    Box,
    List,
    ListItem,
    Typography,
    useTheme,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface TabOption {
    label: string;
    value: string;
}

interface LinkControllerProps {
    options?: TabOption[];
}

export default function LinkController({ options = [] }: LinkControllerProps) {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll active tab to the start of the container on route change
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
    }, [location.pathname]);

    const tabItem = (tab: TabOption, isActive: boolean) => (
        <div className={
            `px-6 py-2 rounded-md cursor-pointer flex items-center gap-1.5 ${isActive ? "active__tab__controller" : ""}`
        }>
            <Typography
                variant="subtitle2"
                color="text.middle"
                className="text-nowrap"
            >
                {tab.label}
            </Typography>
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
                    const isActive = location.pathname === tab.value;
                    return (
                        <Box
                            key={tab.value}
                            data-active={isActive ? "true" : undefined}
                            onClick={() => navigate(tab.value)}
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
                {options.map((tab) => {
                    const isActive = location.pathname === tab.value;
                    return (
                        <ListItem
                            key={tab.value}
                            onClick={() => navigate(tab.value)}
                        >
                            {tabItem(tab, isActive)}
                        </ListItem>
                    );
                })}
            </List>
        </>
    );
}
