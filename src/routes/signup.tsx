import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Store,
  User,
  Phone,
  MapPin,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
  CheckCircle2,
  BadgeCheck,
  Wallet,
  Layers,
  Clock3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { pressingApi } from "@/services/pressing-api";
import { saveAuthSession } from "@/services/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [{ title: "Créer ma boutique - Creativ Pressing" }],
  }),
  component: SignupPage,
});

type FieldConfig = {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  icon: LucideIcon;
  section: "shop" | "account";
  autoComplete?: string;
  fullWidth?: boolean;
};

const shopFields: FieldConfig[] = [
  {
    id: "shop",
    name: "shop",
    label: "Nom du pressing",
    type: "text",
    placeholder: "Ex : Pressing Le Lys",
    icon: Store,
    section: "shop",
    autoComplete: "organization",
  },
  {
    id: "owner",
    name: "owner",
    label: "Nom du propriétaire",
    type: "text",
    placeholder: "Ex : Awa Diop",
    icon: User,
    section: "shop",
    autoComplete: "name",
  },
  {
    id: "phone",
    name: "phone",
    label: "Téléphone",
    type: "tel",
    placeholder: "+221 77 000 00 00",
    icon: Phone,
    section: "shop",
    autoComplete: "tel",
  },
  {
    id: "city",
    name: "city",
    label: "Ville",
    type: "text",
    placeholder: "Ex : Dakar",
    icon: Building2,
    section: "shop",
    autoComplete: "address-level2",
  },
  {
    id: "address",
    name: "address",
    label: "Adresse complète",
    type: "text",
    placeholder: "Ex : Rue 10, Sacré-Cœur",
    icon: MapPin,
    section: "shop",
    autoComplete: "street-address",
    fullWidth: true,
  },
];

const accountFields: FieldConfig[] = [
  {
    id: "email",
    name: "email",
    label: "Adresse email",
    type: "email",
    placeholder: "vous@pressing.sn",
    icon: Mail,
    section: "account",
    autoComplete: "email",
    fullWidth: true,
  },
  {
    id: "password",
    name: "password",
    label: "Mot de passe",
    type: "password",
    placeholder: "••••••••",
    icon: Lock,
    section: "account",
    autoComplete: "new-password",
    fullWidth: true,
  },
];

const benefits = [
  {
    icon: Store,
    title: "Boutique prête",
    description: "Votre espace de gestion est configuré dès la création du compte.",
  },
  {
    icon: Wallet,
    title: "Caisse structurée",
    description: "Encaissements, dépenses et paiements restent centralisés.",
  },
  {
    icon: Layers,
    title: "Commandes suivies",
    description: "Chaque dépôt devient traçable jusqu’au retrait client.",
  },
];

const reassuranceItems = [
  "Création rapide",
  "Interface mobile",
  "Gestion sécurisée",
];

