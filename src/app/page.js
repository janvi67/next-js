"use client";

import Link from "next/link";
import styles from "./page.module.css";
import './../app/globals.css'

const HomePage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome to My Project</h1>
        <p className={styles.subtitle}>A modern platform for your needs</p>
      </header>

      <nav className={styles.nav}>
        <Link href="/login" className={styles.navLink}>
          Login
        </Link>
        <Link href="/register" className={styles.navLink}>
          Register
        </Link>
        <Link href="/about" className={styles.navLink}>
          About Us
        </Link>
      </nav>

      <main className={styles.main}>
        <h2>Explore Features</h2>
        <p>
          This platform provides an efficient way to manage your data, create
          user accounts, and explore exciting features tailored to your needs.
        </p>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} My Project. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
