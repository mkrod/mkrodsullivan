import { Dispatch, SetStateAction, useState } from "react";
import styles from "./css/mobile.nav.module.css";
import { HiOutlineMenuAlt2 } from 'react-icons/hi'
import Link from "next/link";
import { navLinks } from "@/constants/variables/global.vars";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import ThemeSwitch from "../theme.switch";

interface Props {
    showMenu: boolean;
    setShowMenu: Dispatch<SetStateAction<boolean>>;
}
export default function MobileNavBar({ showMenu, setShowMenu }: Props) {
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <>
            <div className={styles.header}>
                <div className={styles.menuTriggerWrapper}>
                    <button
                        onClick={() => setShowMenu((curr) => !curr)}
                        className={styles.trigger}
                    >
                        <HiOutlineMenuAlt2
                            size={20}
                            color='var(--text)'
                        />
                    </button>
                    <div className={styles.nameWrapper}>
                        <span className={styles.name}>Mkrod</span>
                        <span className={styles.name}>Sullivan</span>
                    </div>
                </div>
            </div>
            <div
                onClick={() => setShowMenu(!showMenu)}
                className={`
                    ${styles.menuBackdrop} 
                    ${showMenu ? styles.menuBackdropVisible : ""}
                `}
            />
            <div
                className={`${styles.menu} ${showMenu ? styles.menuVisible : ""}`}
            >
                <nav className={styles.navigation}>
                    <span className={styles.navLabel}>Navigation</span>

                    <div className={styles.links}>
                        {navLinks({
                            iconSize: 19,
                            iconColor: "var(--text-sec)",
                        }).map((link) => {
                            const hasChildren = Boolean(link.children?.length);
                            const isExpanded = expanded === link.label;

                            return (
                                <div
                                    key={link.label}
                                    className={styles.linkGroup}
                                >
                                    {hasChildren ? (
                                        <button
                                            type="button"
                                            className={styles.link}
                                            onClick={() =>
                                                setExpanded((current) =>
                                                    current === link.label
                                                        ? null
                                                        : link.label,
                                                )
                                            }
                                        >
                                            <span className={styles.icon}>
                                                {link.icon}
                                            </span>

                                            <span>{link.label}</span>

                                            <div
                                                className={`${styles.chevron} ${isExpanded
                                                    ? styles.chevronExpanded
                                                    : ""
                                                    }`}
                                            >
                                                <IoChevronDown
                                                    size={19}
                                                />
                                            </div>
                                        </button>
                                    ) : (
                                        <Link
                                            href={link.path}
                                            className={styles.link}
                                            onClick={() => setShowMenu((prev) => !prev)}
                                        >
                                            <span className={styles.icon}>
                                                {link.icon}
                                            </span>

                                            <span>{link.label}</span>
                                        </Link>
                                    )}

                                    {hasChildren && isExpanded ? (
                                        <div className={styles.children}>
                                            {link.children!.map((child) => (
                                                <Link
                                                    key={child.path}
                                                    href={child.path}
                                                    className={styles.child}
                                                    onClick={() => setShowMenu((prev) => !prev)}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </nav>

                <ThemeSwitch />
            </div>
        </>
    )
}
