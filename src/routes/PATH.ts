import type { PurchaseModuleTypes } from "../types/purchase";

export const PATH = {
    AUTH: {
        LOGIN: {
            ROOT: "/auth/login",
        },
        REGISTER: {
            ROOT: "/auth/register",
        },
        VERIFY_OTP: {
            ROOT: "/auth/verify-otp",
        },
        FORGOT_OTP: {
            ROOT: "/auth/forgot-otp",
        },
        BRIDGE: {
            ROOT: "/auth/bridge"
        },
        CHOOSE_PLATFORM: {
            ROOT: "/choose-platform"
        },
        CHOOSE_PREFERED_LANG: {
            ROOT: "/prefered-language"
        },
        INTRO: {
            ROOT: "/intro"
        },
        INTEREST: {
            ROOT: "/auth/interest"
        },
        DEVICE_RESET: {
            ROOT: "/auth/device-reset",
            SUCCESS: {
                ROOT: "/auth/device-reset/success",
            },
        },
        SET_PASSWORD: {
            ROOT: "/auth/set-password",
        },
        FORGOT_PASSWORD: {
            ROOT: "/auth/forgot-password",
            VERIFY: { ROOT: "/auth/forgot-password/verify" },
            RESET: { ROOT: "/auth/forgot-password/reset" },
        },
        RESET_PASSWORD: {
            ROOT: "/reset-password",
        },
    },
    DASHBOARD: {
        ROOT: "/dashboard",
    },
    COURSE_MANAGEMENT: {
        ROOT: "/course-management",
        COURSES: {
            ROOT: "/courses",
            VIEW_COURSE: {
                ROOT: (id?: number) => (id ? `/courses/${id}` : "/courses/:id"),
                TEST_CATEGORY: {
                    ROOT: (id?: number, test_category_id?: number) => id && test_category_id ? `/courses/${id}/test/test-category/${test_category_id}` : "/courses/:id/test/test-category/:test_category_id",
                }
            },
            JOIN_LIVE: {
                ROOT: (courseId?: number, liveId?: number) => (courseId && liveId ? `/courses/${courseId}/live/${liveId}` : "/courses/:courseId/live/:liveId"),
            },
            PURCHASE: {
                ROOT: (id?: number, moduleType?: PurchaseModuleTypes) => (id ? `/${moduleType}/${id}/purchase` : "/:type/:id/purchase"),
                SUCCESS: {
                    ROOT: (id?: number, moduleType?: PurchaseModuleTypes) =>
                        (id ? `/${moduleType}/${id}/purchase/success` : "/:type/:id/purchase/success"),
                },
                FAILURE: {
                    ROOT: (id?: number, moduleType?: PurchaseModuleTypes) =>
                        (id ? `/${moduleType}/${id}/purchase/failure` : "/:type/:id/purchase/failure"),
                },
            },
            PLANS: {
                ROOT: `/courses/:id/plans`
            },
            VIEW_TEST: {
                ROOT: ({ courseId, testId }: { courseId?: number; testId?: number }) =>
                    courseId && testId
                        ? `/courses/${courseId}/test/${testId}`
                        : `/courses/:courseId/test/:testId`,
                REVIEW_TEST: {
                    ROOT: ({ courseId, testId }: { courseId?: number; testId?: number }) =>
                        courseId && testId
                            ? `/courses/${courseId}/test/${testId}/review`
                            : `/courses/:courseId/test/:testId/review`,
                    REVIEW_SUBJECTIVE_TEST: {
                        ROOT: ({ courseId, testId }: { courseId?: number; testId?: number }) =>
                            courseId && testId
                                ? `/courses/${courseId}/test/${testId}/review/subjective`
                                : `/courses/:courseId/test/:testId/review/subjective`,
                    }
                },
                SUBJECTIVE_TEST: {
                    ROOT: ({ courseId, testId }: { courseId?: number; testId?: number }) =>
                        courseId && testId
                            ? `/courses/${courseId}/test/${testId}/subjective`
                            : `/courses/:courseId/test/:testId/subjective`,
                }
            },
            SAVED_COURSES: {
                ROOT: "/courses/saved-courses"
            }
        },
    },
    LIVE_CLASSES: {
        ROOT: "/live-classes",
        BY_COURSE: {
            ROOT: (courseId?: number) => (courseId ? `/live-classes/course/${courseId}` : "/live-classes/course/:courseId"),
        },
        VIEW_LIVE_CLASS: {
            ROOT: (id?: number) => (id ? `/live-classes/${id}` : "/live-classes/:id"),
        },
    },
    TEST: {
        ROOT: "/test",
        EXPLORE_TEST: {
            ROOT: "/explore-test",
            INDIVIDUAl_TEST: {
                ROOT: "/explore-test/individual-test"
            },
            BUNDLE_TEST: {
                ROOT: "/explore-test/bundle-test",
                VIEW_BUNDLE: {
                    ROOT: (id?: number) => (id ? `/explore-test/bundle-test/${id}` : "/explore-test/bundle-test/:id")
                }
            },
            OMR: {
                ROOT: "/explore-test/omr-test"
            }
        },
        VIEW_TEST: {
            ROOT: ({ testId }: { testId?: number }) =>
                testId
                    ? `/test/${testId}`
                    : `/test/:testId`,
            REVIEW_TEST: {
                ROOT: ({ testId }: { testId?: number }) =>
                    testId
                        ? `/test/${testId}/review`
                        : `/test/:testId/review`,
                REVIEW_SUBJECTIVE_TEST: {
                    ROOT: ({ testId }: { testId?: number }) =>
                        testId
                            ? `/test/${testId}/review/subjective`
                            : `/test/:testId/review/subjective`,
                }
            },
            SUBJECTIVE_TEST: {
                ROOT: ({ testId }: { testId?: number }) =>
                    testId
                        ? `/test/${testId}/subjective`
                        : `/test/:testId/subjective`,
            }
        },
        MY_TEST: {
            ROOT: "/test/my-tests",
            TEST_CATEGORY: {
                ROOT: (courseId?: number) => (courseId ? `/test/my-tests/course/${courseId}/test-category` : "/test/my-tests/course/:courseId/test-category"),
                VIEW_TEST_CATEGORY: {
                    ROOT: (courseId?: number, test_category_id?: number) => (courseId && test_category_id ? `/test/my-tests/course/${courseId}/test-category/${test_category_id}` : "/test/my-tests/course/:courseId/test-category/:test_category_id"),
                }
            },
            BY_COURSE: {
                ROOT: (courseId?: number) => (courseId ? `/test/my-tests/course/${courseId}` : "/test/my-tests/course/:courseId"),
            },
        },
        MY_INDIVIDUAl_TEST: {
            ROOT: "/test/my-individual-test"
        },
        MY_BUNDLES: {
            ROOT: "/test/my-bundle-test"
        }
    },
    VIDEOS: {
        ROOT: "/videos",
        BY_COURSE: {
            ROOT: (courseId?: number) => (courseId ? `/videos/course/${courseId}` : "/videos/course/:courseId"),
        },
        VIEW_PLAYLIST: {
            ROOT: (playlistId?: number, id?: number) => id && playlistId ? `/videos/playlist/${playlistId}/course/${id}` : "/videos/playlist/:playlistId/course/:id"
        }
    },
    AUDIOS: {
        ROOT: "/audios",
        BY_COURSE: {
            ROOT: (courseId?: number) => (courseId ? `/audios/course/${courseId}` : "/audios/course/:courseId"),
        },
    },
    NOTES: {
        ROOT: "/notes",
        BY_COURSE: {
            ROOT: (courseId?: number) => (courseId ? `/notes/course/${courseId}` : "/notes/course/:courseId"),
        },
    },
    MY_COURSE: {
        ROOT: "/my-course",
        VIEW_COURSE: {
            ROOT: (id?: number) => (id ? `/my-course/${id}` : "/my-course/:id"),
        },
    },
    MY_PACKAGE: {
        ROOT: "/my-package",
        COURSE: { ROOT: "/my-package/course" },
        NOTES: { ROOT: "/my-package/notes" },
        VIDEO: { ROOT: "/my-package/video" },
        AUDIO: { ROOT: "/my-package/audio" },
        TEST: { ROOT: "/my-package/test" },
        LIVE_CLASS: { ROOT: "/my-package/live-class" },
    },
    EXPLORE_PACKAGE: {
        ROOT: "/explore-package",
        COURSE: { ROOT: "/explore-package/course" },
        NOTES: { ROOT: "/explore-package/notes" },
        VIDEO: { ROOT: "/explore-package/video" },
        AUDIO: { ROOT: "/explore-package/audio" },
        TEST: { ROOT: "/explore-package/test" },
        LIVE_CLASS: { ROOT: "/explore-package/live-class" },
    },
    FREE_MATERIALS: {
        ROOT: "/free-materials",
    },
    GORKHAPATRA: {
        ROOT: "/gorkhapatra",
        VIEW_GORKHAPATRA: {
            ROOT: (id?: number) => id ? `/gorkhapatra/${id}` : "/gorkhapatra/:id"
        }
    },
    NOTICE: {
        ROOT: "/notice",
        VIEW_NOTICE: {
            ROOT: (id?: number) => id ? `/notice/${id}` : "/notice/:id"
        }
    },
    SETTINGS: {
        PROFILE: {
            ROOT: "/profile"
        },
        LINKED_DEVICES: {
            ROOT: "/linked-devices"
        },
        TRANSACTIONS: {
            ROOT: "/transactions"
        }
    },
    SUPPORT: {
        ROOT: "/support"
    },
    PRIVACY_POLICY: {
        ROOT: "/privacy-policy"
    },
    SUBSCRIPTION: {
        PURCHASE: {
            ROOT: (courseId?: number, subscriptionId?: number) => (courseId && subscriptionId ? `/subscription/${courseId}/${subscriptionId}/purchase` : "/subscription/:courseId/:subscriptionId/purchase"),
            SUCCESS: {
                ROOT: (courseId?: number, subscriptionId?: number) => (courseId && subscriptionId ? `/subscription/${courseId}/${subscriptionId}/purchase/success` : "/subscription/:courseId/:subscriptionId/purchase/success"),
            },
            FAILURE: {
                ROOT: (courseId?: number, subscriptionId?: number) => (courseId && subscriptionId ? `/subscription/${courseId}/${subscriptionId}/purchase/failure` : "/subscription/:courseId/:subscriptionId/purchase/failure"),
            },
        },
    },
    DISCUSSION: {
        ROOT: "/discussions",
        CREATE: {
            ROOT: "/discussions/create",
        },
        DETAIL: {
            ROOT: (id?: number) => id ? `/discussions/${id}` : "/discussions/:id",
        },
        EDIT: {
            ROOT: (id?: number) => id ? `/discussions/${id}/edit` : "/discussions/:id/edit",
        },
    },
    LEARNING_CANVAS: {
        COURSE_OVERVIEW: {
            ROOT: (courseId?: number) =>
                courseId ? `/learning-canvas/${courseId}` : "/learning-canvas/:courseId",
        },
        CONTENT_VIEWER: {
            ROOT: (courseId?: number, contentId?: number) =>
                courseId && contentId
                    ? `/learning-canvas/${courseId}/content/${contentId}`
                    : "/learning-canvas/:courseId/content/:contentId",
        },
        QUIZ: {
            ROOT: (courseId?: number, quizId?: number) =>
                courseId && quizId
                    ? `/learning-canvas/${courseId}/quiz/${quizId}`
                    : "/learning-canvas/:courseId/quiz/:quizId",
            REVIEW: {
                ROOT: (courseId?: number, quizId?: number) =>
                    courseId && quizId
                        ? `/learning-canvas/${courseId}/quiz/${quizId}/review`
                        : "/learning-canvas/:courseId/quiz/:quizId/review",
            },
        },
        ASSIGNMENT: {
            ROOT: (courseId?: number, assignmentId?: number) =>
                courseId && assignmentId
                    ? `/learning-canvas/${courseId}/assignment/${assignmentId}`
                    : "/learning-canvas/:courseId/assignment/:assignmentId",
            REVIEW: {
                ROOT: (courseId?: number, assignmentId?: number) =>
                    courseId && assignmentId
                        ? `/learning-canvas/${courseId}/assignment/${assignmentId}/review`
                        : "/learning-canvas/:courseId/assignment/:assignmentId/review",
            },
        },
        COMPLETION: {
            ROOT: (courseId?: number) =>
                courseId ? `/learning-canvas/${courseId}/completed` : "/learning-canvas/:courseId/completed",
        },
    },
    REFERRAL: {
        ROOT: "/referrals",
    },
    TRACK: {
        ROOT: (code?: string) => code ? `/track/${code}` : "/track/:code",
    },
    TICKET: {
        ROOT: "/tickets",
        ALL_TICKETS: {
            ROOT: "/tickets/all-tickets",
        },
        CHATS: {
            ROOT: "/tickets/chats",
            DETAIL: {
                ROOT: (id?: number) => id ? `/tickets/chats/${id}` : "/tickets/chats/:ticketId",
            },
        },
        TICKET_TYPES: {
            ROOT: "/tickets/ticket-types",
        },
    },
};
