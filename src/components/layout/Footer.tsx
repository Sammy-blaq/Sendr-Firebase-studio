"use client";

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p className="text-sm">
          &copy; {currentYear} SwiftSend. All rights reserved.
        </p>
        <nav className="mt-2 space-x-4">
          <Link href="/terms" className="hover:text-primary transition-colors text-xs">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors text-xs">Privacy Policy</Link>
        </nav>
      </div>
    </footer>
  );
}
