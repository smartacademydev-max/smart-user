import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { logout } from "./authSlice";

export interface TestRunnerState {
    /** The test being sat, or null when no attempt is open. */
    testId: number | null;
    /** The course it was opened from. Reaches the API as `course_id`. */
    courseId?: number;
}

/**
 * Deliberately not persisted. Which paper is open is a thing the student did,
 * not a thing about them — restoring it from this device meant a reload put the
 * test over whatever page they happened to land on, uninvited.
 *
 * Nothing is lost by letting it go: the answers and the clock are kept per test
 * in localStorage by the runner itself, so reopening the paper from its card
 * offers "Resume test" with the time that was left.
 */
const initialState: TestRunnerState = {
    testId: null,
    courseId: undefined,
};

const testRunnerSlice = createSlice({
    name: "testRunner",
    initialState,
    reducers: {
        openTest: (
            state,
            action: PayloadAction<{ testId: number; courseId?: number }>
        ) => {
            state.testId = action.payload.testId;
            state.courseId = action.payload.courseId;
        },
        closeTest: (state) => {
            state.testId = null;
            state.courseId = undefined;
        },
    },
    extraReducers: (builder) => {
        /** An attempt must never outlive the session that opened it. */
        builder.addCase(logout, (state) => {
            state.testId = null;
            state.courseId = undefined;
        });
    },
});

export const { openTest, closeTest } = testRunnerSlice.actions;
export default testRunnerSlice.reducer;
