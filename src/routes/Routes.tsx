import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import AuthRoot from "../components/pages/auth";
import Login from "../components/pages/auth/login";
import Register from "../components/pages/auth/register";
import VerifyOTP from "../components/pages/auth/verifyOtp";
import CourseRoot from "../components/pages/CourseManagement/course";
import AllCourses from "../components/pages/CourseManagement/course/allCourse";
import SingleCourse from "../components/pages/CourseManagement/course/singleCourse";

import AuthBridge from "../components/pages/auth/bridge";
import ChoosePlatform from "../components/pages/auth/choosePlatform";
import InterestRoot from "../components/pages/auth/interest";
import IntroScreenRoot from "../components/pages/auth/introScreens";
import SelectPreferedLanguage from "../components/pages/auth/selectPreferedLang";
import SavedCourse from "../components/pages/CourseManagement/course/savedCourse";
import SingleLiveClassRoot from "../components/pages/CourseManagement/course/singleLiveClass";
import LiveClassRoot from "../components/pages/CourseManagement/liveClasses";
import AllLiveClass from "../components/pages/CourseManagement/liveClasses/allLiveClass";
import MyCourseRoot from "../components/pages/CourseManagement/myCourse";
import GorkhapatraRoot from "../components/pages/Gorkhapatra";
import AllGorkhapatras from "../components/pages/Gorkhapatra/AllGorkhapatra";
import SingleGorkhapatraRoot from "../components/pages/Gorkhapatra/SingleGorkhapatra";
import AuthLayout from "../components/pages/layout/AuthLayout";
import NotFound from "../components/pages/layout/NotFound";
import SingleFormAuthLayout from "../components/pages/layout/SingleFormAuthLayout";
import AudiosRoot from "../components/pages/MediaManagement/audios";
import AllAudios from "../components/pages/MediaManagement/audios/allAudios";
import NotesRoot from "../components/pages/MediaManagement/notes";
import AllNotes from "../components/pages/MediaManagement/notes/allNotes";
import VideosRoot from "../components/pages/MediaManagement/videos";
import CoursePlaylist from "../components/pages/MediaManagement/videos/allPlaylist";
import SinglePlaylist from "../components/pages/MediaManagement/videos/allPlaylist/singlePlaylist";
import AllNotices from "../components/pages/NoticeBoard/allNotices";
import NoticeRoot from "../components/pages/NoticeBoard/index.";
import SingleNoticeRoot from "../components/pages/NoticeBoard/singleNotice";
import PrivacyPolicyRoot from "../components/pages/PrivacyPolicy";
import PurchaseRoot from "../components/pages/Purchase";
import PurchaseFailure from "../components/pages/Purchase/failure";
import PurchaseLayout from "../components/pages/Purchase/PurchaseLayout";
import PaymentSuccessPage from "../components/pages/Purchase/success";
import SettingRoot from "../components/pages/Settings";
import LinkedDevices from "../components/pages/Settings/LinkedDevices";
import ProfilePage from "../components/pages/Settings/ProfilePage";
import SupportRoot from "../components/pages/Support";
import TestManagementRoot from "../components/pages/TestManagement";
import AllTestRoot from "../components/pages/TestManagement/allTest";
import ExploreTestRoot from "../components/pages/TestManagement/exploreTest";
import ExploreBundle from "../components/pages/TestManagement/exploreTest/bundles/ExploreBundle";
import SingleBundle from "../components/pages/TestManagement/exploreTest/bundles/singleBundle";
import ExploreAllTest from "../components/pages/TestManagement/exploreTest/ExploreAllTest";
import ExploreIndividualTest from "../components/pages/TestManagement/exploreTest/ExploreIndividualTest";
import ExploreOmr from "../components/pages/TestManagement/exploreTest/ExploreOmr";
import MyBundles from "../components/pages/TestManagement/myTests/MyBundles";
import MyIndividualTest from "../components/pages/TestManagement/myTests/MyIndividualTest";
import ReviewTestRoot from "../components/pages/TestManagement/reviewTest";
import ReviewSubjectTestRoot from "../components/pages/TestManagement/reviewTest/subjective";
import SingleSubjectiveTest from "../components/pages/TestManagement/singleSubjectiveTest";
import SingleTestRoot from "../components/pages/TestManagement/singleTest";
import { PATH } from "./PATH";
import Private from "./Private";
import RootLayout from "./RootLayout";

