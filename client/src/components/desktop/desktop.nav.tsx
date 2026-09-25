import { Dispatch, SetStateAction, useState } from "react";
import styles from "./css/desktop.nav.module.css";
import { navLinks } from "@/constants/variables/global.vars";
import Link from "next/link";
import { IoChevronDownOutline } from "react-icons/io5";
import ThemeSwitch from "../theme.switch";

interface Props {
    showMenu: boolean;
    setShowMenu: Dispatch<SetStateAction<boolean>>;
}


export default function DesktopNav({ }: Props) {

    const [expanded, setExpanded] = useState<string | null>(null);


    return (
        <div
            className={styles.container}
        >
            <div className={styles.nameWrapper}>
                <span className={styles.name}>Mkrod</span>
                <span className={styles.name}>Sullivan</span>
            </div>

            <div className={styles.navLinks}>
                {navLinks({ iconSize: 18, iconClassName: styles.navIcon }).map((n) => {
                    const hasChildren = Boolean(n.children?.length);
                    const isExpanded = n.label === expanded;

                    return hasChildren ? (
                        <button
                            key={n.label}
                            className={styles.nav}
                            // onMouseEnter={() => setExpanded(n.label)}
                            // onMouseLeave={() => setExpanded(null)}
                            onClick={() =>
                                setExpanded((current) =>
                                    current === n.label
                                        ? null
                                        : n.label,
                                )
                            }
                        >
                            {n.icon}
                            <span className={styles.navLabel}>{n.label}</span>

                            <div
                                className={`
                                    ${styles.navIconWrapper} 
                                    ${isExpanded ? styles.navIconWrapperRotate : ''}
                                `}
                            >
                                <IoChevronDownOutline
                                    size={18}
                                    className={styles.navIcon}
                                />
                            </div>

                            <div
                                className={`
                                ${styles.navChildren} ${isExpanded ? styles.navChildrenOpen : ''}
                                `}
                            >
                                {n.children!.map((c) => (
                                    <Link
                                        key={c.label}
                                        href={c.path}
                                        className={styles.nav}
                                    >
                                        {c.icon}
                                        <span className={styles.navChildLabel}>
                                            {c.label}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </button>
                    ) : (
                        <Link
                            key={n.label}
                            href={n.path}
                            className={styles.nav}
                        >
                            {n.icon}
                            <span className={styles.navLabel}>
                                {n.label}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <ThemeSwitch />
        </div>
    )
}
