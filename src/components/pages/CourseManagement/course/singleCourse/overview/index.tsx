import { Typography } from "@mui/material";
import type { Teacher } from "../../../../../../types/course";
import { renderHtml } from "../../../../../../utils/renderHtml";
import InstructorCard from "../../../../../organism/Cards/InstructorCard";

interface Props {
    data?: {
        about_this_course: string;
        teachers: Teacher[];
    }
    isLoading: boolean;
}
export default function SinlgeCourseOverview({ data }: Props) {

    return (
        <div className="pb-4">
            {data?.about_this_course ? <div className="general__content__box styled__list">
                {renderHtml(data?.about_this_course || "")}
            </div> : ""}

            {data?.teachers.length ? <div >
                <Typography className="my-4!">Instructors</Typography>
                <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                    {
                        data?.teachers.length ? data?.teachers.map((teacher) => (
                            <InstructorCard key={teacher.id} teacher={teacher} />
                        )) : ""
                    }
                </div>
            </div> : ""}
        </div>
    )
}
