"use client";

import { FaTwitter, FaYoutube, FaInstagram, FaGlobe } from "react-icons/fa";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="text-muted-foreground mx-auto mt-24 w-full max-w-6xl border-t px-2 py-10">
      <div className="container mx-auto grid grid-cols-1 gap-10 px-2 md:grid-cols-4">
        {/* 1. Branding */}
        <div>
          <h2 className="text-primary font-poppins text-xl font-bold">Lokko</h2>
          <p className="mt-2 max-w-xs">Là où le local se rencontre</p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            Navigation
          </h3>
          <ul className="space-y-1">
            <li className="hover:text-primary transition">
              <Link href="/">Accueil</Link>
            </li>
            <li className="hover:text-primary transition">
              <Link href="/search">Rechercher</Link>
            </li>
            <li className="hover:text-primary transition">
              <Link href="/profile">Mon profil</Link>
            </li>
            <li className="hover:text-primary transition">
              <Link href="/user/listings">Mes annonces</Link>
            </li>
          </ul>
        </div>

        {/* 3. Newsletter */}
        <div>
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            Suivre Lokko
          </h3>
          <p className="mb-6 text-sm">Les nouveautés locales près de vous.</p>

          <form className="flex flex-col gap-2">
            <Input type="email" placeholder="you@example.com" />
            <Button type="submit" className="w-full">
              S’inscrire
            </Button>
          </form>
        </div>

        {/* 4. Socials */}
        <div>
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            Follow Us
          </h3>
          <div className="flex gap-4">
            <Link href="#" aria-label="Twitter">
              <FaTwitter className="hover:text-primary h-6 w-6" />
            </Link>
            <Link href="#" aria-label="YouTube">
              <FaYoutube className="hover:text-primary h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <FaInstagram className="hover:text-primary h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Website">
              <FaGlobe className="hover:text-primary h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-muted-foreground mt-10 border-t pt-6 text-center text-sm">
        <p>© {new Date().getFullYear()} Lokko — Tous droits réservés.</p>

        <div className="mt-2 flex justify-center gap-4">
          <Link className="hover:text-primary transition" href="/terms">
            Conditions
          </Link>
          <Link className="hover:text-primary transition" href="/privacy">
            Confidentialité
          </Link>
          <Link className="hover:text-primary transition" href="/cookies">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
