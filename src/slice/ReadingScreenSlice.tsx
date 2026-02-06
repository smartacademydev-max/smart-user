import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CurriculumMediaType } from "../types/course";
import type { MediaProps } from "../types/media";

export interface ReadingScreenProps {
    media?: MediaProps | undefined;
    title?: string;
    message?: string;
    open: boolean;
    type?: CurriculumMediaType;
    isYouTube?: boolean;
    mediaId?: string;
    courseId?: number | null;
    playlistId?: number | null;
}

const initialState: ReadingScreenProps = {
    media: undefined,
    title: undefined,
    message: undefined,
    open: false,
    type: undefined,
    isYouTube: false,
    courseId: undefined,
    mediaId: undefined,
};

export const readingScreen = createSlice({
    name: "readingScreen",
    initialState,
    reducers: {
        setReadingScreen: (state, action: PayloadAction<Partial<ReadingScreenProps>>) => {
            return { ...state, ...action.payload };
        },

        resetReadingScreen: () => initialState,
    },
});

export const { setReadingScreen, resetReadingScreen } = readingScreen.actions;

export default readingScreen.reducer;