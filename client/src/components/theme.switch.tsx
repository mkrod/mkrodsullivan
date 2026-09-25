import { useGlobalProvider } from '@/constants/provider/global.provider';
import { FiMoon, FiSun } from "react-icons/fi";
import styles from "./css/theme.switch.module.css";

export default function ThemeSwitch() {

    const { userScheme, switchScheme } = useGlobalProvider();
    const dark = userScheme === 'dark';


    return (
        <button
            type="button"
            className={`${styles.switch} ${dark ? styles.dark : styles.light
                }`}
            onClick={switchScheme}
            aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
            aria-pressed={dark}
        >
            <span className={styles.track}>
                <span className={styles.thumb}>
                    {dark ? (
                        <FiMoon size={15} />
                    ) : (
                        <FiSun size={15} />
                    )}
                </span>
            </span>
        </button>
    )
}
