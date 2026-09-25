import { Dispatch, SetStateAction } from "react";
import styles from "./css/note.module.css";
import { useGlobalProvider } from "@/constants/provider/global.provider";


interface Props {
}

export default function Note({ }: Props) {

    const { note, setNote } = useGlobalProvider();

    if (!note) return null;

    return (
        <div
            className={`${styles.note} ${styles[note.type]}`}
            role="alert"
        >
            <div className={styles.indicator} />

            <div className={styles.content}>
                <div className={styles.title}>
                    {note.title}
                </div>

                {note.body && (
                    <div className={styles.body}>
                        {note.body}
                    </div>
                )}
            </div>

            <button
                type="button"
                className={styles.close}
                onClick={() => setNote(undefined)}
                aria-label="Close notification"
            >
                ×
            </button>

            <div className={styles.progress} />
        </div>
    );
}