import { Box, Button, List, ListItem, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { useGetOnboradingScreenQuery } from "../../../../services/contentApi";
import { getItem, setItem } from "../../../../utils/localStorageUtil";

const ONBOARDING_DONE_KEY = "onboarding_completed";

export default function IntroScreenRoot() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data, isLoading } = useGetOnboradingScreenQuery();
    const [activeTab, setActiveTab] = useState<number>(0);

    useEffect(() => {
        const completed = getItem<boolean>(ONBOARDING_DONE_KEY);
        if (completed) {
            navigate(PATH.AUTH.REGISTER.ROOT, { replace: true });
        }
    }, [navigate]);

    const screens = data?.data ?? [];
    const isLastScreen = activeTab === screens.length - 1;
    const currentItem = screens[activeTab];

    const completeOnboarding = () => {
        setItem(ONBOARDING_DONE_KEY, true);
        navigate(PATH.AUTH.REGISTER.ROOT, { replace: true });
    };

    return (
        <Box className="min-h-screen flex justify-center items-center">
            <div className="container mx-auto">
                <div className="content__wrapper px-4 w-full md:max-w-[592px] mx-auto">
                    {isLoading ? (
                        <Box>
                            <Skeleton variant="rectangular" width={217} height={150} className="mb-4 mx-auto" />
                            <Skeleton variant="text" height={40} className="mb-2" />
                            <Skeleton variant="text" height={24} className="mb-6" />
                            <Skeleton variant="rectangular" height={50} className="mb-2" />
                            <Skeleton variant="rectangular" height={50} />
                        </Box>
                    ) : currentItem ? (
                        <div className="onboarding__screen">
                            {currentItem.icon_url && (
                                <img src={currentItem.icon_url} alt="" className="mb-4 max-w-[217px] mx-auto" />
                            )}

                            <div className="text-center">
                                {currentItem.title && (
                                    <Typography variant="h4" className="mb-2!">
                                        {currentItem.title}
                                    </Typography>
                                )}
                                {currentItem.description && (
                                    <Typography variant="subtitle1" className="mb-6!">
                                        {currentItem.description}
                                    </Typography>
                                )}
                            </div>

                            {/* Screen items */}
                            {currentItem.layout === "wide" ? (
                                <List className="flex flex-col gap-3!">
                                    {currentItem.items?.map((item) => (
                                        <ListItem
                                            key={item.description}
                                            className="py-4! px-5! flex! flex-row! justify-start items-center! gap-3"
                                            sx={{
                                                bgcolor: (theme) => theme.palette.gray.gray1,
                                                borderRadius: "12px",
                                                border: (theme) => `1px solid ${theme.palette.gray.gray2}`,
                                            }}
                                        >
                                            {item.icon_url && <img src={item.icon_url} alt="" className="max-w-8 mix-blend-darken" />}
                                            <div className="content">
                                                <Typography variant="body2">{item.title}</Typography>
                                                <Typography variant="subtitle2" color="text.middle">
                                                    {item.description}
                                                </Typography>
                                            </div>
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <div className="flex flex-col gap-3 sm:grid grid-cols-2">
                                    {currentItem.items?.map((item) => (
                                        <div className="col-span-1" key={item.icon_url}>
                                            <Box className="card h-full px-4 py-5 rounded-xl" sx={{
                                                bgcolor: "#F8FAFC",
                                                border: (theme) => theme.palette.textField.border
                                            }}>
                                                {item.icon_url && <img src={item.icon_url} alt="" className="mb-1 max-w-8 mix-blend-darken" />}
                                                <div className="content">
                                                    <Typography variant="h6" className="mb-1!" color="primary">{item.title}</Typography>
                                                    <Typography variant="subtitle1" >
                                                        {item.description}
                                                    </Typography>
                                                </div>
                                            </Box>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : null}

                    {/* Dots */}
                    <div className="flex justify-center items-center gap-2 mt-4 md:mt-6">
                        {screens.map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    bgcolor: (theme) =>
                                        index === activeTab
                                            ? theme.palette.primary.main // active dot = primary
                                            : theme.palette.gray.gray3, // inactive = gray
                                }}
                            />
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 mt-6 md:mt-12 lg:mt-32">
                        <Button variant="outlined" color="primary" onClick={completeOnboarding}>
                            {t("messages.skip")}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                if (isLastScreen) {
                                    completeOnboarding();
                                } else {
                                    setActiveTab((prev) => prev + 1);
                                }
                            }}
                        >
                            {isLastScreen ? t("messages.get_started") : t("messages.next")}
                        </Button>
                    </div>
                </div>
            </div>
        </Box>
    );
}
