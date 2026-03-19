import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme
} from "@mui/material";
import { AudioSquare, Book, Bookmark, Document, DocumentText, Element4, I24Support, Notepad2, Notification, PenAdd, SearchNormal, VideoOctagon, VideoPlay } from "iconsax-reactjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";

export default function PrimaryMenu() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const [openTest, setOpenTest] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  const isTestManagementActive = () => {
    return location.pathname.startsWith(PATH.TEST.ROOT) ||
      location.pathname.startsWith(PATH.TEST.ROOT);
  };

  return (
    <div className="primary__menu__wrapper relative">
      <Box sx={{ padding: "16px 10px 32px", maxHeight: "calc(100vh - 72px)", overflow: "auto" }} className="primary__menu  relative">
        <div className="flex items-center gap-2 overflow-hidden mb-1">
          <Typography variant='overline' mb={1} sx={{
            color: "rgba(156,163,176,0.55)",
            fontWeight: 600,
            letterSpacing: "1px",
            textTransform: "uppercase",
            paddingLeft: "8px",
            whiteSpace: "nowrap",
          }}>{t("messages.main")}</Typography>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.07)" }} className="w-full" />
        </div>
        <List>
          <ListItem disablePadding className="menu__item">
            <ListItemButton
              onClick={() => navigate(PATH.DASHBOARD.ROOT)}
              className={isActive(PATH.DASHBOARD.ROOT) ? "active" : ""}
            >
              <ListItemIcon>
                <Element4 size={20} />
              </ListItemIcon>
              <ListItemText primary={t("menus.dashboard")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding className="menu__item">
            <ListItemButton
              onClick={() => navigate(PATH.MY_COURSE.ROOT)}
              className={isActive(PATH.MY_COURSE.ROOT) ? "active" : ""}
            >
              <ListItemIcon>
                <Book size={20} />
              </ListItemIcon>
              <ListItemText primary={t("menus.myCourse")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding className="menu__item">
            <ListItemButton
              onClick={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.ROOT)}
              className={isActive(PATH.COURSE_MANAGEMENT.COURSES.ROOT) ? "active" : ""}
            >
              <ListItemIcon>
                <SearchNormal size={20} />
              </ListItemIcon>
              <ListItemText primary={t("menus.exploreCourse")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding className="menu__item">
            <ListItemButton
              onClick={() => navigate(PATH.TEST.EXPLORE_TEST.ROOT)}
              className={isActive(PATH.TEST.EXPLORE_TEST.ROOT) ? "active" : ""}
            >
              <ListItemIcon>
                <Document size={20} />
              </ListItemIcon>
              <ListItemText primary={t("menus.exploreTest")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding className="menu__item">
            <ListItemButton
              onClick={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.SAVED_COURSES.ROOT)}
              className={isActive(PATH.COURSE_MANAGEMENT.COURSES.SAVED_COURSES.ROOT) ? "active" : ""}
            >
              <ListItemIcon>
                <Bookmark size={20} />
              </ListItemIcon>
              <ListItemText primary={t("menus.savedCourse")} />
            </ListItemButton>
          </ListItem>
        </List>

        <div className="flex items-center gap-2 overflow-hidden mb-1 mt-6">
          <Typography variant='overline' mb={1} sx={{
            color: "rgba(156,163,176,0.55)",
            fontWeight: 600,
            letterSpacing: "1px",
            textTransform: "uppercase",
            paddingLeft: "8px",
            whiteSpace: "nowrap",
          }}>{t("messages.learning")}</Typography>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.07)" }} className="w-full" />
        </div>

        <List>
          <ListItem disablePadding className="menu__item">
            <ListItemButton
              onClick={() => navigate(PATH.LIVE_CLASSES.ROOT)}
              className={isActive(PATH.LIVE_CLASSES.ROOT) ? "active" : ""}
            >
              <ListItemIcon>
                <VideoPlay />
              </ListItemIcon>
              <ListItemText primary={t("menus.liveClasses")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding className="menu__item">
            <ListItemButton
              onClick={() => navigate(PATH.NOTES.ROOT)}
              className={isActive(PATH.NOTES.ROOT) ? "active" : ""}
            >
              <ListItemIcon>
                <Notepad2 />
              </ListItemIcon>
              <ListItemText primary={t("menus.notes")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding className="menu__item">
            <ListItemButton
              onClick={() => setOpenTest((prev) => !prev)}
              className={isTestManagementActive() ? "active" : ""}>
              <ListItemIcon>
                <PenAdd size={20} />
              </ListItemIcon>
              <ListItemText primary={t("messages.my_test")} />
              {openTest ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openTest} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 3 }}>
                <ListItem disablePadding className="menu__item">
                  <ListItemButton
                    onClick={() => navigate(PATH.TEST.MY_TEST.ROOT)}
                    className={location.pathname.startsWith(PATH.TEST.MY_TEST.ROOT) ? "active-nested" : ""}>
                    <ListItemText
                      primary={t("messages.course_based_tests")}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding className="menu__item">
                  <ListItemButton
                    onClick={() => navigate(PATH.TEST.MY_INDIVIDUAl_TEST.ROOT)}
                    className={location.pathname.startsWith(PATH.TEST.MY_INDIVIDUAl_TEST.ROOT) ? "active-nested" : ""}>
                    <ListItemText
                      primary={t("messages.individually_purchased_tests")}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding className="menu__item">
                  <ListItemButton
                    onClick={() => navigate(PATH.TEST.MY_BUNDLES.ROOT)}
                    className={location.pathname.startsWith(PATH.TEST.MY_BUNDLES.ROOT) ? "active-nested" : ""}>
                    <ListItemText
                      primary={t("messages.test_bundle")}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
          </ListItem>
          <ListItem disablePadding className="menu__item">
            <ListItemButton
              onClick={() => navigate(PATH.VIDEOS.ROOT)}
              className={isActive(PATH.VIDEOS.ROOT) ? "active" : ""}
            >
              <ListItemIcon>
                <VideoOctagon size={20} />
              </ListItemIcon>
              <ListItemText primary={t("menus.videos")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding className="menu__item">
            <ListItemButton
              onClick={() => navigate(PATH.AUDIOS.ROOT)}
              className={isActive(PATH.AUDIOS.ROOT) ? "active" : ""}
            >
              <ListItemIcon>
                <AudioSquare size={20} />
              </ListItemIcon>
              <ListItemText primary={t("menus.audios")} />
            </ListItemButton>
          </ListItem>

        </List>

        <div className="flex items-center gap-2 overflow-hidden mb-1 mt-6 text-nowrap">
          <Typography variant='overline' mb={1} sx={{
            color: "rgba(156,163,176,0.55)",
            fontWeight: 600,
            letterSpacing: "1px",
            textTransform: "uppercase",
            paddingLeft: "8px",
            whiteSpace: "nowrap",
          }}>{t("messages.news_updates")}</Typography>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.07)" }} className="w-full" />
        </div>
        <List>
          <ListItem disablePadding className="menu__item">
            <ListItemButton
              onClick={() => navigate(PATH.GORKHAPATRA.ROOT)}
              className={isActive(PATH.GORKHAPATRA.ROOT) ? "active" : ""}
            >
              <ListItemIcon>
                <DocumentText size={20} />
              </ListItemIcon>
              <ListItemText primary={t("messages.gorkhapatra")} className="text-nowrap!" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding className="menu__item">
            <ListItemButton
              onClick={() => navigate(PATH.NOTICE.ROOT)}
              className={isActive(PATH.NOTICE.ROOT) ? "active" : ""}
            >
              <ListItemIcon>
                <Notification size={20} />
              </ListItemIcon>
              <ListItemText primary={t("messages.notice")} className="text-nowrap!" />
            </ListItemButton>
          </ListItem>
        </List>
        {/* <div className="flex items-center gap-2 overflow-hidden mb-1 mt-8">
        <Typography variant='caption' mb={1} sx={{
          color: theme.palette.text.light
        }}>{t("messages.communication")}</Typography>
        <Divider sx={{
          borderColor: "#4B4B4B"
        }} className="w-full" />
      </div>

      <List>
        <ListItem disablePadding className="menu__item">
          <ListItemButton
            onClick={() => { }}
            className={isActive(PATH.LIVE_CLASSES.ROOT) ? "active" : ""}
          >
            <ListItemIcon>
              <Message2 />
            </ListItemIcon>
            <ListItemText primary={t("menus.messages")} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding className="menu__item">
          <ListItemButton
            onClick={() => { }}
            className={isActive(PATH.MY_COURSE.ROOT) ? "active" : ""}
          >
            <ListItemIcon>
              <MoreSquare />
            </ListItemIcon>
            <ListItemText primary={t("menus.rooms")} />
          </ListItemButton>
        </ListItem>
      </List> */}
        <div className="flex items-center gap-2 overflow-hidden mb-1 mt-6">
          <Typography variant='overline' mb={1} sx={{
            color: "rgba(156,163,176,0.55)",
            fontWeight: 600,
            letterSpacing: "1px",
            textTransform: "uppercase",
            paddingLeft: "8px",
            whiteSpace: "nowrap",
          }}>{t("messages.others")}</Typography>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.07)" }} className="w-full" />
        </div>

        <List>
          {/* <ListItem disablePadding className="menu__item">
          <ListItemButton
            onClick={() => { }}
            className={isActive(PATH.LIVE_CLASSES.ROOT) ? "active" : ""}
          >
            <ListItemIcon>
              <UserSquare />
            </ListItemIcon>
            <ListItemText primary={t("menus.alumni")} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding className="menu__item">
          <ListItemButton
            onClick={() => { }}
            className={isActive(PATH.MY_COURSE.ROOT) ? "active" : ""}
          >
            <ListItemIcon>
              <MessageQuestion />
            </ListItemIcon>
            <ListItemText primary={t("menus.feedback")} />
          </ListItemButton>
        </ListItem> */}
          <ListItem disablePadding className="menu__item">
            <ListItemButton
              onClick={() => navigate(PATH.SUPPORT.ROOT)}
              className={isActive(PATH.SUPPORT.ROOT) ? "active" : ""}
            >
              <ListItemIcon>
                <I24Support size={20} />
              </ListItemIcon>
              <ListItemText primary={t("menus.support")} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Box className="absolute! bottom-0 right-0 left-0 h-10" sx={{
        background: (theme) => `linear-gradient(to top, ${theme.palette.background.sidebar} 60%,transparent)`
      }} />
    </div>
  );
}
