"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
      <div className="wrap">
        <Link href="/" className="brand" onClick={close}>
          Tedditory Retreat<span className="dot">.</span>
        </Link>
        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <div className={`navlinks${open ? " open" : ""}`}>
          <Link href="/#home" onClick={close}>The Home</Link>
          <Link href="/#rooms" onClick={close}>Rooms</Link>
          <Link href="/#why" onClick={close}>Why</Link>
          <Link href="/#how" onClick={close}>Staying here</Link>
          <Link href="/#hideaway" onClick={close}>Hideaway</Link>
          <a
            className="cta"
            href="https://www.airbnb.com/users/show/116747850"
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            Find us on Airbnb ↗
          </a>
        </div>
      </div>
    </nav>
  );
}
