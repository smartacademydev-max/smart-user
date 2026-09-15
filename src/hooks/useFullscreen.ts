import { useCallback, useEffect, useState } from "react";

/**
 * Safari names every part of the Fullscreen API with a `webkit` prefix, and
 * older TypeScript DOM libs only declare the standard names — so both spellings
 * are reached for through these.
 */
type FullscreenElement = HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void;
};

type FullscreenDocument = Document & {
    webkitFullscreenElement?: Element | null;
    webkitExitFullscreen?: () => Promise<void> | void;
    webkitFullscreenEnabled?: boolean;
};

const activeElement = () => {
    const doc = document as FullscreenDocument;
    return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
};

const isFullscreenSupported = () => {
    if (typeof document === "undefined") return false;
    const doc = document as FullscreenDocument;
    return Boolean(doc.fullscreenEnabled ?? doc.webkitFullscreenEnabled);
};

/**
 * Takes the whole document full screen.
 *
 * The document, not some element within it: the test opens as an overlay over
 * the app rather than as a page of its own, so there is nothing to single out —
 * and going document-wide keeps every portalled dialog and toast inside the
 * full-screen subtree, where they are still painted.
 *
 * A browser only grants the request inside a user gesture, so it is called from
 * the click that starts a test rather than from an effect once the screen has
 * mounted.
 */
export async function requestDocumentFullscreen(): Promise<void> {
    if (!isFullscreenSupported()) return;
    if (activeElement()) return;

    const root = document.documentElement as FullscreenElement;

    try {
        await (root.requestFullscreen?.() ?? root.webkitRequestFullscreen?.());
    } catch {
        // Refused by policy, or by a browser that only does video full screen.
        // The test's start gate still offers it on its own button, so the
        // attempt is never blocked by this.
    }
}

/**
 * Reports where the document currently is and moves it in and out.
 *
 * iPhone Safari has no element full screen at all; `isSupported` is false there
 * so the caller can skip the lock rather than trapping a student behind a gate
 * that can never be satisfied.
 */
export function useFullscreen() {
    const [isFullscreen, setIsFullscreen] = useState(() => activeElement() !== null);
    const [isSupported] = useState(isFullscreenSupported);

    useEffect(() => {
        const sync = () => setIsFullscreen(activeElement() !== null);

        sync();
        document.addEventListener("fullscreenchange", sync);
        document.addEventListener("webkitfullscreenchange", sync);

        return () => {
            document.removeEventListener("fullscreenchange", sync);
            document.removeEventListener("webkitfullscreenchange", sync);
        };
    }, []);

    const enter = useCallback(async () => {
        await requestDocumentFullscreen();
        // A refused request leaves this false, which is what puts the gate back
        // on screen — nothing else to do here.
        return activeElement() !== null;
    }, []);

    const exit = useCallback(async () => {
        if (!activeElement()) return;

        const doc = document as FullscreenDocument;

        try {
            await (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.());
        } catch {
            // Already out, or the document lost permission to leave. Either way
            // there is nothing left to exit.
        }
    }, []);

    return { isFullscreen, isSupported, enter, exit };
}
