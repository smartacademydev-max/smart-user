/**
 * Plain text out of CKEditor markup. Entities are decoded too — stripping the
 * tags alone leaves `&nbsp;` and friends showing literally.
 */
export const stripHtml = (value: string): string => {
    const withoutTags = value.replace(/<[^>]*>/g, " ");
    const decoded = new DOMParser().parseFromString(withoutTags, "text/html").body.textContent ?? "";

    return decoded.replace(/\s+/g, " ").trim();
};

/**
 * Splits a drag-into-text passage into its text runs and gap markers, keeping
 * them in order so the sentence can be rendered with the gaps in place. Gaps
 * are written `[[1]]`, following Moodle's markup.
 */
export const splitOnGaps = (text: string): { text: string; gap: number | null }[] =>
    stripHtml(text)
        .split(/(\[\[\d+\]\])/g)
        .filter((part) => part !== "")
        .map((part) => {
            const match = part.match(/^\[\[(\d+)\]\]$/);

            return match ? { text: part, gap: Number(match[1]) } : { text: part, gap: null };
        });

/**
 * The passage with its gap markers shown as blanks. `[[1]]` is authoring
 * syntax, so anywhere the raw text is displayed — a question list, a review
 * screen — it should read as a fill-in-the-blank sentence instead.
 */
export const gapsAsBlanks = (text: string): string =>
    text.replace(/\[\[(\d+)\]\]/g, "____");
