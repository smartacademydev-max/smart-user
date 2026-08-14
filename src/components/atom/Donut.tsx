import { useTheme } from "@mui/material";

interface DonutProps {
    progress: number;
    size?: number;
    thickness?: number;
    label?: string;
}

export default function Donut({
    progress,
    size = 120,
    thickness = 14,
    label,
}: DonutProps) {
    const theme = useTheme();

    const clampedProgress = Math.min(100, Math.max(0, progress || 0));
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const filled = (clampedProgress / 100) * circumference;
    const center = size / 2;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ display: "block", flexShrink: 0 }}
        >
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={theme.palette.grey[300]}
                strokeWidth={thickness}
            />
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#22c55e"
                strokeWidth={thickness}
                strokeDasharray={`${filled} ${circumference}`}
                strokeDashoffset={circumference / 4}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.4s ease" }}
                transform={`rotate(-90 ${center} ${center})`}
            />
            <text
                x={center}
                y={label ? center - size * 0.08 : center}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                    fontSize: size * 0.18,
                    fontWeight: 600,
                    fill: theme.palette.success.main,
                    fontFamily: theme.typography.fontFamily,
                    color: theme.palette.success.main
                }}
            >
                {/* Arc stays exact; only the label is rounded so 66.666… doesn't render raw. */}
                {Math.round(clampedProgress)}%
            </text>
            {label && (
                <text
                    x={center}
                    y={center + size * 0.14}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                        fontSize: size * 0.12,
                        fill: theme.palette.text.secondary,
                        fontFamily: theme.typography.fontFamily,
                        color: theme.palette.success.main
                    }}
                >
                    {label}
                </text>
            )}
        </svg>
    );
}