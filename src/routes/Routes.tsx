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
import AuthLayout from "../components/pages/layout/AuthLayout";
import NotFound from "../components/pages/layout/NotFound";
import SingleFormAuthLayout from "../components/pages/layout/SingleFormAuthLayout";
import AudiosRoot from "../components/pages/MediaManagement/audios";
import AllAudios from "../components/pages/MediaManagement/audios/allAudios";
import NotesRoot from "../components/pages/MediaManagement/notes";
import AllNotes from "../components/pages/MediaManagement/notes/allNotes";
import VideosRoot from "../components/pages/MediaManagement/videos";
import AllVideos from "../components/pages/MediaManagement/videos/allVideos";
import PrivacyPolicyRoot from "../components/pages/PrivacyPolicy";
import PurchaseRoot from "../components/pages/Purchase";
import PurchaseFailure from "../components/pages/Purchase/failure";
import PurchaseLayout from "../components/pages/Purchase/PurchaseLayout";
import PaymentSuccessPage from "../components/pages/Purchase/success";
import SupportRoot from "../components/pages/Support";
import TestManagementRoot from "../components/pages/TestManagement";
import AllTestRoot from "../components/pages/TestManagement/allTest";
import ReviewTestRoot from "../components/pages/TestManagement/reviewTest";
import ReviewSubjectTestRoot from "../components/pages/TestManagement/reviewTest/subjective";
import SingleSubjectiveTest from "../components/pages/TestManagement/singleSubjectiveTest";
import SingleTestRoot from "../components/pages/TestManagement/singleTest";
import MyAccount from "../components/pages/UserManagement/MyAccount";
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
          // COURSE OUTSIDE LAYOUT

          {
            element:
              <TestManagementRoot />
            ,
            children: [
              { path: PATH.TEST.ROOT, element: <AllTestRoot /> },

            ]
          },
          {
            element:
              <PurchaseRoot />
            ,
            children: [
              { path: PATH.COURSE_MANAGEMENT.COURSES.PURCHASE.ROOT(), element: <PurchaseLayout /> },
              { path: PATH.COURSE_MANAGEMENT.COURSES.PURCHASE.SUCCESS.ROOT, element: <PaymentSuccessPage /> },
              { path: PATH.COURSE_MANAGEMENT.COURSES.PURCHASE.FAILURE.ROOT, element: <PurchaseFailure /> },
              // { path: PATH.COURSE_MANAGEMENT.LIVE_CLASSES.PURCHASE.ROOT(), element: <PurchaseLayout /> },
            ],
          },
          {
            path: PATH.MY_COURSE.ROOT,
            element:
              <MyCourseRoot />
            ,
          },
          {

            element:
              <LiveClassRoot />
            ,
            children: [{
              path: PATH.LIVE_CLASSES.ROOT,
              element: <AllLiveClass />
            }]
          },
          {

            element:
              <NotesRoot />
            ,
            children: [
              { path: PATH.NOTES.ROOT, element: <AllNotes /> }
            ]
          },
          {

            element:
              <TestManagementRoot />
            ,
            children: [
              { path: PATH.TEST.ROOT, element: <AllTestRoot /> }
            ]
          },
          {

            element:
              <VideosRoot />
            ,
            children: [
              { path: PATH.VIDEOS.ROOT, element: <AllVideos /> }
            ]
          },
          {
            element:
              <AudiosRoot />
            ,
            children: [
              { path: PATH.AUDIOS.ROOT, element: <AllAudios /> }
            ]
          },
          {
            path: PATH.USER.MY_ACCOUNT.ROOT,
            element:
              <MyAccount />

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
