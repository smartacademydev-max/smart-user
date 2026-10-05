import { PATH } from "../routes/PATH";

// Where to send the user after register/login, from the deep-link params an external
// site (e.g. the WordPress course page) puts on the auth URL: ?course=48, ?test=, ?bundle=
// Visitors from a campaign link (?campaign=CODE&course=73) land on the course's Tests tab;
// the course page falls back to its first tab when the course has no tests.
export function getPendingRedirectUrl(searchParams: URLSearchParams): string {
    const courseId = searchParams.get("course");
    const testId = searchParams.get("test");
    const bundleId = searchParams.get("bundle");
    if (courseId) {
        const coursePath = PATH.COURSE_MANAGEMENT.COURSES.VIEW_COURSE.ROOT(Number(courseId));
        return searchParams.get("campaign") ? `${coursePath}?tab=tests` : coursePath;
    }
    if (testId) return PATH.TEST.ROOT;
    if (bundleId) return PATH.TEST.EXPLORE_TEST.BUNDLE_TEST.VIEW_BUNDLE.ROOT(Number(bundleId));
    return "";
}

// Appends redirect_url to the OTP page link so verify-otp lands on the pending page.
export function withRedirectUrl(path: string, redirectUrl: string): string {
    if (!redirectUrl) return path;
    const sep = path.includes("?") ? "&" : "?";
    return `${path}${sep}redirect_url=${encodeURIComponent(redirectUrl)}`;
}
