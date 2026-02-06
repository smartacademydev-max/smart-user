import { Box, Divider, Typography, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import type { TestProps } from "../../../types/question";
import { formatDateCustom } from "../../../utils/dateFormat";
import { getStatus } from "../../../utils/getStatus";
import TestActionButton from "./TestActionButton";

export default function TestCard({ test, havePurchased, }: { test: TestProps; havePurchased: boolean; }) {
  const theme = useTheme();
  const status = getStatus(test?.start_datetime, test?.end_datetime);
  const { id } = useParams();
  return (
    <Box
      className="test__card rounded-md p-4 flex flex-col justify-between"
      sx={{
        border: `1px solid ${theme.palette.separator.dark}`,
      }}
    >
      <div className="top__wrapper">
        <div className="test__card__top flex gap-3">
          <Box className="w-full flex justify-between items-start gap-4">
            <Typography variant="subtitle1" fontWeight={600} color="text.dark">
              {test?.name}
            </Typography>

            <Typography
              color="text.main"
              bgcolor={"gray.gray1"}
              className="text-[11px]! px-2.5 py-1.5 rounded-md ml-2 font-semibold! capitalize"
            >
              {status}
            </Typography>
          </Box>
        </div>

        <Divider className="my-3!" />

        {/* Content Section */}
        <div className="test__card__content flex flex-col gap-2">
          <div className="flex gap-1 items-center">
            <Typography variant="subtitle2" fontWeight={500} color="text.secondary" className="flex">
              Exam Type:
            </Typography>
            <Typography variant="subtitle2" fontWeight={500} color="text.dark" >
              {test?.test_type}
            </Typography>
          </div>
          <div className="flex gap-1 items-center">
            <Typography variant="subtitle2" color="text.secondary" className="flex">
              Date:
            </Typography>
            <Typography variant="subtitle2" fontWeight={600} color="text.dark" >
              {formatDateCustom(test?.start_datetime, { shortMonth: true })}
            </Typography>
          </div>
        </div>
      </div>

      <div className="bottom__wrapper">
        <Box
          component="div"
          bgcolor={"gray.gray1"}
          px={3}
          py={1.75}
          borderRadius="6px"
          my="12px"
        >
          <Box className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <Typography variant="subtitle2" color="text.secondary" className="inline-flex">
                Questions:
              </Typography>
              <Typography variant="subtitle2" fontWeight={500} color="text.dark" >
                {test?.total_questions}
              </Typography>
            </div>

            <div className="flex items-center gap-2">
              <Typography variant="subtitle2" color="text.secondary" className="inline-flex">
                Duration:
              </Typography>
              <Typography
                variant="subtitle2"
                fontWeight={500}
                color="text.dark"

                sx={{ textWrap: "nowrap" }}
              >
                {test?.duration.hours} Hrs {test?.duration.minutes} Mins
              </Typography>
            </div>
          </Box>

          <Divider className="my-2!" />

          <Box className="flex justify-between items-center gap-2">
            <div className="flex gap-1 itesm-center">
              <Typography variant="subtitle2" color="text.secondary" className="inline-flex">
                Full marks:
              </Typography>
              <Typography variant="subtitle2" fontWeight={500} color="text.dark" >
                {test?.full_mark}
              </Typography>
            </div>

            <div className="flex gap-1 items-center">
              <Typography variant="subtitle2" color="text.secondary" className="inline-flex">
                Pass marks:
              </Typography>
              <Typography variant="subtitle2" fontWeight={500} color="text.dark" >
                {test?.pass_mark}
              </Typography>
            </div>
          </Box>
        </Box>


        <TestActionButton
          test={test}
          status={status}
          havePurchased={havePurchased}
          id={test?.course_id ? Number(test?.course_id) : Number(id)}
        />


      </div>
    </Box>
  );
}
