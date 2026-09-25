import { type FC } from "react";
import styles from "./css/activity.indicator.module.css";

export interface ActivityIndicatorProps {
    cover?: boolean;
    style: "spin" | "typing" | "orbit";
    color?: string;
    size: "small" | "medium" | "big";
    zIndex?: number;
}

const ActivityIndicator: FC<ActivityIndicatorProps> = ({
    cover = false,
    style,
    color = "var(--accent)",
    size,
    zIndex,
}) => {
    return (
        <div
            style={{ zIndex }}
            className={`${styles.container} ${cover ? styles.container_covered : ""
                }`}
        >
            {style === "spin" && (
                <span
                    className={`${styles.spinner} ${styles[size]}`}
                    style={{ borderTopColor: color }}
                />
            )}

            {style === "typing" && (
                <span className={styles.typing}>
                    <i style={{ background: color }} />
                    <i style={{ background: color }} />
                    <i style={{ background: color }} />
                </span>
            )}

            {style === "orbit" && (
                <span
                    className={`${styles.orbit} ${styles[size]}`}
                    style={{ "--indicator-color": color } as React.CSSProperties}
                >
                    <i />
                </span>
            )}
        </div>
    );
};

export default ActivityIndicator;