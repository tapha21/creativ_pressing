import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Users, ShoppingBag, Wallet, BarChart3, UserCog, Images, Bell, FileText,
  CreditCard, History, ShieldCheck, Sparkles, Clock, TrendingUp, MapPin,
  CheckCircle2, ArrowRight, PlayCircle, Menu, X, AlertTriangle,
  Flame, Shirt, Percent, Landmark, HelpCircle, ChevronRight,UserCheck,
  QrCode, Download, Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isPwaDisplayMode } from "@/services/auth";


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
    { href: "#download", label: "Télécharger" },
    { href: "#advantages", label: "Avantages" },
    { href: "#faq", label: "FAQ" },
  ];
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:rotate-12 duration-300" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Creativ Pressing</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full py-1">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild><Link to="/login">Connexion</Link></Button>
          <Button variant="outline" asChild><a href="#download">Télécharger</a></Button>
          <Button asChild className="shadow-sm bg-primary hover:opacity-90 transition-opacity"><Link to="/signup">Créer ma boutique</Link></Button>
        </div>
        <button className="md:hidden p-2 rounded-md hover:bg-muted" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t bg-background md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="container mx-auto flex flex-col gap-3 px-4 py-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium py-2 px-3 rounded-md hover:bg-muted transition-colors" onClick={() => setOpen(false)}>{l.label}</a>
            ))}
            <div className="flex gap-2 pt-2 border-t mt-2">
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
    <section className="relative overflow-hidden border-b" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 -z-10 opacity-50" style={{ backgroundImage: "radial-gradient(circle at 20% 10%, oklch(0.85 0.1 250 / 0.4), transparent 40%), radial-gradient(circle at 90% 30%, oklch(0.8 0.15 240 / 0.35), transparent 50%)" }} />
      <div className="container mx-auto grid gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col justify-center space-y-6">
          <Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5 text-xs font-medium border bg-secondary/50 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            L'excellence tech au service des pressings sénégalais
          </Badge>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl text-balance">
            Gérez votre pressing<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-extrabold">
              en toute simplicité
            </span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
            Le CRM tout-en-un conçu spécifiquement pour les réalités des pressings au Sénégal. Suivez vos clients, commandes, encaissements et dépenses en un clic.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <Button size="lg" asChild className="h-12 px-7 text-base shadow-lg group">
              <Link to="/signup">Créer ma boutique gratuitement <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="h-12 px-7 text-base shadow-md">
              <a href="#download"><Download className="mr-2 h-5 w-5" /> Télécharger l'app</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-7 text-base bg-background/50 backdrop-blur-sm hover:bg-background">
              <Link to="/dashboard"><PlayCircle className="mr-2 h-5 w-5 text-primary" /> Voir la démo</Link>
            </Button>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Sans engagement</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Sauvegardes cloud quotidiennes</div>
          </div>
        </div>
        <div className="relative lg:ml-4">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