const router = createBrowserRouter([
  {
    path: PATH.AUTH.CHOOSE_PLATFORM.ROOT,
    element: <ChoosePlatform />
  },
  {
    path: PATH.AUTH.CHOOSE_PREFERED_LANG.ROOT,
    element: <SelectPreferedLanguage />
  },
  {
    path: PATH.AUTH.INTRO.ROOT,
    element: <IntroScreenRoot />
  },
  {
    element: <AuthRoot />,
    children: [
      {
        path: PATH.AUTH.VERIFY_OTP.ROOT,
        element: (
          <SingleFormAuthLayout>
            <VerifyOTP />
          </SingleFormAuthLayout>
        ),
      },
      {
        path: PATH.AUTH.INTEREST.ROOT,
        element: (
          <SingleFormAuthLayout>
            <InterestRoot />
          </SingleFormAuthLayout>
        ),
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: PATH.AUTH.LOGIN.ROOT,
            element: <Login />,
          },
          {
            path: PATH.AUTH.REGISTER.ROOT,
            element: <Register />,
          },
          {
            path: PATH.AUTH.BRIDGE.ROOT,
            element: <AuthBridge />,
          },
        ],
      },
    ],
  },
  {
    element: <Private />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            index: true, path: "/", element: <App />
          },
          {
            path: PATH.DASHBOARD.ROOT, element: <App />
          },
          // COURSE INSIDE LAYOUT
          {
            element: <CourseRoot />,
            children: [
              { path: PATH.COURSE_MANAGEMENT.COURSES.ROOT, element: <AllCourses /> },
              { path: PATH.COURSE_MANAGEMENT.COURSES.VIEW_COURSE.ROOT(), element: <SingleCourse /> },
              { path: PATH.COURSE_MANAGEMENT.COURSES.VIEW_TEST.ROOT({}), element: <SingleTestRoot /> },
              { path: PATH.COURSE_MANAGEMENT.COURSES.VIEW_TEST.SUBJECTIVE_TEST.ROOT({}), element: <SingleSubjectiveTest /> },
              { path: PATH.COURSE_MANAGEMENT.COURSES.VIEW_TEST.REVIEW_TEST.ROOT({}), element: <ReviewTestRoot /> },
              { path: PATH.COURSE_MANAGEMENT.COURSES.VIEW_TEST.REVIEW_TEST.REVIEW_SUBJECTIVE_TEST.ROOT({}), element: <ReviewSubjectTestRoot /> },
              { path: PATH.COURSE_MANAGEMENT.COURSES.SAVED_COURSES.ROOT, element: <SavedCourse /> },
            ],
          },

          {
            element:
              <TestManagementRoot />,
            children: [
              { path: PATH.TEST.MY_TEST.ROOT, element: <AllTestRoot /> },
              { path: PATH.TEST.MY_INDIVIDUAl_TEST.ROOT, element: <MyIndividualTest /> },
              { path: PATH.TEST.MY_BUNDLES.ROOT, element: <MyBundles /> },
              { path: PATH.TEST.VIEW_TEST.ROOT({}), element: <SingleTestRoot /> },
              { path: PATH.TEST.VIEW_TEST.SUBJECTIVE_TEST.ROOT({}), element: <SingleSubjectiveTest /> },
              { path: PATH.TEST.VIEW_TEST.REVIEW_TEST.ROOT({}), element: <ReviewTestRoot /> },
              { path: PATH.TEST.VIEW_TEST.REVIEW_TEST.REVIEW_SUBJECTIVE_TEST.ROOT({}), element: <ReviewSubjectTestRoot /> },
            ]
          },
          {
            element: <ExploreTestRoot />,
            children: [
              { path: PATH.TEST.EXPLORE_TEST.ROOT, element: <ExploreAllTest /> },
              { path: PATH.TEST.EXPLORE_TEST.INDIVIDUAl_TEST.ROOT, element: <ExploreIndividualTest /> },
              { path: PATH.TEST.EXPLORE_TEST.BUNDLE_TEST.ROOT, element: <ExploreBundle /> },
              { path: PATH.TEST.EXPLORE_TEST.OMR.ROOT, element: <ExploreOmr /> },
            ]
          },
          { path: PATH.TEST.EXPLORE_TEST.BUNDLE_TEST.VIEW_BUNDLE.ROOT(), element: <SingleBundle /> },
          {
            element:
              <PurchaseRoot />,
            children: [
              { path: PATH.COURSE_MANAGEMENT.COURSES.PURCHASE.ROOT(), element: <PurchaseLayout /> },
              { path: PATH.COURSE_MANAGEMENT.COURSES.PURCHASE.ROOT(), element: <PurchaseLayout /> },
              { path: PATH.COURSE_MANAGEMENT.COURSES.PURCHASE.SUCCESS.ROOT(), element: <PaymentSuccessPage /> },
              { path: PATH.COURSE_MANAGEMENT.COURSES.PURCHASE.FAILURE.ROOT(), element: <PurchaseFailure /> },
              // { path: PATH.COURSE_MANAGEMENT.COURSES.PURCHASE.SUCCESS.ROOT(), element: <PaymentSuccessPage /> },
              // { path: PATH.COURSE_MANAGEMENT.COURSES.PURCHASE.FAILURE.ROOT(), element: <PurchaseFailure /> },
              // { path: PATH.COURSE_MANAGEMENT.LIVE_CLASSES.PURCHASE.ROOT(), element: <PurchaseLayout /> },
            ],
          },
          {
            path: PATH.MY_COURSE.ROOT,
            element:
              <MyCourseRoot />,
          },
          {

            element:
              <LiveClassRoot />,
            children: [{
              path: PATH.LIVE_CLASSES.ROOT,
              element: <AllLiveClass />
            }]
          },
          {

            element:
              <NotesRoot />,
            children: [
              { path: PATH.NOTES.ROOT, element: <AllNotes /> }
            ]
          },
          {

            element:
              <TestManagementRoot />,
            children: [
              { path: PATH.TEST.ROOT, element: <AllTestRoot /> }
            ]
          },
          {
            element:
              <VideosRoot />,
            children: [
              { path: PATH.VIDEOS.ROOT, element: <CoursePlaylist /> },
              { path: PATH.VIDEOS.VIEW_PLAYLIST.ROOT(), element: <SinglePlaylist /> }
            ]
          },
          {
            element:
              <GorkhapatraRoot />,
            children: [
              { path: PATH.GORKHAPATRA.ROOT, element: <AllGorkhapatras /> },
              { path: PATH.GORKHAPATRA.VIEW_GORKHAPATRA.ROOT(), element: <SingleGorkhapatraRoot /> },
            ]
          },
          {
            element:
              <NoticeRoot />,
            children: [
              { path: PATH.NOTICE.ROOT, element: <AllNotices /> },
              { path: PATH.NOTICE.VIEW_NOTICE.ROOT(), element: <SingleNoticeRoot /> },
            ]
          },
          {
            element:
              <AudiosRoot />,
            children: [
              { path: PATH.AUDIOS.ROOT, element: <AllAudios /> }
            ]
          },
          {
            element: <SettingRoot />,
            children: [
              { path: PATH.SETTINGS.PROFILE.ROOT, element: <ProfilePage /> },
              { path: PATH.SETTINGS.LINKED_DEVICES.ROOT, element: <LinkedDevices /> },
            ]
          },
          {
            path: PATH.SUPPORT.ROOT,
            element:
              <SupportRoot />
          },
        ]
      },

      {
        element:
          <CourseRoot />,
        children: [
          { path: PATH.COURSE_MANAGEMENT.COURSES.JOIN_LIVE.ROOT(), element: <SingleLiveClassRoot /> },
        ],
      },
    ]
  },
  {
    path: PATH.PRIVACY_POLICY.ROOT,
    element:
      <PrivacyPolicyRoot />
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
export default function GlobalRoutes() {
  return <RouterProvider router={router} />;
}
