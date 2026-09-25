import { LuLayoutList } from "react-icons/lu";
import styles from "./css/empty.list.module.css";

interface Props {
    title: string;
    subtitle?: string;
    cover?: boolean;
}

export default function EmptyList({ title, subtitle, cover = false }: Props) {

    return (
        <div
            className={`${styles.container} ${cover ? styles.cover : ""}`}
        >
            <LuLayoutList
                size={30}
                color="var(--accent)"
            />

            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>

                {subtitle && (
                    <p className={styles.subtitle}>{subtitle}</p>
                )}
            </div>
        </div>
    );
}
