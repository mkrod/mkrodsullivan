import { myServices } from "@/constants/variables/global.vars";

import Link from "next/link";

import {
    FaGithub,
    FaTiktok,
} from "react-icons/fa6";

import { PiThreadsLogoBold } from "react-icons/pi";

import styles from "./css/footer.module.css";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.container}>
            <section className={styles.topBox}>
                <section className={styles.topBoxOne}>
                    <div className={styles.topBoxOneName}>
                        <h2 className={styles.footerLabel}>MkRoD</h2>
                        <h2 className={styles.footerLabel}>Sullivan</h2>
                    </div>
                </section>

                <section className={styles.topBoxTwo}>
                    <div className={styles.topBoxServiceLinks}>
                        {myServices.map((service) => (
                            <p
                                key={service.name}
                                className={styles.service}
                            >
                                {service.name}
                            </p>
                        ))}
                    </div>

                    <nav className={styles.topBoxNavLinks}>
                        <Link className={styles.navLink} href="/">
                            Home
                        </Link>

                        <Link className={styles.navLink} href="/#about">
                            About
                        </Link>

                        <Link
                            className={styles.navLink}
                            href="/#projects"
                        >
                            Projects
                        </Link>

                        <Link className={styles.navLink} href="/#stacks">
                            Stacks
                        </Link>
                    </nav>
                </section>

                <section className={styles.topBoxThree}>
                    <span className={styles.socialHeader}>
                        My Social Links
                    </span>

                    <div className={styles.socialLinksWrapper}>
                        <a
                            href="https://github.com/mkrod"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.socialLink}
                            aria-label="GitHub"
                        >
                            <FaGithub size={22} />
                        </a>

                        <a
                            href="https://www.threads.net/@mkrod"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.socialLink}
                            aria-label="Threads"
                        >
                            <PiThreadsLogoBold size={22} />
                        </a>

                        <a
                            href="https://www.tiktok.com/@mk_tech_ltd"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.socialLink}
                            aria-label="TikTok"
                        >
                            <FaTiktok size={22} />
                        </a>
                    </div>
                </section>
            </section>

            <section className={styles.bottomBox}>
                <span className={styles.bottomBoxTextOne}>
                    Developed by me — Stack: Next.js + Express.js & Git
                </span>

                <span className={styles.bottomBoxTextTwo}>
                    © {year}, All rights reserved.
                </span>
            </section>
        </footer>
    );
}
