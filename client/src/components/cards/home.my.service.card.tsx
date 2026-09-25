import { MyServices } from '@/constants/types/global.types'
import styles from "./css/home.my.service.card.module.css";

interface Props {
    data: MyServices;
}

export default function HomeMyServiceCard({ data }: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.iconWrapper}>
                {data.icon}
            </div>
            <p className={styles.label}>
                {data.name}
            </p>
            <p className={styles.desc}>
                {data.desc}
            </p>
        </div>
    )
}
