import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Store, Bell, MapPin, Phone, Mail, Coins, Save, ShieldAlert, MessageSquare, Landmark } from "lucide-react";
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
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulation d'une sauvegarde réseau rapide
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Configurations de la boutique enregistrées");
    }, 800);
  };

  return (
    <div className="animate-fade-in max-w-3xl space-y-6 text-slate-900 antialiased">
      {/* En-tête de page */}
      <PageHeader 
        title="Paramètres Généraux" 
        subtitle="Pilotez les préférences de votre établissement et les canaux d'alerte" 
      />

      {/* 🏬 Fiche Profil de l'Établissement */}
      <Card className="p-6 border-slate-200/80 shadow-sm bg-background">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-primary">
            <Store className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-900 tracking-tight">Fiche d'identité du pressing</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 pl-8">Ces coordonnées figureront sur les reçus d'encaissement de vos clients.</p>
        
        <Separator className="my-4" />
        
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSave}>
          
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Nom commercial</Label>
            <Input defaultValue="Pressing Le Lys" className="h-10 border-slate-200" />
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Ligne téléphonique directe</Label>
            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input defaultValue="+221 77 000 00 00" className="pl-9 h-10 border-slate-200" />
            </div>
          </div>
          
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-semibold text-slate-700">Adresse géographique</Label>
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input defaultValue="Rue 10, Sacré-Cœur, Dakar" className="pl-9 h-10 border-slate-200" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Adresse e-mail de contact</Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input type="email" defaultValue="contact@lelys.sn" className="pl-9 h-10 border-slate-200" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Devise de compte</Label>
            <div className="relative group">
              <Coins className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input defaultValue="FCFA" disabled className="pl-9 h-10 bg-slate-50/80 border-slate-200 text-slate-500 font-bold cursor-not-allowed" />
            </div>
          </div>
          
          <div className="sm:col-span-2 flex justify-end pt-2 border-t border-slate-100 mt-2">
            <Button type="submit" disabled={isSaving} className="font-semibold h-10 gap-1.5 px-5 shadow-md shadow-primary/10">
              <Save className="h-4 w-4" />
              {isSaving ? "Sauvegarde..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </Card>

      {/* 🔔 Bloc Notifications Automatisées */}
      <Card className="p-6 border-slate-200/80 shadow-sm bg-background">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <Bell className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-900 tracking-tight">Automatisation & Alertes système</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 pl-8">Configurez les événements qui déclenchent des rappels en temps réel.</p>
        
        <Separator className="my-4" />
        
        <div className="divide-y divide-slate-100">
          
          {/* Ligne 1 : Commandes prêtes */}
          <div className="flex items-start justify-between py-3.5 gap-4">
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-500 mt-0.5">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-bold text-slate-800 cursor-pointer" htmlFor="notify-ready">Alertes clients (Prêt)</label>
                <p className="text-xs text-slate-400 font-medium">Envoyer automatiquement une notification lorsque le linge est lavé, repassé et disponible.</p>
              </div>
            </div>
            <Switch id="notify-ready" defaultChecked />
          </div>

          {/* Ligne 2 : Retards de livraison */}
          <div className="flex items-start justify-between py-3.5 gap-4">
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-500 mt-0.5">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-bold text-slate-800 cursor-pointer" htmlFor="notify-delay">Suivi des retards de traitement</label>
                <p className="text-xs text-slate-400 font-medium">Notifier le gérant sur le tableau de bord si une commande dépasse la date de retrait fixée.</p>
              </div>
            </div>
            <Switch id="notify-delay" defaultChecked />
          </div>

          {/* Ligne 3 : Alertes paiements */}
          <div className="flex items-start justify-between py-3.5 gap-4">
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-500 mt-0.5">
                <Landmark className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-bold text-slate-800 cursor-pointer" htmlFor="notify-pay">Relances des impayés</label>
                <p className="text-xs text-slate-400 font-medium">Signaler de façon persistante les vêtements récupérés mais non soldés en caisse.</p>
              </div>
            </div>
            <Switch id="notify-pay" defaultChecked={false} />
          </div>

        </div>
      </Card>
    </div>
  );
}