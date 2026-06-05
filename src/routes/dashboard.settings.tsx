import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/dashboard/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <div className="animate-fade-in max-w-3xl">
      <PageHeader title="Paramètres" subtitle="Configurez votre boutique et vos préférences" />
      <Card className="p-6">
        <h3 className="font-semibold">Informations de la boutique</h3>
        <Separator className="my-4" />
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Paramètres enregistrés"); }}>
          <div className="space-y-2"><Label>Nom du pressing</Label><Input defaultValue="Pressing Le Lys" /></div>
          <div className="space-y-2"><Label>Téléphone</Label><Input defaultValue="+221 77 000 00 00" /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Adresse</Label><Input defaultValue="Rue 10, Sacré-Cœur, Dakar" /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" defaultValue="contact@lelys.sn" /></div>
          <div className="space-y-2"><Label>Devise</Label><Input defaultValue="FCFA" /></div>
          <div className="sm:col-span-2"><Button type="submit">Enregistrer</Button></div>
        </form>
      </Card>
      <Card className="mt-6 p-6">
        <h3 className="font-semibold">Notifications</h3>
        <Separator className="my-4" />
        {[
          ["Commandes prêtes", true],
          ["Retards de livraison", true],
          ["Alertes paiement", false],
        ].map(([label, v]) => (
          <div key={String(label)} className="flex items-center justify-between py-3">
            <span className="text-sm">{label as string}</span>
            <Switch defaultChecked={v as boolean} />
          </div>
        ))}
      </Card>
    </div>
  );
}