import { ReactNode, useState } from 'react'
import styles from "./css/navbar.module.css";
import Footer from './footer';
import { useGlobalProvider } from '@/constants/provider/global.provider';
import MobileNavBar from './mobile/mobile.nav';
import DesktopNav from './desktop/desktop.nav';


interface Props {
    children: ReactNode;
}

export default function NavBar({ children }: Props) {

    const { isMobile } = useGlobalProvider();
    const [showMenu, setShowMenu] = useState<boolean>(false);

    return (
        <>
            <div className={styles.container}>
                {isMobile && (
                    <MobileNavBar
                        showMenu={showMenu}
                        setShowMenu={setShowMenu}
                    />
                )}
                {!isMobile && (
                    <DesktopNav
                        showMenu={showMenu}
                        setShowMenu={setShowMenu}
                    />
                )}

                <div className={styles.childrenWrapper}>
                    {children}
                </div>
            </div>
            <Footer />
        </>
    )
}
