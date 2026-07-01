import { Link } from "@tanstack/react-router";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { navLinks } from "./landing-data";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-100 bg-white/85 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="group flex items-center gap-2">
          <div className="water-icon h-9 w-9 transition-transform duration-300 group-hover:rotate-12">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-sky-950">Creativ Pressing</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 text-sm font-bold text-sky-800/70 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-sky-500 after:transition-all hover:text-sky-600 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild className="font-bold text-sky-800 hover:bg-sky-50 hover:text-sky-600">
            <Link to="/login">Connexion</Link>
          </Button>
          <Button asChild className="water-button h-10 px-5">
            <Link to="/signup">Créer ma boutique</Link>
          </Button>
        </div>

        <button
          type="button"
          className="rounded-xl p-2 text-sky-800 hover:bg-sky-50 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-sky-100 bg-white md:hidden">
          <div className="container mx-auto flex flex-col gap-3 px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-sm font-bold text-sky-800 hover:bg-sky-50"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <div className="mt-2 flex gap-2 border-t border-sky-100 pt-3">
              <Button variant="outline" asChild className="flex-1 border-sky-200 text-sky-800 hover:bg-sky-50">
                <Link to="/login">Connexion</Link>
              </Button>
              <Button asChild className="water-button flex-1">
                <Link to="/signup">S'inscrire</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function SectionHeader({
  badge,
  title,
  description,
  light = false,
}: {
  badge: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-4 text-center">
      <Badge className={light ? "border-sky-100 bg-white text-sky-600" : "border-sky-100 bg-sky-50 text-sky-600"}>
        {badge}
      </Badge>
      <h2 className="water-title text-3xl font-black tracking-tight md:text-4xl">{title}</h2>
      {description && <p className="water-subtitle text-base font-medium">{description}</p>}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-sky-800 bg-sky-950 py-16 text-white/70">
      <div className="container mx-auto grid gap-10 px-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="water-icon h-8 w-8">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-black tracking-tight">Creativ Pressing</span>
          </div>
          <p className="text-xs leading-relaxed text-white/65">
            Le logiciel de gestion de caisse et de relation client pour les pressings et blanchisseries au Sénégal.
          </p>
        </div>

        <FooterCol title="Produit" links={[["Accueil", "/"], ["Fonctionnalités", "#features"], ["Installation", "#download"], ["Démo Interactive", "#demo-preview"]]} />
        <FooterCol title="Entreprise" links={[["À propos", "#"], ["Contactez-nous", "#"], ["Blog & Conseils", "#"]]} />
        <FooterCol title="Légal" links={[["Confidentialité des données", "#"], ["Conditions d'Utilisation", "#"]]} />
      </div>

      <div className="container mx-auto mt-12 border-t border-sky-900 px-4 pt-6 text-center text-xs text-white/50">
        © 2026 Creativ Pressing. Conçu fièrement pour les entrepreneurs sénégalais. Tous droits réservés.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-black uppercase tracking-wider text-white">{title}</h4>
      <ul className="space-y-2 text-xs">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="text-white/65 transition-colors hover:text-white">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
