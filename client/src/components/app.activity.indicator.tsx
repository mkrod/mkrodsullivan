import { useEffect } from "react";
import styles from "./css/app.activity.indicator.module.css";
import { useAppRouter } from "@/constants/utilities/app.router";

export default function AppActivityIndicator() {

    const router = useAppRouter();
    const { navigating, loading } = router.navigation;



    return (
        <div
            className={styles.container}
        >

        </div>
    )
}