function BrandLogo({ centered = false }: { centered?: boolean }) {
  return (
    <Link
      to="/"
      className={`group flex w-fit items-center gap-3 ${
        centered ? "mx-auto" : ""
      }`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-lg shadow-sky-600/20 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
        <Sparkles className="h-5 w-5" />
      </div>

      <div>
        <span className="block text-lg font-black tracking-tight text-slate-950">
          Creativ Pressing
        </span>
      </div>
    </Link>
  );
}

function SectionTitle({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-xs font-black text-sky-700 ring-1 ring-sky-100">
        {index}
      </div>

      <div>
        <h2 className="text-sm font-black uppercase tracking-wide text-slate-900">
          {title}
        </h2>
        <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function SignupPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const shopName = String(formData.get("shop") ?? "").trim();
    const ownerName = String(formData.get("owner") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setLoading(true);

    try {
      const session = await pressingApi.auth.signup({
        shopName,
        ownerName,
        phone,
        city,
        address,
        email,
        password,
      });

      saveAuthSession(session);
      toast.success(`Boutique ${session.shopName} créée`);
      nav({ to: "/dashboard" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Création impossible",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 antialiased lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-sky-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
        <div className="absolute inset-0">
          <div className="absolute -left-32 top-12 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_80%_75%,rgba(14,165,233,0.24),transparent_30%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(to_right,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
        </div>

        <div className="relative z-10 flex w-fit items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 shadow-lg shadow-black/10 backdrop-blur-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          <div>
            <span className="block text-lg font-black tracking-tight text-white">
              Creativ Pressing
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-sky-100 shadow-lg shadow-black/10 backdrop-blur-md">
            <BadgeCheck className="h-4 w-4 text-sky-300" />
            Lancement boutique en quelques minutes
          </div>

          <div className="space-y-5">
            <h1 className="max-w-lg text-5xl font-black leading-[1.03] tracking-tight xl:text-6xl">
              Digitalisez votre pressing dès aujourd’hui.
            </h1>

            <p className="max-w-md text-base font-medium leading-relaxed text-sky-100/75">
              Créez votre espace, centralisez vos clients, suivez vos commandes
              et pilotez votre caisse depuis une interface claire et moderne.
            </p>
          </div>

          <div className="grid max-w-lg gap-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="group rounded-3xl border border-white/10 bg-white/[0.08] p-4 shadow-xl shadow-black/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sky-200 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-white">
                        {benefit.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-sky-100/65">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Card className="max-w-lg rounded-[2rem] border-white/10 bg-white/10 p-5 text-white shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200/70">
                  Configuration rapide
                </p>
                <h3 className="mt-1 text-lg font-black">
                  Votre espace est prêt après inscription
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/20 text-sky-200">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {["Boutique", "Compte", "Dashboard"].map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 p-3"
                >
                  <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 text-xs font-black text-sky-100">
                    {index + 1}
                  </div>

                  <p className="text-xs font-black text-white">{item}</p>
                  <p className="mt-1 text-[11px] font-semibold text-sky-100/55">
                    {index === 0
                      ? "Infos"
                      : index === 1
                        ? "Accès"
                        : "Pilotage"}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-sky-100/50">
          <span>© 2026 Creativ Pressing</span>
          <span>Conçu pour les pressings au Sénégal</span>
        </div>
      </aside>

      <main className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.10),transparent_30%)]" />

        <div className="relative z-10 w-full max-w-2xl">
          <div className="mb-8 lg:hidden">
            <BrandLogo centered />
          </div>

          <Card className="overflow-hidden rounded-[2rem] border-slate-200/80 bg-white/90 shadow-2xl shadow-sky-950/10 backdrop-blur-xl">
            <div className="border-b border-slate-100 bg-gradient-to-br from-white to-sky-50/70 p-6 text-center sm:p-8 sm:text-left">
              <div className="mb-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/20">
                  <Store className="h-5 w-5" />
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Inscription sécurisée
                </div>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                Créer ma boutique
              </h2>

              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                Configurez votre espace de gestion et commencez à structurer
                vos opérations en moins de deux minutes.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                {reassuranceItems.map((item) => (
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

            <form className="space-y-8 p-6 sm:p-8" onSubmit={handleSubmit}>
              <section className="space-y-5">
                <SectionTitle
                  index="1"
                  title="Votre pressing"
                  description="Renseignez les informations principales de votre boutique."
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  {shopFields.map((field) => (
                    <FormField key={field.id} field={field} />
                  ))}
                </div>
              </section>

              <section className="space-y-5">
                <SectionTitle
                  index="2"
                  title="Vos accès"
                  description="Ces identifiants serviront à accéder à votre tableau de bord."
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  {accountFields.map((field) => (
                    <FormField
                      key={field.id}
                      field={field}
                      showPassword={showPassword}
                      onTogglePassword={() =>
                        setShowPassword((value) => !value)
                      }
                    />
                  ))}
                </div>
              </section>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <p className="text-xs font-medium leading-relaxed text-slate-600">
                    Vos données de boutique seront utilisées pour créer votre
                    espace de gestion. Vous pourrez compléter ou modifier ces
                    informations depuis votre tableau de bord.
                  </p>
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
                    Initialisation de votre boutique...
                  </>
                ) : (
                  <>
                    Créer ma boutique gratuitement
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-5 text-center text-sm font-medium text-slate-500 sm:px-8">
              Vous avez déjà un compte ?{" "}
              <Link
                to="/login"
                className="font-black text-sky-600 transition-colors hover:text-sky-700 hover:underline"
              >
                Se connecter
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

function FormField({
  field,
  showPassword,
  onTogglePassword,
}: {
  field: FieldConfig;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}) {
  const Icon = field.icon;
  const isPassword = field.name === "password";

  return (
    <div className={`space-y-2 ${field.fullWidth ? "sm:col-span-2" : ""}`}>
      <Label
        htmlFor={field.id}
        className="text-xs font-bold uppercase tracking-wide text-slate-600"
      >
        {field.label}
      </Label>

      <div className="group relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-sky-600" />

        <Input
          id={field.id}
          name={field.name}
          type={isPassword && showPassword ? "text" : field.type}
          required
          autoComplete={field.autoComplete}
          placeholder={field.placeholder}
          className="h-12 rounded-2xl border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-sky-300 focus-visible:bg-white focus-visible:ring-sky-500/20"
        />

        {isPassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label={
              showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
            }
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}