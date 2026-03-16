// DocumentReader.tsx
import { Box, CircularProgress, Typography } from "@mui/material";
import { renderAsync } from "docx-preview";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type FileType = "pdf" | "docx" | "doc" | "unknown";

interface DocumentReaderProps {
    fileUrl: string;
}

function getFileType(url: string): FileType {
    const extension = url.split(".").pop()?.toLowerCase().split("?")[0];
    if (extension === "pdf") return "pdf";
    if (extension === "docx") return "docx";
    if (extension === "doc") return "doc";
    return "unknown";
}

function PdfReader({ fileUrl }: { fileUrl: string }) {
    const [numPages, setNumPages] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    function onDocumentLoadError(err: Error) {
        setError(err.message);
        setLoading(false);
    }

    return (
        <Box sx={{ width: "100%", overflowY: "auto", maxHeight: "100%" }}>
            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            )}
            {error && (
                <Typography color="error" textAlign="center">
                    Failed to load PDF: {error}
                </Typography>
            )}
            <Document
                file={`${fileUrl}`}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading=""
            >
                {Array.from(new Array(numPages), (_, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        width={800}
                        className="mx-auto"
                    />
                ))}
            </Document>
        </Box>
    );
}

// Word Document Reader Component
function WordReader({ fileUrl }: { fileUrl: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDocument = async () => {
            if (!containerRef.current) return;

            try {
                setLoading(true);
                setError(null);

                // Fetch the document as blob
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch document: ${response.statusText}`);
                }

                const blob = await response.blob();

                // Clear previous content
                containerRef.current.innerHTML = "";

                // Render the document
                await renderAsync(blob, containerRef.current, undefined, {
                    className: "docx-wrapper",
                    inWrapper: true,
                    ignoreWidth: false,
                    ignoreHeight: false,
                    ignoreFonts: false,
                    breakPages: true,
                    ignoreLastRenderedPageBreak: true,
                    experimental: false,
                    trimXmlDeclaration: true,
                    useBase64URL: true,
                    renderHeaders: true,
                    renderFooters: true,
                    renderFootnotes: true,
                    renderEndnotes: true,
                });

                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load document");
                setLoading(false);
            }
        };

        loadDocument();
    }, [fileUrl]);

    return (
        <Box sx={{ width: "100%", overflowY: "auto", maxHeight: "70vh", bgcolor: "#fff" }}>
            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            )}
            {error && (
                <Typography color="error" textAlign="center" p={2}>
                    Failed to load document: {error}
                </Typography>
            )}
            <div
                ref={containerRef}
                style={{
                    padding: "20px",
                    minHeight: "200px",
                }}
            />
        </Box>
    );
}

// Main Document Reader Component
export default function DocumentReader({ fileUrl }: DocumentReaderProps) {
    const fileType = getFileType(fileUrl);

    switch (fileType) {
        case "pdf":
            return <PdfReader fileUrl={fileUrl} />;
        case "docx":
            return <WordReader fileUrl={fileUrl} />;
        case "doc":
            return (
                <Box p={4} textAlign="center">
                    <Typography color="warning.main">
                        .doc files are not supported. Please convert to .docx or .pdf
                    </Typography>
                </Box>
            );
        default:
            return (
                <Box p={4} textAlign="center">
                    <Typography color="error">
                        Unsupported file type. Please use PDF or DOCX files.
                    </Typography>
                </Box>
            );
    }
}