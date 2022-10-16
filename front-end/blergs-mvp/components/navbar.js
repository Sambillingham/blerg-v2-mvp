import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
    return (
    <nav className={styles.navBar}>
        <Link href="/web">
            <a className={styles.navItem}>web</a>
        </Link>
        <Link href="/staking">
            <a className={styles.navItem}>staking</a>
        </Link>
        <Link href="/direct">
            <a className={styles.navItem}>direct</a>
        </Link>
    </nav>
    )
}

export default Navbar;