import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Users, ShoppingBag, Wallet, BarChart3, UserCog, Images, Bell, FileText,
  CreditCard, History, ShieldCheck, Sparkles, Clock, TrendingUp, MapPin,
  CheckCircle2, ArrowRight, PlayCircle, Menu, X, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Creativ Pressing — Le CRM des pressings sénégalais" },
      { name: "description", content: "Gérez clients, commandes, dépenses et performance de votre pressing depuis une seule plateforme moderne." },
      { property: "og:title", content: "Creativ Pressing — CRM pour pressings" },
      { property: "og:description", content: "Le logiciel tout-en-un pour piloter votre pressing au Sénégal." },
    ],
  }),
  component: LandingPage,
});

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#features", label: "Fonctionnalités" },
    { href: "#screens", label: "Aperçu" },
    { href: "#advantages", label: "Avantages" },
    { href: "#faq", label: "FAQ" },
  ];
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">Creativ Pressing</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild><Link to="/login">Connexion</Link></Button>
          <Button asChild className="shadow-sm"><Link to="/signup">Créer ma boutique</Link></Button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="container mx-auto flex flex-col gap-3 px-4 py-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium" onClick={() => setOpen(false)}>{l.label}</a>
            ))}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" asChild className="flex-1"><Link to="/login">Connexion</Link></Button>
              <Button asChild className="flex-1"><Link to="/signup">S'inscrire</Link></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 -z-10 opacity-50" style={{ backgroundImage: "radial-gradient(circle at 20% 10%, oklch(0.85 0.1 250 / 0.4), transparent 40%), radial-gradient(circle at 90% 30%, oklch(0.8 0.15 240 / 0.35), transparent 50%)" }} />
      <div className="container mx-auto grid gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col justify-center animate-fade-in">
          <Badge variant="secondary" className="mb-6 w-fit gap-2 px-3 py-1.5 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Pensé pour les pressings sénégalais
          </Badge>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            Gérez votre pressing<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
              en toute simplicité
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Le CRM conçu pour les pressings sénégalais. Suivez vos clients, vos commandes, vos dépenses et la performance de votre activité depuis une seule plateforme.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="h-12 px-7 text-base shadow-lg" style={{ boxShadow: "var(--shadow-elegant)" }}>
              <Link to="/signup">Créer ma boutique gratuitement <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-7 text-base">
              <Link to="/dashboard"><PlayCircle className="mr-2 h-5 w-5" /> Voir une démonstration</Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Sans engagement</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Données sécurisées</div>
          </div>
        </div>
        <div className="relative animate-fade-in">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-3xl opacity-30 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
      <Card className="overflow-hidden border-border/60 p-0 shadow-2xl" style={{ boxShadow: "var(--shadow-elegant)" }}>
        <div className="flex items-center gap-1.5 border-b bg-muted/40 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="ml-3 text-xs text-muted-foreground">app.creativpressing.sn</span>
        </div>
        <div className="grid grid-cols-12 bg-background">
          <aside className="col-span-3 border-r bg-muted/20 p-3">
            <div className="mb-4 flex items-center gap-2 px-2">
              <div className="h-6 w-6 rounded" style={{ background: "var(--gradient-primary)" }} />
              <span className="text-xs font-semibold">Creativ</span>
            </div>
            {["Tableau de bord", "Clients", "Commandes", "Dépenses", "Rapports"].map((l, i) => (
              <div key={l} className={`mb-1 rounded px-2 py-1.5 text-[11px] ${i === 0 ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground"}`}>{l}</div>
            ))}
          </aside>
          <main className="col-span-9 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Bonjour Ousmane</div>
                <div className="text-sm font-semibold">Tableau de bord</div>
              </div>
              <div className="h-7 w-7 rounded-full bg-accent" />
            </div>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {[
                { l: "Revenus", v: "720K", t: "+12%" },
                { l: "Commandes", v: "184", t: "+8%" },
                { l: "Clients", v: "96", t: "+5%" },
              ].map((k) => (
                <div key={k.l} className="rounded-lg border bg-card p-2.5">
                  <div className="text-[10px] text-muted-foreground">{k.l}</div>
                  <div className="mt-0.5 text-base font-bold">{k.v}</div>
                  <div className="text-[10px] font-medium text-emerald-600">{k.t}</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg border bg-card p-3">
              <div className="mb-2 text-[11px] font-medium">Revenus mensuels</div>
              <div className="flex h-24 items-end gap-1.5">
                {[40, 55, 48, 70, 62, 85, 78, 92, 70, 88, 95, 100].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: "var(--gradient-primary)" }} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </Card>
      <Card className="absolute -bottom-6 -left-6 hidden gap-2 p-3 shadow-xl sm:flex sm:items-center" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <div className="text-xs font-medium">Commande prête</div>
          <div className="text-[10px] text-muted-foreground">CMD-1042 • Aminata D.</div>
        </div>
      </Card>
    </div>
  );
}

