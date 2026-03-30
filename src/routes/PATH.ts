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
        }
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
        VIEW_PLAYLIST: {
            ROOT: (playlistId?: number, id?: number) => id && playlistId ? `/videos/playlist/${playlistId}/course/${id}` : "/videos/playlist/:playlistId/course/:id"
        }
    },
    AUDIOS: {
        ROOT: "/audios"
    },
    NOTES: {
        ROOT: "/notes"
    },
    MY_COURSE: {
        ROOT: "/my-course"
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
            ROOT: (subscriptionId?: number) => (subscriptionId ? `/subscription/${subscriptionId}/purchase` : "/subscription/:subscriptionId/purchase"),
            SUCCESS: {
                ROOT: (subscriptionId?: number) => (subscriptionId ? `/subscription/${subscriptionId}/purchase/success` : "/subscription/:subscriptionId/purchase/success"),
            },
            FAILURE: {
                ROOT: (subscriptionId?: number) => (subscriptionId ? `/subscription/${subscriptionId}/purchase/failure` : "/subscription/:subscriptionId/purchase/failure"),
            },
        },
    },
};
