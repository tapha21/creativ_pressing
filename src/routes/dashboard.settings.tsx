import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, CalendarClock, Crown, Image, Mail, MapPin, Phone, Save, Store, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/dashboard/page-header";
import { getAuthSession, saveAuthSession } from "@/services/auth";
import { pressingApi } from "@/services/pressing-api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({ component: SettingsPage });

function SettingsPage() {
  const queryClient = useQueryClient();
  const session = getAuthSession();
  const shopId = session?.shopId ?? "";
  const isPremium = session?.subscriptionPlan === "Premium";

  const { data: shop, isLoading } = useQuery({
    queryKey: ["shop", shopId],
    queryFn: () => pressingApi.shops.one(shopId),
    enabled: Boolean(shopId),
  });

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
      logoUrl: isPremium ? String(formData.get("logoUrl") ?? "") : shop?.logoUrl,
      subscriptionPlan: shop?.subscriptionPlan,
      subscriptionStatus: shop?.subscriptionStatus,
      trialEndsAt: shop?.trialEndsAt,
      subscriptionEndsAt: shop?.subscriptionEndsAt,
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

        <Separator />

        <form onSubmit={handleSave} className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
          <Field icon={Store} name="name" label="Nom commercial" defaultValue={shop?.name} required />
          <Field icon={User} name="ownerName" label="Responsable" defaultValue={shop?.ownerName} required />
          <Field icon={Phone} name="phone" label="Telephone" defaultValue={shop?.phone} required />
          <Field icon={Building2} name="city" label="Ville" defaultValue={shop?.city} required />
          <Field icon={MapPin} name="address" label="Adresse" defaultValue={shop?.address} required className="sm:col-span-2" />
          <Field icon={Mail} name="email" label="Email entreprise" defaultValue={shop?.email} type="email" required className="sm:col-span-2" />

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="logoUrl" className="text-xs font-bold text-slate-700">Logo de l'application</Label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="logoUrl"
                name="logoUrl"
                defaultValue={shop?.logoUrl ?? ""}
                disabled={!isPremium}
                placeholder={isPremium ? "https://..." : "Disponible avec Premium"}
                className="h-11 pl-9"
              />
            </div>
            {!isPremium && <p className="text-xs font-medium text-amber-600">Le changement de logo est reserve a l'offre Premium.</p>}
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
