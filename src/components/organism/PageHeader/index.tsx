import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { Add } from "iconsax-reactjs";
import { Link, useNavigate } from "react-router-dom";
interface Props {
  breadcrumb: { icon?: React.ReactElement; title: string; url?: string }[];
  description?: string;
  cta?: {
    icon?: React.ReactElement;
    label?: string;
    url?: string;
    openInNewTab?: boolean;
  };
  handleOpenPopup?: () => void;
}

export default function PageHeader(props: Props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { breadcrumb, cta, description, handleOpenPopup } = props;
  return (
    <Box
      className="page__header lg:grid lg:grid-cols-12  pb-2 mb-4  items-center"
      sx={{
        borderBottom: `1px solid ${theme.palette.separator.dark}`,
      }}
    >
      <div className="header__content lg:col-span-9">
        <Stack
          className="breadcrumb"
          sx={(theme) => ({
            gap: "8px",
            "& .breadcrumb__item": {
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: theme.palette.text.middle,
              textDecoration: "none",
              "&:not(:last-child)": {
                color: theme.palette.text.disabled || theme.palette.text.middle,
                "a svg path": {
                  fill:
                    theme.palette.text.disabled || theme.palette.text.middle,
                },
              },
              "&:last-child": {
                color: theme.palette.text.primary,
                fontWeight: 500,
                ">svg": {
                  display: "none",
                },
              },
              "& a": {
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
                color: "inherit",
              },
            },
          })}
        >
          {breadcrumb &&
            breadcrumb.map((item) => (
              <div className="breadcrumb__item" key={item.title}>
                <Link
                  to={item.url || ""}
                  className="flex items-center gap-2 mr-2"
                >
                  {item?.icon ? item?.icon : ""}
                  {item?.title ? (
                    <Typography variant="h3" className="capitalize" fontWeight={600}>{item?.title}</Typography>
                  ) : (
                    ""
                  )}
                </Link>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="9"
                  height="18"
                  viewBox="0 0 9 18"
                  fill="none"
                >
                  <path
                    d="M0.75 16.59L7.27 10.07C8.04 9.3 8.04 8.04 7.27 7.27L0.75 0.75"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    stroke-miterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ))}
        </Stack>
        {description ? (
          <Typography variant="subtitle2" color="text.middle" fontWeight={400}>{description}</Typography>
        ) : (
          ""
        )}
      </div>
      {cta || handleOpenPopup ? (
        <div className="text-end lg:col-span-3">
          <Button
            variant="contained"
            color="primary"
            startIcon={(cta && cta?.icon) || <Add />}
            onClick={() => {
              if (handleOpenPopup) {
                return handleOpenPopup();
              }
              navigate(cta?.url || "");
            }}
          >
            {cta?.label}
          </Button>
        </div>
      ) : (
        ""
      )}
    </Box>
  );
}
