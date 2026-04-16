import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import { useGetAppSettingsQuery } from "../../../services/settingApi";

export default function MaintenancePage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: settingsData } = useGetAppSettingsQuery();

  const phones = settingsData?.data?.phones ?? [];
  const emails = settingsData?.data?.emails ?? [];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: (t) => t.palette.background.default,
        color: (t) => t.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        textAlign: "center",
      }}
    >
      {/* Logo */}
      <Box sx={{ mb: 5 }}>
        <img
          src={isDark ? "/logo-dark.svg" : "/logo.svg"}
          alt="UDAAN LMS"
          style={{ height: 48, objectFit: "contain" }}
        />
      </Box>

      {/* Animated gear */}
      <Box sx={{ mb: 4 }}>
        <svg
          width="100"
          height="100"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animation: "udaan-spin 8s linear infinite" }}
        >
          <style>{`
            @keyframes udaan-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          <path
            d="M60 35a25 25 0 1 0 0 50 25 25 0 0 0 0-50zm0 40a15 15 0 1 1 0-30 15 15 0 0 1 0 30z"
            fill="#1D82F5"
          />
          <path
            d="M60 10v10M60 100v10M10 60h10M100 60h10M25.1 25.1l7.07 7.07M87.93 87.93l7.07 7.07M94.9 25.1l-7.07 7.07M32.07 87.93l-7.07 7.07"
            stroke="#1D82F5"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </Box>

      {/* Heading */}
      <Typography
        variant="h3"
        fontWeight={700}
        sx={{
          background: "linear-gradient(90deg, #1D82F5, #F59E0B)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 2,
        }}
      >
        Under Maintenance
      </Typography>

      <Typography
        variant="h6"
        sx={{ color: (t) => t.palette.text.secondary, mb: 1.5, maxWidth: 480 }}
      >
        We're making some improvements to give you a better experience.
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: (t) => t.palette.text.disabled, maxWidth: 420 }}
      >
        Our team is working hard to get things back up and running. Please check back
        soon — we appreciate your patience.
      </Typography>

      {/* Contact info */}
      {(phones.length > 0 || emails.length > 0) && (
        <Box
          sx={{
            mt: 5,
            px: 4,
            py: 3,
            borderRadius: 2,
            border: (t) => `1px solid ${t.palette.divider}`,
            bgcolor: (t) => t.palette.background.paper,
            maxWidth: 400,
            width: "100%",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Need help? Reach out to us
          </Typography>

          <Stack spacing={1.5} flexDirection={"column"} divider={<Divider flexItem />}>
            {emails.map((email, i) => (
              <Stack key={i} direction="row" alignItems="center" spacing={1.5}>
                <img
                  src={email.icon_url || "/mail-icon.svg"}
                  alt=""
                  style={{ width: 20, height: 20, objectFit: "contain", flexShrink: 0 }}
                />
                <Box textAlign="left">
                  {email.label && (
                    <Typography variant="caption" color="text.disabled" display="block" sx={{ textTransform: "capitalize" }}>
                      {email.label}
                    </Typography>
                  )}
                  <a href={`mailto:${email.value}`} style={{ textDecoration: "none" }}>
                    <Typography variant="body2" color="primary" fontWeight={500}>
                      {email.value}
                    </Typography>
                  </a>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}

      {/* Footer */}
      <Box
        sx={{
          mt: 5,
          width: 60,
          height: 4,
          borderRadius: 2,
          background: "linear-gradient(90deg, #1D82F5, #F59E0B)",
        }}
      />
      <Typography variant="caption" sx={{ mt: 2, color: (t) => t.palette.text.disabled }}>
        © {new Date().getFullYear()} UDAAN LMS. All rights reserved.
      </Typography>
    </Box>
  );
}
