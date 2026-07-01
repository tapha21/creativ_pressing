import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Crown,
  Layers,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  Users,
  Clock3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { pressingApi } from "@/services/pressing-api";
import { saveAuthSession } from "@/services/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Connexion - Creativ Pressing" }],
  }),
  component: LoginPage,
});

const businessHighlights = [
  {
    icon: Wallet,
    title: "Caisse maîtrisée",
    description: "Suivez vos encaissements, paiements et dépenses en temps réel.",
  },
  {
    icon: Layers,
    title: "Commandes centralisées",
    description: "Chaque dépôt reste traçable, du lavage jusqu’au retrait client.",
  },
  {
    icon: Crown,
    title: "Pilotage dirigeant",
    description: "Gardez une vision claire sur votre rentabilité et votre équipe.",
  },
];

const trustItems = [
  "Accès sécurisé",
  "Données centralisées",
  "Interface mobile",
];

const dashboardStats = [
  {
    label: "Caisse du jour",
    value: "86 500 F",
    icon: Wallet,
  },
  {
    label: "Commandes",
    value: "27",
    icon: Layers,
  },
  {
    label: "Clients actifs",
    value: "148",
    icon: Users,
  },
];

function BrandLogo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group flex w-fit items-center gap-3">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105 ${
          light
            ? "bg-white/15 shadow-black/10 backdrop-blur-md"
            : "bg-sky-600 shadow-sky-600/20"
        }`}
      >
        <Sparkles className="h-5 w-5 text-white" />
      </div>

      <div>
        <span
          className={`block text-lg font-black tracking-tight ${
            light ? "text-white" : "text-slate-950"
          }`}
        >
          Creativ Pressing
        </span>
      </div>
    </Link>
  );
}

function LoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setLoading(true);

    try {
      const session = await pressingApi.auth.login({
        email,
        password,
      });

      saveAuthSession(session);
      toast.success(`Bienvenue ${session.userName}`);
      nav({ to: "/dashboard" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Connexion impossible",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 antialiased lg:grid lg:grid-cols-[1.08fr_0.92fr]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-sky-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
        <div className="absolute inset-0">
          <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.22),transparent_32%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(to_right,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
        </div>

        <div className="relative z-10">
          <BrandLogo light />
        </div>

        <div className="relative z-10 max-w-xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-sky-100 shadow-lg shadow-black/10 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-sky-300" />
            Plateforme métier sécurisée
          </div>

          <div className="space-y-5">
            <h1 className="max-w-lg text-5xl font-black leading-[1.02] tracking-tight xl:text-6xl">
              Gérez votre pressing avec une vision claire.
            </h1>

            <p className="max-w-md text-base font-medium leading-relaxed text-sky-100/75">
              Connectez-vous à votre espace pour suivre vos commandes, vos
              clients, votre caisse et vos performances depuis une interface
              conçue pour le terrain.
            </p>
          </div>

          <div className="grid max-w-lg gap-3">
            {businessHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-white/10 bg-white/[0.08] p-4 shadow-xl shadow-black/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sky-200 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-sky-100/65">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-sky-100/50">
          <span>© 2026 Creativ Pressing</span>
          <span>Conçu pour les pressings au Sénégal</span>
        </div>
      </aside>

      <main className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.10),transparent_30%)]" />

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <BrandLogo />
          </div>

          <Card className="overflow-hidden rounded-[2rem] border-slate-200/80 bg-white/90 shadow-2xl shadow-sky-950/10 backdrop-blur-xl">
            <div className="border-b border-slate-100 bg-gradient-to-br from-white to-sky-50/70 p-6 sm:p-8">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/20">
                  <Lock className="h-5 w-5" />
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Sécurisé
                </div>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                Bon retour !
              </h2>

              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                Renseignez vos identifiants pour accéder à votre espace de
                gestion.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {trustItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-600 shadow-sm ring-1 ring-slate-100"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs font-bold uppercase tracking-wide text-slate-600"
                  >
                    Adresse email
                  </Label>

                  <div className="group relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-sky-600" />

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="nom@votrepressing.sn"
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-sky-300 focus-visible:bg-white focus-visible:ring-sky-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label
                      htmlFor="password"
                      className="text-xs font-bold uppercase tracking-wide text-slate-600"
                    >
                      Mot de passe
                    </Label>

                    <a
                      href="#"
                      onClick={(event) => event.preventDefault()}
                      className="text-xs font-bold text-sky-600 transition-colors hover:text-sky-700 hover:underline"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>

                  <div className="group relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-sky-600" />

                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50/70 pl-10 pr-12 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-sky-300 focus-visible:bg-white focus-visible:ring-sky-500/20"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="group h-12 w-full rounded-2xl bg-sky-600 text-sm font-black shadow-lg shadow-sky-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-xl hover:shadow-sky-600/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Vérification des accès...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  ou
                </span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <Link
                to="/signup"
                className="flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              >
                Créer ma boutique gratuitement
              </Link>

              
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}