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
import DeviceResetForm from "../components/pages/auth/deviceReset";
import DeviceResetSuccess from "../components/pages/auth/deviceReset/success";
import ForgotPasswordPage from "../components/pages/auth/forgotPassword";
import ForgotPasswordReset from "../components/pages/auth/forgotPassword/reset";
import ForgotPasswordVerify from "../components/pages/auth/forgotPassword/verify";
import InterestRoot from "../components/pages/auth/interest";
import IntroScreenRoot from "../components/pages/auth/introScreens";
import SelectPreferedLanguage from "../components/pages/auth/selectPreferedLang";
import SetPasswordPage from "../components/pages/auth/setPassword";
import SavedCourse from "../components/pages/CourseManagement/course/savedCourse";
import SingleLiveClassRoot from "../components/pages/CourseManagement/course/singleLiveClass";
import LiveClassRoot from "../components/pages/CourseManagement/liveClasses";
import AllLiveClass from "../components/pages/CourseManagement/liveClasses/allLiveClass";
import LiveClassesByCourseLanding from "../components/pages/CourseManagement/liveClasses/LiveClassesByCourseLanding";
import MyCourseRoot from "../components/pages/CourseManagement/myCourse";
import MyPackageRoot from "../components/pages/MyPackage";
import MyPackageCourse from "../components/pages/MyPackage/MyPackageCourse";
import MyPackageNotes from "../components/pages/MyPackage/MyPackageNotes";
import MyPackageVideo from "../components/pages/MyPackage/MyPackageVideo";
import MyPackageAudio from "../components/pages/MyPackage/MyPackageAudio";
import MyPackageTest from "../components/pages/MyPackage/MyPackageTest";
import MyPackageLiveClass from "../components/pages/MyPackage/MyPackageLiveClass";
import ExplorePackageRoot from "../components/pages/ExplorePackage";
import ExplorePackageCourse from "../components/pages/ExplorePackage/ExplorePackageCourse";
import ExplorePackageNotes from "../components/pages/ExplorePackage/ExplorePackageNotes";
import ExplorePackageVideo from "../components/pages/ExplorePackage/ExplorePackageVideo";
import ExplorePackageAudio from "../components/pages/ExplorePackage/ExplorePackageAudio";
import ExplorePackageTest from "../components/pages/ExplorePackage/ExplorePackageTest";
import ExplorePackageLiveClass from "../components/pages/ExplorePackage/ExplorePackageLiveClass";
import FreeMaterials from "../components/pages/FreeMaterials";
import DiscussionManagementRoot from "../components/pages/DiscussionManagement";
import AllDiscussions from "../components/pages/DiscussionManagement/allDiscussions";
import DiscussionDetail from "../components/pages/DiscussionManagement/DiscussionDetail";
import DiscussionForm from "../components/pages/DiscussionManagement/DiscussionForm";
import GorkhapatraRoot from "../components/pages/Gorkhapatra";
import AllGorkhapatras from "../components/pages/Gorkhapatra/AllGorkhapatra";
import SingleGorkhapatraRoot from "../components/pages/Gorkhapatra/SingleGorkhapatra";
import AuthLayout from "../components/pages/layout/AuthLayout";
import NotFound from "../components/pages/layout/NotFound";
import SingleFormAuthLayout from "../components/pages/layout/SingleFormAuthLayout";
import LearningCanvasRoot from "../components/pages/LearningCanvas";
import AssignmentTaking from "../components/pages/LearningCanvas/AssignmentTaking";
import CourseCompletion from "../components/pages/LearningCanvas/Completion";
import ContentViewer from "../components/pages/LearningCanvas/ContentViewer";
import LearningCanvasCourseOverview from "../components/pages/LearningCanvas/CourseOverview";
import QuizTaking from "../components/pages/LearningCanvas/QuizTaking";
import ReviewPage from "../components/pages/LearningCanvas/Review";
import AudiosRoot from "../components/pages/MediaManagement/audios";
import AllAudios from "../components/pages/MediaManagement/audios/allAudios";
import AudiosByCourseLanding from "../components/pages/MediaManagement/audios/AudiosByCourseLanding";
import NotesRoot from "../components/pages/MediaManagement/notes";
import AllNotes from "../components/pages/MediaManagement/notes/allNotes";
import NotesByCourseLanding from "../components/pages/MediaManagement/notes/NotesByCourseLanding";
import VideosRoot from "../components/pages/MediaManagement/videos";
import CoursePlaylist from "../components/pages/MediaManagement/videos/allPlaylist";
import SinglePlaylist from "../components/pages/MediaManagement/videos/allPlaylist/singlePlaylist";
import VideosByCourseLanding from "../components/pages/MediaManagement/videos/VideosByCourseLanding";
import AllNotices from "../components/pages/NoticeBoard/allNotices";
import NoticeRoot from "../components/pages/NoticeBoard/index.";
import SingleNoticeRoot from "../components/pages/NoticeBoard/singleNotice";
import PrivacyPolicyRoot from "../components/pages/PrivacyPolicy";
import PurchaseRoot from "../components/pages/Purchase";
import PurchaseFailure from "../components/pages/Purchase/failure";
import PurchaseLayout from "../components/pages/Purchase/PurchaseLayout";
import PaymentSuccessPage from "../components/pages/Purchase/success";
import ReferralPage from "../components/pages/Referral";
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
import TestsByCourseLanding from "../components/pages/TestManagement/TestsByCourseLanding";
import TicketManagementRoot from "../components/pages/TicketManagement";
import AllTickets from "../components/pages/TicketManagement/allTickets";
import TicketChats from "../components/pages/TicketManagement/chats";
import TrackRedirect from "../components/pages/Track";
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
        path: PATH.AUTH.DEVICE_RESET.ROOT,
        element: (
          <SingleFormAuthLayout>
            <DeviceResetForm />
          </SingleFormAuthLayout>
        ),
      },
      {
        path: PATH.AUTH.DEVICE_RESET.SUCCESS.ROOT,
        element: (
          <SingleFormAuthLayout>
            <DeviceResetSuccess />
          </SingleFormAuthLayout>
        ),
      },
      {
        path: PATH.AUTH.FORGOT_PASSWORD.VERIFY.ROOT,
        element: (
          <SingleFormAuthLayout>
            <ForgotPasswordVerify />
          </SingleFormAuthLayout>
        ),
      },
      {
        path: PATH.AUTH.FORGOT_PASSWORD.RESET.ROOT,
        element: (
          <SingleFormAuthLayout>
            <ForgotPasswordReset />
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
          {
            path: PATH.AUTH.FORGOT_PASSWORD.ROOT,
            element: <ForgotPasswordPage />,
          },
        ],
      },
    ],
  },
  {
    element: <Private />,
    children: [
      {
        path: PATH.AUTH.SET_PASSWORD.ROOT,
        element: <SetPasswordPage />,
      },
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
              { path: PATH.TEST.MY_TEST.ROOT, element: <TestsByCourseLanding /> },
              { path: PATH.TEST.MY_TEST.BY_COURSE.ROOT(), element: <AllTestRoot /> },
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
              { path: PATH.SUBSCRIPTION.PURCHASE.ROOT(), element: <PurchaseLayout /> },
              { path: PATH.SUBSCRIPTION.PURCHASE.SUCCESS.ROOT(), element: <PaymentSuccessPage /> },
              { path: PATH.SUBSCRIPTION.PURCHASE.FAILURE.ROOT(), element: <PurchaseFailure /> },
            ],
          },
          {
            element: <CourseRoot />,
            children: [
              { path: PATH.MY_COURSE.ROOT, element: <MyCourseRoot /> },
              { path: PATH.MY_COURSE.VIEW_COURSE.ROOT(), element: <SingleCourse /> },
            ],
          },
          {
            element: <MyPackageRoot />,
            children: [
              { path: PATH.MY_PACKAGE.COURSE.ROOT, element: <MyPackageCourse /> },
              { path: PATH.MY_PACKAGE.NOTES.ROOT, element: <MyPackageNotes /> },
              { path: PATH.MY_PACKAGE.VIDEO.ROOT, element: <MyPackageVideo /> },
              { path: PATH.MY_PACKAGE.AUDIO.ROOT, element: <MyPackageAudio /> },
              { path: PATH.MY_PACKAGE.TEST.ROOT, element: <MyPackageTest /> },
              { path: PATH.MY_PACKAGE.LIVE_CLASS.ROOT, element: <MyPackageLiveClass /> },
            ],
          },
          {
            element: <ExplorePackageRoot />,
            children: [
              { path: PATH.EXPLORE_PACKAGE.COURSE.ROOT, element: <ExplorePackageCourse /> },
              { path: PATH.EXPLORE_PACKAGE.NOTES.ROOT, element: <ExplorePackageNotes /> },
              { path: PATH.EXPLORE_PACKAGE.VIDEO.ROOT, element: <ExplorePackageVideo /> },
              { path: PATH.EXPLORE_PACKAGE.AUDIO.ROOT, element: <ExplorePackageAudio /> },
              { path: PATH.EXPLORE_PACKAGE.TEST.ROOT, element: <ExplorePackageTest /> },
              { path: PATH.EXPLORE_PACKAGE.LIVE_CLASS.ROOT, element: <ExplorePackageLiveClass /> },
            ],
          },
          { path: PATH.FREE_MATERIALS.ROOT, element: <FreeMaterials /> },
          {

            element:
              <LiveClassRoot />,
            children: [
              { path: PATH.LIVE_CLASSES.ROOT, element: <LiveClassesByCourseLanding /> },
              { path: PATH.LIVE_CLASSES.BY_COURSE.ROOT(), element: <AllLiveClass /> }
            ]
          },
          {

            element:
              <NotesRoot />,
            children: [
              { path: PATH.NOTES.ROOT, element: <NotesByCourseLanding /> },
              { path: PATH.NOTES.BY_COURSE.ROOT(), element: <AllNotes /> }
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
              { path: PATH.VIDEOS.ROOT, element: <VideosByCourseLanding /> },
              { path: PATH.VIDEOS.BY_COURSE.ROOT(), element: <CoursePlaylist /> },
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
              { path: PATH.AUDIOS.ROOT, element: <AudiosByCourseLanding /> },
              { path: PATH.AUDIOS.BY_COURSE.ROOT(), element: <AllAudios /> }
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
          {
            element:
              <DiscussionManagementRoot />,
            children: [
              { path: PATH.DISCUSSION.ROOT, element: <AllDiscussions /> },
              { path: PATH.DISCUSSION.CREATE.ROOT, element: <DiscussionForm /> },
              { path: PATH.DISCUSSION.DETAIL.ROOT(), element: <DiscussionDetail /> },
              { path: PATH.DISCUSSION.EDIT.ROOT(), element: <DiscussionForm /> },
            ],
          },
          {
            element: <LearningCanvasRoot />,
            children: [
              // { path: PATH.LEARNING_CANVAS.ROOT, element: <LearningCanvasAllCourses /> },
              { path: PATH.LEARNING_CANVAS.COURSE_OVERVIEW.ROOT(), element: <LearningCanvasCourseOverview /> },
              { path: PATH.LEARNING_CANVAS.CONTENT_VIEWER.ROOT(), element: <ContentViewer /> },
              { path: PATH.LEARNING_CANVAS.QUIZ.ROOT(), element: <QuizTaking /> },
              { path: PATH.LEARNING_CANVAS.QUIZ.REVIEW.ROOT(), element: <ReviewPage /> },
              { path: PATH.LEARNING_CANVAS.ASSIGNMENT.ROOT(), element: <AssignmentTaking /> },
              { path: PATH.LEARNING_CANVAS.ASSIGNMENT.REVIEW.ROOT(), element: <ReviewPage /> },
              { path: PATH.LEARNING_CANVAS.COMPLETION.ROOT(), element: <CourseCompletion /> },
            ],
          },
          {
            path: PATH.REFERRAL.ROOT,
            element: <ReferralPage />,
          },
          {
            element: (
              <TicketManagementRoot />
            ),
            children: [
              { path: PATH.TICKET.ALL_TICKETS.ROOT, element: <AllTickets /> },
              { path: PATH.TICKET.CHATS.ROOT, element: <TicketChats /> },
              { path: PATH.TICKET.CHATS.DETAIL.ROOT(), element: <TicketChats /> },
            ],
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
    path: PATH.TRACK.ROOT(),
    element: <TrackRedirect />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
export default function GlobalRoutes() {
  return <RouterProvider router={router} />;
}
