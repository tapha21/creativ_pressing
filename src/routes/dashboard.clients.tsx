import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, User, Phone, MapPin, Building2, ShoppingBag, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { initialClients, type Client } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/clients")({ component: ClientsPage });

function ClientsPage() {
  const [list, setList] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  // Recherche insensible à la casse et plus globale
  const filtered = useMemo(
    () => list.filter((c) => `${c.name} ${c.phone} ${c.city} ${c.address}`.toLowerCase().includes(search.toLowerCase())),
    [list, search]
  );

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name")), 
      phone: String(fd.get("phone")),
      address: String(fd.get("address")), 
      city: String(fd.get("city")),
    };

    if (editing) {
      setList((l) => l.map((c) => (c.id === editing.id ? { ...c, ...data } : c)));
      toast.success("Fiche client mise à jour avec succès");
    } else {
      setList((l) => [{ 
        id: `c${Date.now()}`, 
        ...data, 
        createdAt: new Date().toISOString().slice(0, 10), 
        totalOrders: 0 
      }, ...l]);
      toast.success("Nouveau client enregistré");
    }
    setOpen(false); 
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    // Demande de confirmation rapide native (évite les erreurs de manipulation)
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ? Toutes ses données seront effacées.")) {
      setList((l) => l.filter((x) => x.id !== id));
      toast.success("Client supprimé du système");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 antialiased">
      <PageHeader
        title="Clients"
        subtitle={`${list.length} fiches clients actives`}
        actions={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(null)} className="shadow-md shadow-primary/10 gap-1.5 font-semibold h-10">
                <Plus className="h-4 w-4" /> Nouveau client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-slate-200">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {editing ? "Modifier la fiche client" : "Ajouter un nouveau client"}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Renseignez les coordonnées de votre client pour ses dépôts et facturations.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={onSave} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Nom complet</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input id="name" name="name" required defaultValue={editing?.name ?? ""} placeholder="Ex: Aminata Ndiaye" className="pl-9 h-10 border-slate-200" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">Numéro de téléphone</Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input id="phone" name="phone" type="tel" required defaultValue={editing?.phone ?? ""} placeholder="Ex: +221 77 000 00 00" className="pl-9 h-10 border-slate-200" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 space-y-1.5">
                    <Label htmlFor="city" className="text-xs font-semibold text-slate-700">Ville</Label>
                    <div className="relative group">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input id="city" name="city" required defaultValue={editing?.city ?? ""} placeholder="Dakar" className="pl-9 h-10 border-slate-200" />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label htmlFor="address" className="text-xs font-semibold text-slate-700">Adresse quartier</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input id="address" name="address" required defaultValue={editing?.address ?? ""} placeholder="Ex: Mermoz, Rue G" className="pl-9 h-10 border-slate-200" />
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-4 border-t border-slate-100 gap-2 sm:gap-0">
                  <Button type="submit" className="w-full sm:w-auto font-semibold">
                    {editing ? "Enregistrer les modifications" : "Créer le compte"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="border-slate-200/80 shadow-sm overflow-hidden bg-background">
        {/* Barre d'outils supérieure */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-sm group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Rechercher par nom, téléphone, quartier..." 
              className="pl-9 h-10 bg-background border-slate-200 shadow-sm focus-visible:ring-primary/20 text-sm" 
            />
          </div>
        </div>

        {/* Tableau des clients */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-medium text-xs uppercase tracking-wider">
                <th className="py-3 px-6 text-left font-semibold">Client</th>
                <th className="py-3 px-6 text-left font-semibold">Téléphone</th>
                <th className="py-3 px-6 text-left font-semibold">Localisation</th>
                <th className="py-3 px-6 text-center font-semibold">Commandes</th>
                <th className="py-3 px-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors group">
                  {/* Nom & Badge Avatar */}
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-bold text-xs uppercase group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {c.name.slice(0, 2)}
                      </div>
                      <span className="font-semibold text-slate-900">{c.name}</span>
                    </div>
                  </td>

                  {/* Téléphone */}
                  <td className="py-3.5 px-6 whitespace-nowrap text-slate-600 font-medium tracking-tight">
                    {c.phone}
                  </td>

                  {/* Ville & Adresse */}
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-slate-700">
                      <span className="font-medium text-slate-900">{c.city}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 text-xs">{c.address}</span>
                    </div>
                  </td>

                  {/* Nombre de commandes (Stylisé sous forme de petit badge) */}
                  <td className="py-3.5 px-6 whitespace-nowrap text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <ShoppingBag className="h-3 w-3" />
                      {c.totalOrders}
                    </span>
                  </td>

                  {/* Actions de ligne */}
                  <td className="py-3.5 px-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        title="Modifier le client"
                        className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => { setEditing(c); setOpen(true); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        title="Supprimer le client"
                        className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="h-6 w-6 text-slate-300" />
                      <span>Aucun client ne correspond à votre recherche</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}