function InstallSection() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [iosHint, setIosHint] = useState(false);
  const appUrl = "https://creativ-pressing.vercel.app/";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(appUrl)}`;

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  const installAndroid = async () => {
    if (!deferredPrompt) {
      window.location.href = appUrl;
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice.catch(() => null);
    setDeferredPrompt(null);
  };

  const installIos = () => {
    setIosHint(true);
  };

  return (
    <section id="download" className="border-y bg-slate-50/60 py-20">
      <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <Badge variant="outline" className="gap-2 border-primary/20 bg-primary/5 text-primary">
            <Smartphone className="h-3.5 w-3.5" />
            Application PWA
          </Badge>
          <div className="max-w-2xl space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Installez Creativ Pressing sur votre telephone</h2>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Scannez le QR code ou utilisez le bouton adapte a votre appareil pour ajouter l'application sur votre ecran d'accueil.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" size="lg" onClick={installAndroid} className="h-12 gap-2 px-6 font-semibold">
              <Download className="h-4 w-4" />
              Telecharger Android
            </Button>
            <Button type="button" size="lg" variant="outline" onClick={installIos} className="h-12 gap-2 bg-background px-6 font-semibold">
              <Download className="h-4 w-4" />
              Telecharger iOS
            </Button>
          </div>
          {iosHint && (
            <Card className="max-w-xl border-blue-100 bg-blue-50/80 p-4 text-sm font-medium text-blue-900">
              Sur iPhone, ouvrez le lien dans Safari, touchez Partager, puis Ajouter a l'ecran d'accueil.
            </Card>
          )}
        </div>
        <Card className="mx-auto w-full max-w-[260px] border-slate-200 bg-background p-5 text-center shadow-sm">
          <div className="mb-3 flex items-center justify-center gap-2 text-sm font-bold text-slate-900">
            <QrCode className="h-4 w-4 text-primary" />
            QR code
          </div>
          <img src={qrUrl} alt="QR code Creativ Pressing" className="mx-auto h-52 w-52 rounded-lg border bg-white p-2" loading="lazy" />
          <a href={appUrl} className="mt-3 block truncate text-xs font-semibold text-primary hover:underline">
            creativ-pressing.vercel.app
          </a>
        </Card>
      </div>
    </section>
  );
}

export function DashboardMockup() {
  // Les éléments exacts de ton menu de navigation réel
  const sideMenu = [
    { label: "Tableau de bord", icon: BarChart3 },
    { label: "Clients", icon: Users },
    { label: "Commandes", icon: ShoppingBag },
    { label: "Dépenses", icon: Wallet },
    { label: "Rapports", icon: FileText },
  ];

  return (
    <div className="relative group/mockup">
      {/* Effet d'ombrage coloré en arrière-plan */}
      <div className="absolute -inset-4 -z-10 rounded-3xl opacity-20 blur-3xl transition-opacity group-hover/mockup:opacity-30 duration-500" style={{ background: "var(--gradient-primary)" }} />
      
      <Card className="overflow-hidden border shadow-2xl transition-all duration-300 group-hover/mockup:shadow-indigo-500/10" style={{ boxShadow: "var(--shadow-elegant)" }}>
        {/* En-tête type fenêtre de navigateur */}
        <div className="flex items-center gap-1.5 border-b bg-muted/60 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="ml-3 text-xs font-mono text-muted-foreground/80">app.creativpressing.sn</span>
        </div>

        <div className="grid grid-cols-12 bg-background">
          {/* Sidebar latérale avec tes vrais onglets */}
          <aside className="col-span-3 border-r bg-muted/10 p-3 hidden sm:block">
            <div className="mb-5 flex items-center gap-2 px-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-[10px] text-primary-foreground font-bold">C</div>
              <span className="text-xs font-bold tracking-tight">Creativ</span>
            </div>
            {sideMenu.map((item, i) => (
              <div 
                key={item.label} 
                className={`mb-1 flex items-center gap-2 rounded px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                  i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground/90 hover:bg-muted"
                }`}
              >
                <item.icon className="h-3.5 w-3.5 shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </aside>

          {/* Corps principal de ton application */}
          <main className="col-span-12 sm:col-span-9 p-4 bg-slate-50/50">
            {/* Topbar de salutation */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-muted-foreground font-medium">Gestionnaire : Compte connecté</div>
                <div className="text-xs font-bold text-foreground">Performance & Activités</div>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-foreground" />
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">CP</div>
              </div>
            </div>

            {/* 📊 Ligne 1 : Statistiques macro (Finances et Volumes) */}
            <div className="mb-3 grid grid-cols-3 gap-2">
              {[
                { l: "Revenus", v: "720.000 F", t: "+12%", i: Landmark, c: "text-blue-600 bg-blue-50" },
                { l: "Commandes", v: "184 fiches", t: "+8%", i: ShoppingBag, c: "text-indigo-600 bg-indigo-50" },
                { l: "Clients", v: "96 actifs", t: "+5%", i: Users, c: "text-emerald-600 bg-emerald-50" },
              ].map((k) => (
                <div key={k.l} className="rounded-lg border bg-background p-2 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">{k.l}</span>
                    <div className={`p-1 rounded ${k.c}`}><k.i className="h-3 w-3" /></div>
                  </div>
                  <div className="mt-0.5 text-xs font-black text-slate-800">{k.v}</div>
                  <div className="text-[8px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                    <TrendingUp className="h-2 w-2" /> {k.t}
                  </div>
                </div>
              ))}
            </div>

            {/* 👥 Ligne 2 : Les nouvelles mesures de performance opérationnelle du pressing */}
            <div className="mb-4 grid grid-cols-3 gap-2">
              {[
                { l: "Top Agent", v: "Agent actif", t: "145 cmdes", i: UserCheck, c: "text-purple-600 bg-purple-50" },
                { l: "Pointe", v: "18h - 20h", t: "110 cmdes", i: Clock, c: "text-amber-600 bg-amber-50" },
                { l: "Canal Top", v: "Wave", t: "340.000 F", i: Wallet, c: "text-cyan-600 bg-cyan-50" },
              ].map((k) => (
                <div key={k.l} className="rounded-lg border bg-background p-2 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">{k.l}</span>
                    <div className={`p-1 rounded ${k.c}`}><k.i className="h-3 w-3" /></div>
                  </div>
                  <div className="mt-0.5 text-xs font-black text-slate-800 truncate">{k.v}</div>
                  <div className="text-[8px] font-medium text-slate-500 mt-0.5 truncate">{k.t}</div>
                </div>
              ))}
            </div>

            {/* Graphique de flux financier miniature (Correction CSS incluse) */}
            <div className="rounded-lg border bg-background p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-700">
                <span>Volume d'affaires mensuel (FCFA)</span>
                <span className="text-[9px] text-muted-foreground font-normal">Tendances</span>
              </div>
              <div className="flex h-16 items-end gap-1.5 pt-2">
                {[40, 55, 48, 70, 62, 85, 78, 92, 70, 88, 95, 100].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 rounded-t-sm transition-all duration-300 hover:opacity-80 from-blue-600 to-indigo-500 bg-gradient-to-t" 
                    style={{ height: `${h}%` }} 
                  />
                ))}
              </div>
            </div>
          </main>
        </div>
      </Card>

      {/* Petit toast pop-up SMS de succès */}
      <Card className="absolute -bottom-5 -left-4 hidden gap-2.5 p-3 shadow-xl sm:flex sm:items-center bg-background/90 backdrop-blur-md animate-bounce duration-1000 border-emerald-100 border">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 shrink-0">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-slate-800">SMS Envoyé automatiquement</div>
          <div className="text-[9px] text-muted-foreground">"Commande prête !" au client</div>
        </div>
      </Card>
    </div>
  );
}

function ProblemsSection() {
  const problems = [
    { text: "Difficulté à suivre les commandes en cours", icon: Clock, color: "text-amber-600 bg-amber-50" },
    { text: "Perte ou détérioration des tickets papier", icon: FileText, color: "text-red-600 bg-red-50" },
    { text: "Oublis récurrents de paiements clients", icon: Wallet, color: "text-rose-600 bg-rose-50" },
    { text: "Suivi opaque des dépenses opérationnelles", icon: AlertTriangle, color: "text-orange-600 bg-orange-50" },
    { text: "Manque total de visibilité sur les bénéfices réels", icon: BarChart3, color: "text-purple-600 bg-purple-50" },
    { text: "Gestion manuelle fastidieuse sur cahier", icon: History, color: "text-slate-600 bg-slate-50" },
  ];
  return (
    <section className="border-y bg-muted/20 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Le Constat</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900">Les vrais défis des pressings au Sénégal</h2>
          <p className="text-muted-foreground text-base">Gérer un pressing sur papier ou de mémoire freine votre croissance. Vous reconnaissez-vous ici ?</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, index) => (
            <Card key={index} className="flex items-center gap-4 p-5 transition-all duration-300 hover:shadow-md hover:border-slate-300 bg-background group">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${p.color} transition-transform group-hover:scale-110`}>
                <p.icon className="h-5 w-5" />
              </div>
              <span className="font-medium text-sm text-slate-800">{p.text}</span>
            </Card>
          ))}
        </div>
        <div className="mt-16 rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-8 text-center shadow-inner md:p-12 max-w-4xl mx-auto">
          <Badge className="mb-4 bg-primary text-primary-foreground">La Solution unique</Badge>
          <h3 className="text-2xl font-bold md:text-3xl text-slate-900">Tout votre business dans votre poche</h3>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            Creativ Pressing centralise vos clients, commandes, encaissements (Orange Money, Wave, Cash) et dépenses pour vous faire gagner en sérénité et en rentabilité.
          </p>
        </div>
      </div>
    </section>
  );
}

