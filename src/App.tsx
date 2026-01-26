import { Typography } from "@mui/material";
import { Book, SearchNormal, Star } from "iconsax-reactjs";
import InfoCard from "./components/organism/Cards/InfoCard";

export default function App() {


  const exploreCoursesCards = [
    {
      title: "Browse Courses",
      description:
        "Discover new courses, explore different subjects, and find the perfect learning path for your goals.",
      icon: <SearchNormal />,
      cta: { url: "/courses", label: "Browse Course" },
    },
    {
      title: "Recommended Courses",
      description:
        "Get personalized course recommendations based on your interests and learning history.",
      icon: <Star />,
      cta: { url: "/recommended", label: "View Recommendations" },
    },
    {
      title: "Saved Content",
      description:
        "Access your saved courses and continue learning from where you left off.",
      icon: <Book />,
      cta: { url: "/saved", label: "View Saved" },
    },
  ];
  return (
    <div className="h-full overflow-auto">
      {/* <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="col-span-1" key={index}>
            <AnalyticsCard icon={<Courthouse />} title="Total Courses" description="1,250" />
          </div>
        ))}
      </div> */}
      {/* <Typography variant="h4" fontWeight={600} className="mb-4! mt-8!">My Course</Typography>
      <Typography variant="h4" fontWeight={600} className="mb-4! mt-8!">Live Classes</Typography>
      <Typography variant="h4" fontWeight={600} className="mb-4! mt-8!">Available Tests</Typography> */}
      <Typography variant="h4" fontWeight={600} className="mb-4! mt-8!">Explore Course</Typography>
      <div className="flex flex-col gap-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-6">
        {exploreCoursesCards.map((card, index) => (
          <InfoCard
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            cta={card.cta}
          />
        ))}
      </div>
      {/* <Typography variant="h4" fontWeight={600} className="mb-4! mt-8!">Explore Course</Typography>
      <div className="flex flex-col gap-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-6">
        {exploreCoursesCards.map((card, index) => (
          <InfoCard
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            cta={card.cta}
          />
        ))}
      </div> */}
    </div>
  )
}
