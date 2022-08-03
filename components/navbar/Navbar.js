import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import styles from "./Navbar.module.css";

const Navbar = (props) => {
  const { user } = props;
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleNavHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleNavMyList = (e) => {
    e.preventDefault();
    router.push("browse/my-list");
  };

  const handleDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href="/">
          <a className={styles.logoLink}>
            <div className={styles.logoWrapper}>Next-Flix</div>
          </a>
        </Link>
        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleNavHome}>
            Home
          </li>
          <li className={styles.navItem} onClick={handleNavMyList}>
            My List
          </li>
        </ul>
        <div className={styles.leftNavContainer}>
          <div>
            <button className={styles.userBtn} onClick={handleDropdown}>
              {user} {showDropdown ? "▲" : "▼"}
            </button>
          </div>
          {showDropdown && (
            <div className={styles.navDropdown}>
              <Link href="/login">
                <a className={styles.linkName}>Sign Out</a>
              </Link>
              {/* <div className={styles.lineWrapper}></div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