const features = [
  { 
    icon: Users, 
    title: "Gestion des clients", 
    items: ["Fiche client & coordonnées", "Historique complet des lavages", "Recherche instantanée par numéro", "Fidélisation intelligente"] 
  },
  { 
    icon: ShoppingBag, 
    title: "Suivi des commandes", 
    items: ["Création de dépôt ultra-rapide", "Catégorisation (Robe, Grand Boubou...)", "Statut clair (Reçu, Lavage, Prêt)", "Alerte automatique de retard"] 
  },
  { 
    icon: Wallet, 
    title: "Suivi des dépenses", 
    items: ["Factures d'eau et électricité", "Salaires & commissions du personnel", "Achat de produits de nettoyage", "Gestion des pannes & maintenance"] 
  },
  { 
    icon: BarChart3, 
    title: "Analyses de performance", 
    items: ["Évolution du chiffre d'affaires", "Graphique des heures de pointe / rushs", "Top vêtements les plus déposés", "Classement d'activité du personnel"] 
  },
  { 
    icon: UserCog, 
    title: "Gestion d'équipe", 
    items: ["Comptes dédiés pour vos employés", "Volume de commandes gérées par agent", "Historique des actions par agent", "Attribution des rôles sécurisés"] 
  },
  { 
    icon: Images, 
    title: "Preuves Photos & États", 
    items: ["Photos avant lavage (taches, accrocs)", "Photos après repassage", "Protection contre les litiges clients"] 
  },
  { 
    icon: Bell, 
    title: "Alertes & Rappels", 
    items: ["Rappels des commandes en retard", "Notification de stock de lessive bas", "Alertes d'encaissements restants"] 
  },
  { 
    icon: FileText, 
    title: "Rapports d'activité", 
    items: ["Clôture de caisse journalière", "Bilan comptable hebdomadaire", "Synthèse mensuelle pour le gérant", "Calcul automatique du bénéfice net"] 
  },
  { 
    icon: CreditCard, 
    title: "Paiements & Relances", 
    items: ["Gestion des acomptes", "Filtre clients non-payés", "Répartition des règlements Wave, OM, Espèces", "Historique du mode de règlement"] 
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Fonctionnalités</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900">Une suite d'outils redoutable</h2>
          <p className="text-muted-foreground">Tout a été pensé pour simplifier le quotidien de vos équipes, du dépôt à la livraison.</p>
        </div>
        
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300">
              <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-bl-full transition-all duration-500 group-hover:bg-primary/10" />
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110 shadow-md shadow-primary/20" style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{f.title}</h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {f.items.map((it) => (
                  <li key={it} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-slate-600 text-[13px]">{it}</span>
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
    <section className="bg-slate-50/50 border-y py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Sécurité & Rôles</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900">Protégez vos finances en toute sérénité</h2>
          <p className="text-muted-foreground">Attribuez des accès restreints à vos employés pour garder un contrôle absolu sur votre argent.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="border-primary/30 p-8 shadow-md relative bg-background group hover:border-primary/50 transition-colors">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-primary"><ShieldCheck className="h-6 w-6" /></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Propriétaire / Gérant</h3>
                  <p className="text-xs text-muted-foreground">Contrôle et visibilité totale</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none text-[10px]">Super Admin</Badge>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              {["Dashboard financier en temps réel", "Consultation des bénéfices nets", "Validation des dépenses majeures", "Gestion complète des employés", "Extraction des rapports comptables"].map((i) => (
                <li key={i} className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /><span>{i}</span></li>
              ))}
            </ul>
          </Card>
          <Card className="p-8 bg-background hover:border-slate-300 transition-colors">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-50 text-slate-600"><Users className="h-6 w-6" /></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Réceptionniste / Agent</h3>
                  <p className="text-xs text-muted-foreground">Opérations quotidiennes</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px]">Accès Restreint</Badge>
            </div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600">Autorisé</div>
            <ul className="space-y-2 text-xs text-slate-600 border-b pb-4 mb-4">
              {["Enregistrer les clients & dépôts", "Changer le statut d'un vêtement", "Prendre des photos des vêtements"].map((i) => (
                <li key={i} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />{i}</li>
              ))}
            </ul>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-rose-600">Bloqué</div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {["Masquage automatique du chiffre d'affaires", "Impossible de supprimer une commande", "Pas d'accès à la configuration système"].map((i) => (
                <li key={i} className="flex items-center gap-2"><X className="h-3.5 w-3.5 text-rose-500 shrink-0" />{i}</li>
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
    { title: "Le Tableau de Bord principal", desc: "Suivez le chiffre d'affaires, les objectifs et la santé financière de vos boutiques.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
    { title: "Prise de commande rapide", desc: "Enregistrez un dépôt de vêtements en moins de 30 secondes chrono.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" },
    { title: "Registre intelligent des clients", desc: "Accédez à la fiche de fidélité et aux numéros de téléphone en un instant.", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80" },
    { title: "Suivi analytique des charges", desc: "Visualisez graphiquement où part votre argent pour mieux réduire vos coûts.", img: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80" },
  ];
  return (
    <section id="screens" className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Interface & Ergonomie</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900">Une fluidité pensée pour le terrain</h2>
          <p className="text-muted-foreground">Une application simple, épurée et ultra-rapide, accessible sur smartphone, tablette et PC.</p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {screens.map((s, idx) => (
            <Card key={idx} className="overflow-hidden p-0 transition-all duration-300 hover:shadow-2xl border bg-background group">
              <div className="aspect-video overflow-hidden bg-muted relative">
                <img src={s.img} alt={s.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-medium flex items-center gap-1 bg-black/40 backdrop-blur-md py-1 px-2.5 rounded">Aperçu en grand <ChevronRight className="h-3 w-3" /></span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-base text-slate-900 mb-1.5">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
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
    { icon: Clock, title: "Zéro Perte de Temps", desc: "Vos process sont automatisés, vos fiches standardisées." },
    { icon: Flame, title: "Litiges Divisés par 4", desc: "Grâce aux photos d'état avant nettoyage stockées sur le cloud." },
    { icon: TrendingUp, title: "+25% de Rentabilité", desc: "En traquant chaque impayé et chaque gaspillage de produit." },
    { icon: ShieldCheck, title: "Fraude Évitée", desc: "Le personnel ne peut ni supprimer ni falsifier de commande." },
    { icon: MapPin, title: "100% Réalités Locales", desc: "Prise en compte des coupures, des devises et des habitudes de Dakar." },
  ];
  return (
    <section id="advantages" className="bg-slate-50/50 border-y py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Pourquoi nous choisir</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900">L'impact immédiat sur votre pressing</h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {advs.map((a, i) => (
            <Card key={i} className="p-5 text-center transition-all duration-300 hover:shadow-md hover:border-slate-300 bg-background group">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white duration-300">
                <a.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-2">{a.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function useCountUp(target: number, duration = 1400) {
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
    <div ref={ref} className="text-center p-4">
      <div className="text-4xl font-black md:text-5xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
        {val.toLocaleString("fr-FR")}{suffix}
      </div>
      <div className="mt-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}

function StatsSection() {
  return (
    <section className="border-y bg-slate-50/50 py-16">
      <div className="container mx-auto grid gap-6 grid-cols-2 md:grid-cols-4 max-w-4xl">
        <StatItem value={500} suffix="+" label="Pressings cibles" />
        <StatItem value={45} suffix="M+" label="FCFA Sécurisés" />
        <StatItem value={98} suffix="%" label="Fidélisation" />
        <StatItem value={100} suffix="%" label="Disponibilité Cloud" />
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Comment se passe l'envoi de SMS aux clients ?", a: "Dès que le statut de la commande passe à 'Prêt', un SMS personnalisé est envoyé au client automatiquement pour l'inviter à venir récupérer son linge." },
    { q: "Puis-je gérer plusieurs boutiques avec un seul compte ?", a: "Absolument. Vous pouvez basculer d'un point de vente à un autre depuis votre tableau de bord gérant." },
    { q: "Mes données sont-elles à l'abri si je perds mon téléphone ?", a: "Oui, tout est stocké sur des serveurs sécurisés en continu. Vous changez d'appareil, vous vous reconnectez, et tout est là." },
    { q: "Y a-t-il une formation pour mon personnel ?", a: "L'interface a été épurée au maximum pour être intuitive. De plus, nous fournissons des guides vidéos courts en wolof et en français." },
  ];
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Des réponses à tout</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900">Questions fréquentes</h2>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border rounded-xl px-4 bg-background shadow-sm hover:border-slate-300 transition-colors">
              <AccordionTrigger className="text-left font-semibold text-sm py-4 text-slate-900 hover:no-underline flex gap-3">
                <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pl-7 border-t pt-3">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl p-10 text-center md:p-16 shadow-xl" style={{ background: "linear-gradient(135deg, #1e3a8a, #312e81)" }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white, transparent 40%)" }} />
          <h2 className="relative text-3xl font-bold text-white md:text-5xl tracking-tight text-balance">Prêt à moderniser votre pressing ?</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-indigo-100 text-sm md:text-base">
            Passez au niveau supérieur. Moins de paperasse, plus de revenus, des clients ravis.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild className="h-12 px-8 font-semibold shadow-md bg-white text-blue-900 hover:bg-slate-100 group">
              <Link to="/signup">Créer mon compte <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 border-white/20 bg-white/5 px-8 text-white hover:bg-white/10 hover:text-white">
              <Link to="/dashboard">Tester la démo gratuite</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-slate-400 py-16">
      <div className="container mx-auto grid gap-10 px-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-base">Creativ Pressing</span>
          </div>
          <p className="text-xs leading-relaxed">Le logiciel de gestion de caisse et de relation client leader pour les pressings et blanchisseries au Sénégal.</p>
        </div>
        <FooterCol title="Produit" links={[["Accueil", "/"], ["Fonctionnalités", "#features"], ["Tarifs", "#"], ["Démo Interactive", "/dashboard"]]} />
        <FooterCol title="Entreprise" links={[["À propos", "#"], ["Contactez-nous", "#"], ["Blog & Conseils", "#"]]} />
        <FooterCol title="Légal" links={[["Confidentialité des données", "#"], ["Conditions d'Utilisation", "#"]]} />
      </div>
      <div className="container mx-auto mt-12 border-t border-slate-800 px-4 pt-6 text-center text-xs text-slate-500">
        © 2026 Creativ Pressing. Conçu fièrement pour les entrepreneurs sénégalais. Tous droits réservés.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">{title}</h4>
      <ul className="space-y-2 text-xs">
        {links.map(([l, h]) => (
          <li key={l}><a href={h} className="hover:text-white transition-colors">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}

function LandingPage() {
  useEffect(() => {
    if (isPwaDisplayMode() && window.location.pathname === "/") {
      window.location.replace("/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background antialiased selection:bg-primary/10 selection:text-primary">
      <Navbar />
      <main>
        <Hero />
        <InstallSection />
        <ProblemsSection />
        <FeaturesSection />
        <RolesSection />
        <ScreensSection />
        <AdvantagesSection />
        <StatsSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
