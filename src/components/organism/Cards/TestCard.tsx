import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Calendar, Clock, Medal, Notepad2 } from "iconsax-reactjs";
import { useParams } from "react-router-dom";
import type { TestProps } from "../../../types/question";
import { formatDateTime } from "../../../utils/dateFormat";
import { getStatus } from "../../../utils/getStatus";
import { getTestProgressStatus } from "../../../utils/statusMap";
import StatusPillWithBorder from "../../atom/StatusPillWithBorder";
import type { TestStatus } from "../../pages/TestManagement/allTest/AllTestList";
import TestActionButton from "./TestActionButton";

export default function TestCard({ test, havePurchased, status: testStatus }: { test: TestProps; havePurchased: boolean; status?: TestStatus }) {
  const status = getStatus(test?.start_datetime, test?.end_datetime);
  const { id } = useParams();
  const variant = getTestProgressStatus(test?.has_taken_test ? "completed" : "not_started");
  console.log(testStatus)
  return (
    <Box
      className="test__card rounded-md p-4 flex flex-col justify-between"
      sx={{
        border: (theme) => `1px solid ${theme.palette[variant].main}`,
        borderTop: (theme) => `4px solid ${theme.palette[variant].main}`,
      }}
    >
      <div className="card__top">
        <div className="flex justify-between items-center mb-3">
          <Typography variant="caption" fontWeight={500} sx={{
            padding: "6px 10px",
            borderRadius: "8px",
            background: (theme) => theme.palette.primary.light,
            color: (theme) => theme.palette.primary.main,
          }}>{test?.selections?.mega_category[0] || "Loksewa"}</Typography>
          <StatusPillWithBorder showIcon={true} variant={variant} status={!test?.has_taken_test ? "Not Started" : "Completed"} />
        </div>
        <Typography variant="subtitle1" fontWeight={600} color="text.dark" className="mb-3!">
          {test?.name}
        </Typography>
        {test?.start_datetime ?
          <Stack gap={1} color="text.middle" className="mb-3" alignItems={"center"}>
            <Box sx={{
              color: (theme) => theme.palette.text.middle
            }}>
              <Calendar size={16} />
            </Box>
            <Typography variant="subtitle2" color="text.middle" className="flex">
              Start Date:
            </Typography>
            <Typography variant="subtitle2" color="text.dark" fontWeight={600}>{formatDateTime(test?.start_datetime)}</Typography>
          </Stack>
          : ""}

        <Box className="flex justify-between items-center gap-2">
          <Typography variant="caption" color="text.dark" className="flex items-center gap-1">
            <Box sx={{ color: (theme) => theme.palette.info.main }}><Notepad2 size={16} variant="Bold" /></Box>  <strong>{test?.total_questions}</strong> Total Questions
          </Typography>
          <Typography variant="caption" color="text.dark" className="flex items-center gap-1">
            <Box sx={{ color: (theme) => theme.palette.success.main }}><Clock variant="Bold" size={16} /></Box>
            <strong>{test?.duration.hours}</strong> Hrs  <strong>: {test?.duration.minutes}</strong> Mins
          </Typography>
        </Box>
        <Divider className="my-1.5!" />
        <Box className="flex justify-between items-center gap-2">
          <Typography variant="caption" color="text.dark" className="flex items-center gap-1">
            <Box sx={{ color: (theme) => theme.palette.error.main }}><Medal variant="Bold" size={16} /></Box>
            <strong>{test?.full_mark}</strong> Total Marks
          </Typography>
          <Typography variant="caption" color="text.dark" className="flex items-center gap-1">
            <Box sx={{ color: (theme) => theme.palette.warning.main }}><Medal variant="Bold" size={16} /></Box>
            <strong> {test?.pass_mark}</strong> Pass marks
          </Typography>
        </Box>
      </div>
      <div className="bottom__wrapper mt-3">
        {havePurchased && test?.test_type === "omr" ? <div className="flex justify-end items-center gap-2 mt-5">
          <Button
            variant="outlined"
            color="primary"
            component="a"
            href={test?.download_format_url}
            download
          >
            Download Format
          </Button>
          <Button variant="contained" color="primary">Start Now</Button>
        </div> :
          <TestActionButton
            test={test}
            status={status}
            havePurchased={havePurchased}
            id={test?.course_id ? Number(test?.course_id) : Number(id)}
          />}
      </div>
    </Box>
  );
}
