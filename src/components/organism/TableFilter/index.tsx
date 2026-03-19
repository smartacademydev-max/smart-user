import { Box, Button, OutlinedInput, Typography, useTheme } from "@mui/material";
import { FilterSquare, SearchNormal } from "iconsax-reactjs";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { CourseProps } from "../../../types/course";
import FilterModal from "../Dialog/Filter";

export type LayoutProps = "table" | "grid"
interface TableFilterProps {
  search: string;
  setSearch: (newValue: string) => void;
  onFilter?: () => void;
  layout?: LayoutProps;
  setLayout?: Dispatch<SetStateAction<LayoutProps>>;
  categoryLayout?: boolean;
  title?: string;
  myCourses?: CourseProps[];
  selectedCourseId?: number | null;
  setSelectedCourseId?: (id: number | null) => void;
}

export default function TableFilter({
  search,
  setSearch,
  onFilter,
  myCourses,
  selectedCourseId,
  setSelectedCourseId,
}: TableFilterProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Box className={`flex gap-2 md:grid md:grid-cols-12 justify-between items-center`}>
      <div className={!onFilter ? "col-span-12" : "col-span-6"}>
        <OutlinedInput
          fullWidth
          placeholder="Search"
          name="search"
          id="search"
          startAdornment={<SearchNormal size={16} color={theme.palette.text.middle} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            gap: "8px",
          }}
        />
      </div>
      <div className="col-span-6">
        <div className="filter__right max-w-fit ml-auto">
          {onFilter && (
            <Button
              fullWidth
              startIcon={<FilterSquare variant="Bold" color={theme.palette.text.dark} />}
              sx={{
                border: `1px solid ${theme.palette.separator.dark}`,
                "& .MuiButton-startIcon": {
                  mr: {
                    xs: 0
                  }
                }
              }}
              className="py-2.5! px-3.5! rounded-md! text-center justify-center! gap-2! items-center!"
              onClick={() => setOpen(true)}
            >
              <Typography variant="subtitle2" color="text.dark" className="hidden! md:flex!">
                Filter
              </Typography>
            </Button>
          )}
        </div>
      </div>
      <FilterModal
        open={open}
        onClose={() => setOpen(false)}
        onResetFilter={() => { }}
        selections={[]}
        myCourses={myCourses}
        selectedCourseId={selectedCourseId}
        setSelectedCourseId={setSelectedCourseId}
      />
    </Box>
  );
}