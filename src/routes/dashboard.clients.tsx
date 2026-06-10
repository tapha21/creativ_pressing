import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Building2, MapPin, Pencil, Phone, Plus, Search, ShoppingBag, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { pressingApi } from "@/services/pressing-api";
import type { Client } from "@/services/types";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/clients")({ component: ClientsPage });

type ClientPayload = Omit<Client, "id" | "createdAt" | "totalOrders">;

function ClientsPage() {
  const queryClient = useQueryClient();
  const { data: list = [], isLoading, isError } = useQuery({
    queryKey: ["clients"],
    queryFn: pressingApi.clients.list,
  });
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const filtered = useMemo(
    () => list.filter((c) => `${c.name} ${c.phone} ${c.city} ${c.address}`.toLowerCase().includes(search.toLowerCase())),
    [list, search],
  );

  const saveClient = useMutation({
    mutationFn: (payload: { id?: string; data: ClientPayload }) =>
      payload.id ? pressingApi.clients.update(payload.id, payload.data) : pressingApi.clients.create(payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success(editing ? "Fiche client mise à jour" : "Nouveau client enregistré");
      setOpen(false);
      setEditing(null);
    },
    onError: () => toast.error("Impossible d'enregistrer le client"),
  });

  const deleteClient = useMutation({
    mutationFn: pressingApi.clients.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client supprimé");
    },
    onError: () => toast.error("Impossible de supprimer ce client"),
  });

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: String(formData.get("name")),
      phone: String(formData.get("phone")),
      address: String(formData.get("address")),
      city: String(formData.get("city")),
    };

    saveClient.mutate({ id: editing?.id, data });
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer définitivement ce client ?")) {
      deleteClient.mutate(id);
    }
  };

  const emptyMessage = isLoading
    ? "Chargement des clients..."
    : isError
      ? "Connectez votre API pour afficher les clients."
      : "Aucun client ne correspond à votre recherche.";

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 antialiased">
      <PageHeader
        title="Clients"
        subtitle={`${list.length} fiches clients actives`}
        actions={
          <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(null)} className="h-10 gap-1.5 font-semibold shadow-md shadow-primary/10">
                <Plus className="h-4 w-4" /> Nouveau client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[92vh] overflow-y-auto border-slate-200 sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {editing ? "Modifier la fiche client" : "Ajouter un nouveau client"}
                </DialogTitle>
                <DialogDescription>Renseignez les coordonnées du client pour ses dépôts et facturations.</DialogDescription>
              </DialogHeader>

              <form onSubmit={onSave} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input id="name" name="name" required defaultValue={editing?.name ?? ""} placeholder="Nom du client" className="h-10 pl-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input id="phone" name="phone" type="tel" required defaultValue={editing?.phone ?? ""} placeholder="+221 ..." className="h-10 pl-9" />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">Ville</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input id="city" name="city" required defaultValue={editing?.city ?? ""} placeholder="Ville" className="h-10 pl-9" />
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input id="address" name="address" required defaultValue={editing?.address ?? ""} placeholder="Quartier, rue..." className="h-10 pl-9" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={saveClient.isPending} className="w-full sm:w-auto">
                    {editing ? "Enregistrer" : "Créer le client"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="overflow-hidden border-slate-200/80 bg-background shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 p-4 sm:p-5">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un client..." className="h-10 pl-9" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 text-left font-semibold sm:px-6">Client</th>
                <th className="px-4 py-3 text-left font-semibold sm:px-6">Téléphone</th>
                <th className="px-4 py-3 text-left font-semibold sm:px-6">Localisation</th>
                <th className="px-4 py-3 text-center font-semibold sm:px-6">Commandes</th>
                <th className="px-4 py-3 text-right font-semibold sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((client) => (
                <tr key={client.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-4 py-3.5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold uppercase text-slate-700">
                        {client.name.slice(0, 2)}
                      </div>
                      <span className="font-semibold text-slate-900">{client.name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 font-medium text-slate-600 sm:px-6">{client.phone}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 sm:px-6">
                    <span className="font-medium text-slate-900">{client.city}</span>
                    <span className="px-1.5 text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{client.address}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-center sm:px-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <ShoppingBag className="h-3 w-3" />
                      {client.totalOrders}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right sm:px-6">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(client); setOpen(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-destructive" onClick={() => handleDelete(client.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {(filtered.length === 0 || isLoading || isError) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center font-medium text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="h-6 w-6 text-slate-300" />
                      <span>{emptyMessage}</span>
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
