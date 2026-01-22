import {
    Box,
    IconButton,
    useTheme,
} from "@mui/material";
import { Edit2, GalleryAdd, Trash } from "iconsax-reactjs";
import { useCallback, useRef, useState } from "react";

interface ProfileImageUploadProps {
    // value: File | null;
    previewUrl?: string;
    onChange: (file: File | null) => void;
}

export default function ProfileImageUpload({
    previewUrl,
    onChange,
}: ProfileImageUploadProps) {
    const theme = useTheme();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [preview, setPreview] = useState<string | null>(
        previewUrl || null
    );

    const handleSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const url = URL.createObjectURL(file);
            setPreview(url);
            onChange(file);
        },
        [onChange]
    );

    const handleRemove = useCallback(() => {
        setPreview(null);
        onChange(null);
        if (inputRef.current) inputRef.current.value = "";
    }, [onChange]);

    return (
        <Box className="rounded-md flex justify-center items-center py-6 relative"
            sx={{
                background: theme.palette.separator.dark,
                height: "calc(100% - 40px)",
            }}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleSelect}
            />

            {/* Image */}
            <img
                src={preview || "/no-profile.svg"}
                className="max-w-full h-auto"
            />

            {/* Actions */}
            <div className="profile__action flex flex-col items-center gap-1 absolute right-1 top-1">
                {!preview ? (
                    /* Upload only */
                    <IconButton
                        onClick={() => inputRef.current?.click()}
                        sx={{
                            background: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                        }}
                        className="rounded-full w-6 h-6 lg:w-10 lg:h-10"
                    >
                        <GalleryAdd />
                    </IconButton>
                ) : (
                    <>
                        {/* Edit */}
                        <IconButton
                            onClick={() => inputRef.current?.click()}
                            sx={{
                                background: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                            }}
                            className="rounded-full w-6 h-6 lg:w-10 lg:h-10"
                        >
                            <Edit2 />
                        </IconButton>

                        {/* Delete */}
                        <IconButton
                            onClick={handleRemove}
                            sx={{
                                background: theme.palette.error.main,
                                color: theme.palette.primary.contrastText,
                            }}
                            className="rounded-full w-6 h-6 lg:w-10 lg:h-10"
                        >
                            <Trash />
                        </IconButton>
                    </>
                )}
            </div>
        </Box>
    );
}
