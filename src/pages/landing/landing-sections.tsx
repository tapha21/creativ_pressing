import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Download,
  Globe,
  HelpCircle,
  PlayCircle,
  QrCode,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";

import {
  advantages,
  dashboardKpis,
  faqs,
  features,
  problems,
  proofStats,
  sideMenu,
} from "./landing-data";
import { SectionHeader } from "./landing-layout";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function Hero() {
  return (
    <section className="water-section water-hero border-b border-sky-100 py-20 lg:py-28">
      <div className="container relative z-10 mx-auto grid items-center gap-12 px-4 lg:grid-cols-2">
        <div className="flex flex-col justify-center space-y-6 text-left">
          <div className="water-badge px-3 py-1.5 text-xs font-black">
            <span className="water-badge-dot" />
            L'excellence tech au service des pressings sénégalais
          </div>

          <h1 className="water-title text-4xl font-black leading-[1.05] md:text-5xl lg:text-6xl">
            Gérez votre pressing
            <br />
            <span>comme une machine propre</span>
          </h1>

          <p className="water-subtitle max-w-xl text-lg font-medium leading-relaxed">
            Le CRM tout-en-un conçu pour les pressings sénégalais : clients, commandes, caisse, dépenses, photos et performance dans une seule interface fluide.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link to="/signup" className="water-button group h-12 px-7 text-base">
              Créer ma boutique gratuitement
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/demo" className="water-button-outline h-12 px-7 text-base">
              <PlayCircle className="mr-2 h-5 w-5 text-sky-500" />
              Voir la démo
            </Link>
          </div>

          <div className="water-muted flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-sky-100 pt-4 text-sm font-bold">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sky-500" />Sans engagement</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sky-500" />Sauvegardes cloud quotidiennes</div>
          </div>
        </div>

        <div className="water-float relative lg:ml-4">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

export function DashboardMockup() {
  return (
    <div id="demo-preview" className="relative w-full scroll-mt-24">
      <div className="water-panel overflow-hidden rounded-3xl">
        <div className="flex items-center justify-between border-b border-sky-100 bg-white/80 px-4 py-2.5">
          <div className="flex w-1/4 items-center gap-1.5"><span className="nav-dot" /><span className="nav-dot" /><span className="nav-dot" /></div>
          <div className="flex w-2/4 items-center justify-center gap-2 rounded-xl border border-sky-100 bg-white px-3 py-1 text-[11px] font-bold text-sky-700 shadow-inner">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-sky-500" />
            <span className="truncate">https://demo.creativpressing.sn/dashboard</span>
          </div>
          <div className="flex w-1/4 justify-end text-sky-500"><Globe className="h-3.5 w-3.5" /></div>
        </div>

        <div className="grid grid-cols-12 bg-white/70">
          <aside className="col-span-3 hidden border-r border-sky-100 bg-sky-50/60 p-3 sm:block">
            <div className="mb-6 px-2 pt-1 text-xs font-black tracking-tight text-sky-950">Creativ_Pressing</div>
            {sideMenu.map((item, index) => (
              <div key={item.label} className={`mb-1 flex items-center gap-2.5 rounded-xl px-3 py-2 text-[11px] font-black transition-all ${index === 0 ? "bg-sky-600 text-white shadow-sm shadow-sky-600/20" : "text-sky-800/60 hover:bg-white hover:text-sky-700"}`}>
                <item.icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </aside>

          <main className="col-span-12 bg-sky-50/35 p-5 sm:col-span-9">
            <div className="mb-5 flex items-center justify-between border-b border-sky-100 pb-3">
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-sky-500/70">Boutique Fictive</div>
                <div className="text-xs font-black text-sky-950">Tableau de Bord Général</div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-sky-100 bg-white py-1 pl-2 pr-1 shadow-sm">
                <span className="text-[10px] font-black text-sky-800">Awa Diop</span>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-[9px] font-black text-sky-700">AD</div>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              {dashboardKpis.map((item) => (
                <div key={item.label} className="water-card flex min-h-28 flex-col justify-between rounded-2xl p-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-sky-600/60">{item.label}</span>
                    <div className="water-icon-soft h-7 w-7 shrink-0"><item.icon className="h-3.5 w-3.5" /></div>
                  </div>
                  <div className="water-kpi-value mt-2 truncate text-sm font-black">{item.value}</div>
                  <div className="mt-1 flex items-center gap-1 text-[8px] font-black text-sky-600"><TrendingUp className="h-2 w-2" />{item.text}</div>
                </div>
              ))}
            </div>

            <div className="water-card rounded-2xl p-3.5">
              <div className="mb-2 flex items-center justify-between text-[10px] font-black text-sky-900">
                <span>Activité des machines de lavage</span>
                <span className="rounded-full border border-sky-100 bg-white px-2 py-0.5 text-[8px] font-black text-sky-600">Direct</span>
              </div>
              <div className="flex h-16 items-end gap-1.5 pt-2">
                {[40, 55, 48, 70, 62, 85, 78, 92, 70, 88, 95, 100].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t bg-sky-500 transition-colors hover:bg-sky-400" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export function ProofStrip() {
  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-3 rounded-3xl border border-sky-100 bg-sky-50/70 p-3 sm:grid-cols-3">
          {proofStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <div className="water-icon-soft h-10 w-10 shrink-0"><stat.icon className="h-5 w-5" /></div>
              <div>
                <div className="text-xl font-black text-sky-950">{stat.value}</div>
                <div className="text-xs font-bold text-sky-700/65">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstallSection() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const appUrl = "https://creativ-pressing.vercel.app/";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(appUrl)}`;

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  return (
    <section id="download" className="water-section border-y border-sky-100 py-24">
      <div className="container relative z-10 mx-auto grid items-center gap-12 px-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="water-badge px-3.5 py-1 text-xs font-black"><Smartphone className="h-3.5 w-3.5" />Application Native PWA</div>
          <div className="max-w-2xl space-y-4">
            <h2 className="water-title text-3xl font-black tracking-tight md:text-4xl">Installez Creativ Pressing sur votre téléphone</h2>
            <p className="water-subtitle text-base font-medium leading-relaxed">Accédez à votre outil de travail comme une vraie application. Scannez le QR code depuis votre ordinateur ou utilisez le bouton correspondant à votre système.</p>
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="button" onClick={() => deferredPrompt?.prompt()} className="water-button h-12 gap-2 px-6"><Download className="h-4 w-4" />Installer sur Android</button>
            <button type="button" onClick={() => setIosHint(true)} className="water-button-outline h-12 gap-2 px-6"><Download className="h-4 w-4" />Télécharger pour iOS</button>
          </div>
          {iosHint && (
            <div className="water-card max-w-xl rounded-2xl p-4 text-sm font-medium text-sky-900">
              Sur iPhone, ouvrez l'application dans <strong>Safari</strong>, appuyez sur <strong>Partager</strong>, puis sélectionnez <strong>Ajouter sur l'écran d'accueil</strong>.
            </div>
          )}
        </div>

        <div className="water-card mx-auto w-full max-w-[290px] rounded-3xl p-6 text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-sky-500"><QrCode className="h-4 w-4" />Installation rapide</div>
          <div className="mb-3 inline-block rounded-2xl border border-sky-100 bg-white p-4">
            <img src={qrUrl} alt="QR code Creativ Pressing" className="mx-auto h-44 w-44 bg-white p-1" loading="lazy" />
          </div>
          <div className="truncate rounded-xl border border-sky-100 bg-white px-3 py-1.5 text-xs font-bold text-sky-700">creativ-pressing.vercel.app</div>
        </div>
      </div>
    </section>
  );
}

export function ProblemsSection() {
  return (
    <section className="water-section border-y border-sky-100 py-24">
      <div className="container relative z-10 mx-auto px-4">
        <SectionHeader light badge="Le Constat" title="Les vrais défis des pressings au Sénégal" description="Gérer un pressing sur papier ou de mémoire freine votre croissance. Vous reconnaissez-vous ici ?" />
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => (
            <Card key={problem.text} className="water-card group flex items-center gap-4 rounded-2xl p-5">
              <div className="water-icon-soft h-11 w-11 shrink-0 transition-transform group-hover:scale-110"><problem.icon className="h-5 w-5" /></div>
              <span className="text-sm font-black text-sky-950">{problem.text}</span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="container mx-auto px-4">
        <SectionHeader badge="Fonctionnalités" title="Une suite d'outils redoutable" description="Tout a été pensé pour simplifier le quotidien de vos équipes, du dépôt à la livraison." />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="water-card group relative rounded-3xl p-6">
              <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-3xl bg-sky-50 transition-colors group-hover:bg-white" />
              <div className="water-icon mb-5 h-12 w-12 transition-transform duration-300 group-hover:scale-110"><feature.icon className="h-5 w-5" /></div>
              <h3 className="mb-4 text-lg font-black text-sky-950 transition-colors group-hover:text-sky-600">{feature.title}</h3>
              <ul className="space-y-3 text-sm">
                {feature.items?.map((item) => (
                  <li key={item} className="flex items-start gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" /><span className="text-[13px] font-bold text-sky-900/75">{item}</span></li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RolesSection() {
  const ownerRights = ["Dashboard financier en temps réel", "Consultation des bénéfices nets", "Validation des dépenses majeures", "Gestion complète des employés", "Extraction des rapports comptables"];
  const agentRights = ["Enregistrer les clients & dépôts", "Changer le statut d'un vêtement", "Prendre des photos des vêtements"];
  const blockedRights = ["Masquage automatique du chiffre d'affaires", "Impossible de supprimer une commande", "Pas d'accès à la configuration système"];

  return (
    <section className="water-section border-y border-sky-100 py-24">
      <div className="container relative z-10 mx-auto px-4">
        <SectionHeader light badge="Sécurité & Rôles" title="Protégez vos finances en toute sérénité" description="Attribuez des accès restreints à vos employés pour garder un contrôle absolu sur votre argent." />
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          <Card className="water-card rounded-3xl p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3"><div className="water-icon h-12 w-12"><ShieldCheck className="h-6 w-6" /></div><div><h3 className="text-lg font-black text-sky-950">Propriétaire / Gérant</h3><p className="mt-0.5 text-xs font-black uppercase tracking-wider text-sky-500">Visibilité absolue</p></div></div>
              <span className="rounded-xl bg-sky-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">Super Admin</span>
            </div>
            <ul className="space-y-3 text-sm font-bold text-sky-900/75">{ownerRights.map((item) => <li key={item} className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 shrink-0 text-sky-500" /><span>{item}</span></li>)}</ul>
          </Card>

          <Card className="water-card rounded-3xl p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3"><div className="water-icon-soft h-12 w-12"><Users className="h-6 w-6" /></div><div><h3 className="text-lg font-black text-sky-950">Réceptionniste / Agent</h3><p className="mt-0.5 text-xs font-black uppercase tracking-wider text-sky-500">Production jour</p></div></div>
              <span className="rounded-xl border border-sky-100 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-sky-700">Accès Restreint</span>
            </div>
            <div className="mb-2.5 text-[10px] font-black uppercase tracking-widest text-sky-600">Autorisé</div>
            <ul className="mb-4 space-y-2 border-b border-sky-100 pb-4 text-xs font-bold text-sky-900/75">{agentRights.map((item) => <li key={item} className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 shrink-0 text-sky-500" /><span>{item}</span></li>)}</ul>
            <div className="mb-2.5 text-[10px] font-black uppercase tracking-widest text-sky-500/70">Bloqué</div>
            <ul className="space-y-2 text-xs font-semibold text-sky-900/50">{blockedRights.map((item) => <li key={item} className="flex items-center gap-2.5"><X className="h-4 w-4 shrink-0 text-sky-400" /><span>{item}</span></li>)}</ul>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function AdvantagesSection() {
  return (
    <section id="advantages" className="bg-white py-24">
      <div className="container mx-auto px-4">
        <SectionHeader badge="Pourquoi nous choisir" title="L'impact immédiat sur votre pressing" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {advantages.map((advantage) => (
            <Card key={advantage.title} className="water-card group flex flex-col items-center rounded-3xl p-5 text-center">
              <div className="water-icon-soft mb-4 h-12 w-12 transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white"><advantage.icon className="h-5 w-5" /></div>
              <h3 className="mb-2 text-sm font-black text-sky-950">{advantage.title}</h3>
              <p className="text-xs font-bold leading-relaxed text-sky-900/65">{advantage.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="water-section py-24">
      <div className="container relative z-10 mx-auto max-w-3xl px-4">
        <div className="mb-14"><SectionHeader light badge="Des réponses à tout" title="Questions fréquentes" /></div>
        <div className="w-full space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.q} className="water-card rounded-2xl">
                <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full select-none items-center justify-between gap-3 px-5 py-4 text-left text-sm font-black text-sky-950">
                  <div className="flex items-center gap-3"><HelpCircle className={`h-4 w-4 shrink-0 transition-colors ${isOpen ? "text-sky-500" : "text-sky-400"}`} /><span>{faq.q}</span></div>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-sky-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 border-t border-sky-100" : "max-h-0"}`}>
                  <p className="bg-white/60 p-5 text-[13px] font-semibold leading-relaxed text-sky-900/75">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="water-panel relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:p-16">
          <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(#0284c7 1px, transparent 1px), linear-gradient(to right, #0284c7 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="relative mx-auto max-w-2xl space-y-4">
            <h2 className="water-title text-3xl font-black leading-none tracking-tight md:text-5xl">Prêt à moderniser votre pressing ?</h2>
            <p className="water-subtitle mx-auto max-w-lg text-sm font-semibold leading-relaxed md:text-base">Moins de paperasse, plus de revenus, moins de litiges et une gestion propre comme votre linge.</p>
          </div>
          <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup" className="water-button group h-12 w-full gap-2 px-7 sm:w-auto">Créer mon compte<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            <Link to="/demo" className="water-button-outline h-12 w-full px-7 sm:w-auto">Voir la démo publique</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
