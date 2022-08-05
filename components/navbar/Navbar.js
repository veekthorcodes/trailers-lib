import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { magic } from "@utils/magic-client";
import styles from "./Navbar.module.css";
import LoadingSpinner from "@components/utils/LoadingSpinner";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState("Guest");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getUser = async () => {
    try {
      const { email } = await magic.user.getMetadata();
      if (email) {
        setUser(email);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const handleRouteComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleRouteComplete);
    router.events.on("routeChangeError", handleRouteComplete);

    return () => {
      router.events.off("routeChangeComplete", handleRouteComplete);
      router.events.off("routeChangeError", handleRouteComplete);
    };
  }, []);

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

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await magic.user.logout();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
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
              {user}
            </button>
            {showDropdown ? (
              <span className={styles.icon}>▲</span>
            ) : (
              <span className={styles.icon}>▼</span>
            )}
          </div>
          {showDropdown && (
            <div className={styles.navDropdown}>
              <a className={styles.linkName} onClick={handleLogout}>
                Sign Out
              </a>
            </div>
          )}
          {isLoading && <LoadingSpinner />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
