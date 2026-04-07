import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Box, FormHelperText, InputLabel } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUploadMediaImageMutation } from "../../services/mediaApi";

function createUploadAdapterPlugin(uploadImage: any) {
    return function (editor: any) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
            return {
                upload: async () => {
                    try {
                        const file = await loader.file;

                        const formData = new FormData();
                        formData.append("upload", file);

                        const response = await uploadImage({ body: formData }).unwrap();

                        return {
                            default: response?.data?.url,
                        };
                    } catch (err) {
                        console.error("Upload failed:", err);
                        throw err;
                    }
                },
                abort: () => {
                    console.log("Upload aborted");
                },
            };
        };
    };
}


export default function TextEditor({
    label,
    error,
    value,
    onChange,
    onBlur,
    required
}: {
    label?: string;
    error?: string;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: (value: string) => void;
    required?: boolean;
}) {
    const [data, setData] = useState(value || "");
    const prevValueRef = useRef(value);
    const [uploadImage] = useUploadMediaImageMutation();

    // Keep plugin stable using useCallback
    const uploadPlugin = useCallback(
        createUploadAdapterPlugin(uploadImage),
        [uploadImage]
    );

    useEffect(() => {
        if (value !== prevValueRef.current) {
            setData(value || "");
            prevValueRef.current = value;
        }
    }, [value]);

    return (
        <Box className="input__field" sx={{
            height: "calc(100%)"
        }}>
            {label ? <InputLabel className={required ? "required" : ""}>
                {label}
            </InputLabel> : ""}

            <div
                className="editor__wrapper"
                style={{
                    border: "1px solid #E5E7EB",
                    height: "100%",
                    padding: "16px",
                    borderRadius: "8px",
                    overflowY: "auto",
                }}
            >
                <CKEditor
                    editor={ClassicEditor as any}
                    data={data}
                    config={{
                        extraPlugins: [uploadPlugin],
                        toolbar: [
                            "heading", "|",
                            "bold", "italic", "link", "|",
                            "bulletedList", "numberedList", "|",
                            "imageUpload", "blockQuote", "|",
                            "undo", "redo"
                        ]
                    }}
                    onChange={(_, editor) => {
                        const val = editor.getData();
                        setData(val);
                        onChange?.(val);
                    }}
                    onBlur={(_, editor) => {
                        const val = editor.getData();
                        onBlur?.(val);
                    }}
                />
            </div>

            {error && <FormHelperText error>{error}</FormHelperText>}
        </Box>
    );
}
