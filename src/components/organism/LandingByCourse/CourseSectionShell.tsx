import { ArrowRight2 } from "iconsax-reactjs";
import { Link } from "react-router-dom";

interface Props {
    courseName: string;
    count?: number;
    viewAllUrl: string;
    viewAllDisabled?: boolean;
    children: React.ReactNode;
}

export default function CourseSectionShell({ courseName, count, viewAllUrl, viewAllDisabled, children }: Props) {
    return (
        <section className="course__section mb-6 p-4 md:p-5 rounded-2xl border border-gray-200 bg-gray-50/40">
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-block w-1 h-6 rounded-full bg-primary shrink-0" aria-hidden />
                    <h3 className="text-xl font-bold truncate">{courseName}</h3>
                    {typeof count === "number" && (
                        <span className="text-sm font-medium text-gray-500 shrink-0">({count})</span>
                    )}
                </div>
                {!viewAllDisabled && (
                    <Link
                        to={viewAllUrl}
                        className="text-sm font-semibold text-primary hover:underline shrink-0 flex items-center gap-1"
                    >
                        View all
                        <ArrowRight2 size={14} />
                    </Link>
                )}
            </div>
            <div className="course__section__body">{children}</div>
        </section>
    );
}
