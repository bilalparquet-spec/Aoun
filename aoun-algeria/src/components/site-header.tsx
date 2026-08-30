"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { href: "/map", label: "الخريطة" },
  { href: "/help", label: "أحتاج مساعدة" },
  { href: "/help-others", label: "أنا أساعد" },
  { href: "/campaigns", label: "الحملات" },
  { href: "/collection-points", label: "نقاط الاستقبال" },
  { href: "/volunteers", label: "المتطوعون" },
  { href: "/organizations", label: "الجمعيات" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🇩🇿</span>
          <span className="text-lg font-bold text-primary">عون الجزائر</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/80 transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden sm:inline-flex rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary-light"
          >
            تسجيل الدخول
          </Link>
          <button
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border"
            onClick={() => setOpen((v) => !v)}
            aria-label="القائمة"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border bg-surface px-4 py-3 flex flex-col gap-3 animate-fade-in-up">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-foreground/80 py-1"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-primary py-1">
            تسجيل الدخول
          </Link>
        </nav>
      )}
    </header>
  );
}
