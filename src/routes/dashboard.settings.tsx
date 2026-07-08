import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Building2, CalendarClock, Crown, Headphones, Link2, Loader2, Mail, MapPin, Phone, Rocket, Save, Store, Trash2, Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/dashboard/page-header";
import { resolveMediaUrl } from "@/services/api";
import { getAuthSession, saveAuthSession } from "@/services/auth";
import { pressingApi } from "@/services/pressing-api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({ component: SettingsPage });

const MAX_LOGO_FILE_BYTES = 5 * 1024 * 1024;

function SettingsPage() {
  const queryClient = useQueryClient();
  const session = getAuthSession();
  const shopId = session?.shopId ?? "";
  const isPremium = session?.subscriptionPlan === "Premium";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(session?.logoUrl ?? null);
  const [logoMode, setLogoMode] = useState<"upload" | "url">("upload");

  const { data: shop, isLoading } = useQuery({
    queryKey: ["shop", shopId],
    queryFn: () => pressingApi.shops.one(shopId),
    enabled: Boolean(shopId),
  });

  useEffect(() => {
    if (shop) {
      setLogoUrl(shop.logoUrl ?? null);
    }
  }, [shop]);

  const updateShop = useMutation({
    mutationFn: (payload: Record<string, unknown>) => pressingApi.shops.update(shopId, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["shop", shopId] });
      if (session) {
        saveAuthSession({
          ...session,
          shopName: updated.name,
          logoUrl: updated.logoUrl,
          subscriptionPlan: updated.subscriptionPlan,
          subscriptionStatus: updated.subscriptionStatus,
          trialEndsAt: updated.trialEndsAt,
          subscriptionEndsAt: updated.subscriptionEndsAt,
        });
      }
      toast.success("Informations de l'entreprise enregistrees");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Enregistrement impossible"),
  });

  const uploadLogo = useMutation({
    mutationFn: (file: File) => pressingApi.shops.uploadLogo(shopId, file),
    onSuccess: (updated) => {
      setLogoUrl(updated.logoUrl ?? null);
      queryClient.invalidateQueries({ queryKey: ["shop", shopId] });
      if (session) {
        saveAuthSession({ ...session, logoUrl: updated.logoUrl });
      }
      toast.success("Logo mis à jour");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Envoi du logo impossible"),
  });

  const onLogoFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Merci de choisir un fichier image");
      return;
    }
    if (file.size > MAX_LOGO_FILE_BYTES) {
      toast.error("Image trop lourde (5 Mo maximum)");
      return;
    }

    uploadLogo.mutate(file);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    updateShop.mutate({
      name: String(formData.get("name")),
      ownerName: String(formData.get("ownerName")),
      phone: String(formData.get("phone")),
      city: String(formData.get("city")),
      address: String(formData.get("address")),
      email: String(formData.get("email")),
      logoUrl: isPremium ? logoUrl : shop?.logoUrl,
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 pb-20 text-slate-900 sm:space-y-6 lg:pb-0">
      <PageHeader title="Parametres" subtitle="Informations reelles de votre entreprise et abonnement." />

      <Card className="overflow-hidden border-slate-200/80 bg-background shadow-sm">
        <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[1fr_280px]">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-50 p-1.5 text-primary">
                <Store className="h-4 w-4" />
              </div>
              <h3 className="text-base font-black tracking-tight">Entreprise</h3>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Ces informations servent au dashboard, aux recus et a l'identite de votre espace.
            </p>
          </div>

          <div className="rounded-xl border bg-slate-50 p-3 text-sm">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Crown className="h-4 w-4 text-amber-500" />
              {shop?.subscriptionPlan ?? session?.subscriptionPlan ?? "Offre"}
            </div>
            <div className="mt-1 text-xs font-medium text-muted-foreground">
              Etat : {shop?.subscriptionStatus ?? session?.subscriptionStatus ?? "-"}
            </div>
            <div className="mt-1 text-xs font-medium text-muted-foreground">
              Fin essai : {shop?.trialEndsAt ?? session?.trialEndsAt ?? "-"}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              {shop?.subscriptionStatus === "Essai"
                ? `Essai jusqu'au ${shop?.trialEndsAt ?? "-"}`
                : `Fin abonnement ${shop?.subscriptionEndsAt ?? "-"}`}
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-slate-100 p-4 sm:grid-cols-2 sm:p-6">
          <Button asChild variant="outline" className="h-11 justify-start gap-2 bg-background font-semibold">
            <a href="https://wa.me/221762045174?text=Bonjour%20Creativ%20Pressing%2C%20je%20veux%20demander%20une%20mise%20a%20niveau%20de%20mon%20offre." target="_blank" rel="noreferrer">
              <Rocket className="h-4 w-4 text-primary" /> Demander une mise à niveau
            </a>
          </Button>
          <Button asChild variant="outline" className="h-11 justify-start gap-2 bg-background font-semibold">
            <a href="https://wa.me/221762045174?text=Bonjour%20Creativ%20Pressing%2C%20j%27ai%20besoin%20du%20support%20client." target="_blank" rel="noreferrer">
              <Headphones className="h-4 w-4 text-emerald-600" /> Support client WhatsApp
            </a>
          </Button>
        </div>
        <Separator />

        <form onSubmit={handleSave} className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
          <Field icon={Store} name="name" label="Nom commercial" defaultValue={shop?.name} required />
          <Field icon={User} name="ownerName" label="Responsable" defaultValue={shop?.ownerName} required />
          <Field icon={Phone} name="phone" label="Telephone" defaultValue={shop?.phone} required />
          <Field icon={Building2} name="city" label="Ville" defaultValue={shop?.city} required />
          <Field icon={MapPin} name="address" label="Adresse" defaultValue={shop?.address} required className="sm:col-span-2" />
          <Field icon={Mail} name="email" label="Email entreprise" defaultValue={shop?.email} type="email" required className="sm:col-span-2" />

          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs font-bold text-slate-700">Logo de l'application</Label>

            {!isPremium ? (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <Store className="h-6 w-6" />
                </div>
                <p className="text-xs font-medium text-amber-600">
                  L'upload d'un logo personnalisé est réservé à l'offre Premium.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:flex-row">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {logoUrl ? (
                      <img src={resolveMediaUrl(logoUrl) ?? undefined} alt="Aperçu du logo" className="h-full w-full object-cover" />
                    ) : (
                      <Store className="h-6 w-6 text-slate-300" />
                    )}
                  </div>

                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onLogoFileSelected} />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadLogo.isPending}
                      className="h-9 gap-1.5 bg-background font-semibold"
                    >
                      {uploadLogo.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                      {uploadLogo.isPending ? "Envoi..." : "Choisir une image"}
                    </Button>
                    {logoUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setLogoUrl(null)}
                        className="h-9 gap-1.5 bg-background font-semibold text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Retirer
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setLogoMode(logoMode === "url" ? "upload" : "url")}
                      className="h-9 gap-1.5 text-xs font-semibold text-muted-foreground"
                    >
                      <Link2 className="h-3.5 w-3.5" /> {logoMode === "url" ? "Utiliser un fichier" : "Coller une URL"}
                    </Button>
                  </div>
                </div>

                {logoMode === "url" && (
                  <Input
                    value={logoUrl ?? ""}
                    onChange={(event) => setLogoUrl(event.target.value || null)}
                    placeholder="https://..."
                    className="h-11"
                  />
                )}

                <p className="text-[11px] font-medium text-muted-foreground">
                  {logoMode === "upload"
                    ? "Formats image, 5 Mo max — le fichier est envoyé et enregistré immédiatement."
                    : "L'URL est enregistrée avec le reste du formulaire."}
                </p>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 -mx-4 mt-2 border-t bg-background/95 p-4 backdrop-blur sm:static sm:col-span-2 sm:mx-0 sm:flex sm:justify-end sm:bg-transparent sm:p-0 sm:pt-4">
            <Button type="submit" disabled={updateShop.isPending || isLoading} className="h-11 w-full gap-2 font-semibold sm:w-auto">
              <Save className="h-4 w-4" />
              {updateShop.isPending ? "Sauvegarde..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

type FieldProps = {
  icon: typeof Store;
  name: string;
  label: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
  className?: string;
};

function Field({ icon: Icon, name, label, defaultValue, type = "text", required, className }: FieldProps) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={name} className="text-xs font-bold text-slate-700">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input id={name} name={name} type={type} required={required} defaultValue={defaultValue ?? ""} className="h-11 pl-9" />
      </div>
    </div>
  );
}


