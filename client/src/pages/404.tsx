import Head from "next/head";
import Link from "next/link";

import { siteName } from "@/constants/variables/global.vars";
import styles from "./css/404.module.css";
import { IoChevronBack } from "react-icons/io5";

export default function Custom404() {
    return (
        <>
            <Head>
                <title>{`404 — Page Not Found | ${siteName}`}</title>
                <meta
                    name="description"
                    content="The page you're looking for could not be found."
                />
                <meta name="robots" content="noindex, follow" />
            </Head>

            <main className={styles.page}>
                <div className={styles.grid} />

                <section className={styles.content}>
                    <div className={styles.code}>
                        <span>404</span>
                        <i />
                    </div>

                    <p className={styles.eyebrow}>
                        Route not found
                    </p>

                    <h1>
                        This page doesn't exist.
                    </h1>

                    <p className={styles.description}>
                        The address may be incorrect, or the page may have
                        moved somewhere else.
                    </p>

                    <Link href="/" className={styles.home}>
                        <div
                            className={styles.backIcon}
                        >
                            <IoChevronBack
                                size={15}
                                color="var(--accent)"
                            />
                        </div>
                        Back to home
                    </Link>
                </section>
            </main>
        </>
    );
}

