"use client";

import { Twitter, Youtube, Instagram, Globe } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className=" text-muted-foreground border-t py-10 w-full max-w-7xl mx-auto mt-24">
      <div className="container grid grid-cols-1 gap-10 md:grid-cols-4 mx-2">
        {/* 1. Branding */}
        <div>
          <h2 className="text-foreground text-xl font-bold">La voie de l&apos;info</h2>
          <p className="mt-2 max-w-xs">
            Votre repère dans l&apos;actualité
          </p>
        </div>

        {/* 2. Site Navigation */}
        <div>
          <h3 className="text-foreground mb-2 font-semibold text-lg">Sections</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/latest">Latest</Link>
            </li>
            <li>
              <Link href="/categories">Categories</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        {/* 3. Newsletter */}
        <div>
          <h3 className="text-foreground mb-2 font-semibold">Stay Updated</h3>
          <p className="mb-3">Join our daily newsletter.</p>
          <form className="flex flex-col gap-2">
            <Input type="email" placeholder="you@example.com" />
            <Button type="submit" variant="default" className="w-full">
              Subscribe
            </Button>
          </form>
        </div>

        {/* 4. Socials */}
        <div>
          <h3 className="text-foreground mb-2 font-semibold">Follow Us</h3>
          <div className="flex gap-4">
            <Link href="#" aria-label="Twitter">
              <Twitter className="hover:text-primary h-6 w-6" />
            </Link>
            <Link href="#" aria-label="YouTube">
              <Youtube className="hover:text-primary h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram className="hover:text-primary h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Website">
              <Globe className="hover:text-primary h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-muted-foreground mt-10 border-t pt-6 text-center text-sm">
        <p>© {new Date().getFullYear()} DailyNews. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/cookies">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