function ProblemsSection() {
  const problems = [
    "Difficulté à suivre les commandes",
    "Perte de tickets papier",
    "Oubli de paiement",
    "Difficulté à suivre les dépenses",
    "Manque de visibilité sur les bénéfices",
    "Gestion manuelle sur cahier",
  ];
  return (
    <section className="border-y bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Pourquoi Creativ Pressing ?</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Les vrais défis des pressings au Sénégal</h2>
          <p className="mt-4 text-muted-foreground">Vous reconnaissez-vous dans ces situations du quotidien ?</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <Card key={p} className="flex items-start gap-3 p-5 hover-scale">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <X className="h-4 w-4 text-destructive" />
              </div>
              <span className="font-medium">{p}</span>
            </Card>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border bg-card p-8 text-center shadow-sm md:p-12">
          <Badge className="mb-4">La solution</Badge>
          <h3 className="text-2xl font-bold md:text-3xl">Tout votre pressing dans une seule application</h3>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Creativ Pressing centralise vos clients, commandes, paiements et dépenses pour vous redonner le contrôle total de votre activité.
          </p>
        </div>
      </div>
    </section>
  );
}

const features = [
  { icon: Users, title: "Gestion des clients", items: ["Création client", "Historique complet", "Recherche rapide", "Téléphone & adresse"] },
  { icon: ShoppingBag, title: "Gestion des commandes", items: ["Création de commande", "Suivi des vêtements", "Statut de traitement", "Date de livraison"] },
  { icon: Wallet, title: "Gestion des dépenses", items: ["Eau, électricité", "Salaires", "Produits de nettoyage", "Charges diverses"] },
  { icon: BarChart3, title: "Tableau de bord", items: ["Chiffre d'affaires", "Nb. clients & commandes", "Dépenses", "Bénéfices"] },
  { icon: UserCog, title: "Gestion des employés", items: ["Liste des employés", "Attribution des rôles", "Suivi d'activité"] },
  { icon: Images, title: "Galerie photos", items: ["Photos avant lavage", "Photos après lavage", "Historique visuel"] },
  { icon: Bell, title: "Notifications", items: ["Commandes prêtes", "Retards", "Alertes importantes"] },
  { icon: FileText, title: "Rapports", items: ["Rapport journalier", "Hebdomadaire", "Mensuel"] },
  { icon: CreditCard, title: "Gestion des paiements", items: ["Payé", "Partiellement payé", "Non payé"] },
  { icon: History, title: "Historique complet", items: ["Toutes les actions", "Traçabilité totale"] },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Fonctionnalités</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Tout ce dont vous avez besoin</h2>
          <p className="mt-4 text-muted-foreground">Une suite complète d'outils pour gérer chaque aspect de votre pressing.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="group relative overflow-hidden p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {f.items.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{it}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function RolesSection() {
  return (
    <section className="bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Système de rôles</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Chacun son niveau d'accès</h2>
          <p className="mt-4 text-muted-foreground">Protégez vos données financières en attribuant le bon rôle à chaque utilisateur.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="border-primary/40 p-8 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <h3 className="text-xl font-bold">Propriétaire</h3>
              <Badge>Accès total</Badge>
            </div>
            <ul className="space-y-2 text-sm">
              {["Dashboard complet", "Clients", "Commandes", "Dépenses", "Employés", "Rapports", "Paramètres", "Statistiques"].map((i) => (
                <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />{i}</li>
              ))}
            </ul>
          </Card>
          <Card className="p-8">
            <div className="mb-4 flex items-center gap-3">
              <Users className="h-7 w-7 text-muted-foreground" />
              <h3 className="text-xl font-bold">Employé</h3>
              <Badge variant="secondary">Accès limité</Badge>
            </div>
            <div className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Peut faire</div>
            <ul className="space-y-1.5 text-sm">
              {["Ajouter / modifier clients", "Créer commandes", "Modifier statut commande", "Voir commandes du jour", "Upload photos", "Rechercher clients"].map((i) => (
                <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{i}</li>
              ))}
            </ul>
            <div className="mt-4 mb-2 text-xs font-semibold uppercase text-muted-foreground">Restrictions</div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {["Pas d'accès aux dépenses", "Pas d'accès aux rapports financiers", "Pas d'accès aux paramètres", "Pas de gestion des employés"].map((i) => (
                <li key={i} className="flex gap-2"><X className="h-4 w-4 text-destructive" />{i}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ScreensSection() {
  const screens = [
    { title: "Tableau de bord", desc: "Vue d'ensemble en temps réel", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80" },
    { title: "Liste clients", desc: "Base de données structurée", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80" },
    { title: "Gestion commandes", desc: "Suivi des états en un clin d'œil", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80" },
    { title: "Rapports & statistiques", desc: "Graphiques détaillés", img: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200&q=80" },
  ];
  return (
    <section id="screens" className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Aperçu du CRM</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Une interface pensée pour la clarté</h2>
          <p className="mt-4 text-muted-foreground">Découvrez les principaux écrans de Creativ Pressing.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {screens.map((s) => (
            <Card key={s.title} className="overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-2xl">
              <div className="aspect-video overflow-hidden bg-muted">
                <img src={s.img} alt={s.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdvantagesSection() {
  const advs = [
    { icon: Clock, title: "Gain de temps", desc: "Réduction des tâches manuelles." },
    { icon: BarChart3, title: "Plus de contrôle", desc: "Vue globale de l'activité." },
    { icon: TrendingUp, title: "Plus de rentabilité", desc: "Suivi précis revenus & dépenses." },
    { icon: ShieldCheck, title: "Moins d'erreurs", desc: "Centralisation des informations." },
    { icon: MapPin, title: "Adapté au Sénégal", desc: "Pensé pour les réalités locales." },
  ];
  return (
    <section id="advantages" className="bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Avantages</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ce que vous y gagnez</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {advs.map((a) => (
            <Card key={a.title} className="p-6 text-center hover-scale">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <a.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Ousmane Diop", role: "Pressing à Dakar", text: "Depuis que nous utilisons Creativ Pressing, nous avons une meilleure visibilité sur nos commandes.", img: "https://i.pravatar.cc/100?img=12" },
    { name: "Awa Mbaye", role: "Pressing à Thiès", text: "Nous avons réduit les erreurs et gagné énormément de temps au quotidien.", img: "https://i.pravatar.cc/100?img=47" },
    { name: "Modou Sarr", role: "Pressing à Saint-Louis", text: "Mes employés travaillent plus efficacement, tout est centralisé.", img: "https://i.pravatar.cc/100?img=33" },
    { name: "Khady Faye", role: "Pressing à Mbour", text: "Plus aucune perte de ticket. Le suivi des paiements est devenu un jeu d'enfant.", img: "https://i.pravatar.cc/100?img=45" },
    { name: "Babacar Ndoye", role: "Pressing à Rufisque", text: "Les rapports mensuels m'aident à mieux décider. Très professionnel.", img: "https://i.pravatar.cc/100?img=68" },
    { name: "Sokhna Diallo", role: "Pressing à Kaolack", text: "Interface simple, mes employés ont été opérationnels en une journée.", img: "https://i.pravatar.cc/100?img=20" },
  ];
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Témoignages</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ils nous font confiance</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <Card key={t.name} className="p-6">
              <div className="mb-3 flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm leading-relaxed">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <img src={t.img} alt={t.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function useCountUp(target: number, duration = 1600) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            setVal(Math.floor(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return { val, ref };
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { val, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold md:text-5xl" style={{ backgroundImage: "var(--gradient-primary)", WebkitBackgroundClip: "text", color: "transparent" }}>
        {val.toLocaleString("fr-FR")}{suffix}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function StatsSection() {
  return (
    <section className="border-y bg-muted/20 py-20">
      <div className="container mx-auto grid gap-10 px-4 md:grid-cols-4">
        <StatItem value={500} suffix="+" label="Pressings potentiels" />
        <StatItem value={10000} suffix="+" label="Commandes gérées" />
        <StatItem value={98} suffix="%" label="Satisfaction client" />
        <StatItem value={24} suffix="h/24" label="Accès à la plateforme" />
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Comment créer ma boutique ?", a: "Cliquez sur 'Créer ma boutique', remplissez le formulaire en 2 minutes et vous êtes prêt." },
    { q: "Puis-je ajouter plusieurs employés ?", a: "Oui, ajoutez autant d'employés que nécessaire avec des rôles personnalisés." },
    { q: "Puis-je suivre mes dépenses ?", a: "Oui, l'application gère eau, électricité, salaires, produits et toute autre charge." },
    { q: "Puis-je gérer plusieurs points de vente ?", a: "Oui, Creativ Pressing supporte la gestion multi-boutiques depuis un seul compte." },
    { q: "Mes données sont-elles sécurisées ?", a: "Vos données sont chiffrées et sauvegardées automatiquement chaque jour." },
    { q: "Le logiciel fonctionne-t-il sur mobile ?", a: "Oui, l'interface est 100% responsive : ordinateur, tablette et smartphone." },
  ];
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Questions fréquentes</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl p-10 text-center md:p-16" style={{ background: "var(--gradient-primary)" }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white, transparent 40%)" }} />
          <h2 className="relative text-3xl font-bold text-primary-foreground md:text-5xl">Prêt à moderniser votre pressing ?</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/90">
            Rejoignez la nouvelle génération de pressings sénégalais.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" asChild className="h-12 px-7">
              <Link to="/signup">Créer ma boutique <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 border-white/30 bg-white/10 px-7 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground">
              <Link to="/dashboard">Demander une démonstration</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container mx-auto grid gap-8 px-4 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold">Creativ Pressing</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Le CRM des pressings sénégalais.</p>
        </div>
        <FooterCol title="Produit" links={[["Accueil", "/"], ["Fonctionnalités", "#features"], ["Tarifs", "#"], ["Démo", "/dashboard"]]} />
        <FooterCol title="Entreprise" links={[["À propos", "#"], ["Contact", "#"], ["Blog", "#"]]} />
        <FooterCol title="Légal" links={[["Politique de confidentialité", "#"], ["Conditions", "#"]]} />
      </div>
      <div className="container mx-auto mt-10 border-t px-4 pt-6 text-center text-xs text-muted-foreground">
        © 2026 Creativ Pressing. Tous droits réservés.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map(([l, h]) => (
          <li key={l}><a href={h} className="hover:text-primary">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <ProblemsSection />
        <FeaturesSection />
        <RolesSection />
        <ScreensSection />
        <AdvantagesSection />
        <Testimonials />
        <StatsSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
