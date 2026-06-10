import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Calendar, Camera, Eye, Hash, Images, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/page-header";
import { pressingApi } from "@/services/pressing-api";
import type { PhotoItem } from "@/services/types";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/gallery")({ component: GalleryPage });

function GalleryPage() {
  const queryClient = useQueryClient();
  const { data: list = [], isLoading, isError } = useQuery({
    queryKey: ["photos"],
    queryFn: pressingApi.photos.list,
  });
  const [filter, setFilter] = useState<"Tous" | "Avant" | "Après">("Tous");
  const [uploadType, setUploadType] = useState<"Avant" | "Après">("Avant");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = list.filter((photo) => filter === "Tous" || photo.type === filter);

  const uploadPhoto = useMutation({
    mutationFn: pressingApi.photos.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      toast.success("Photo enregistrée");
    },
    onError: () => toast.error("Impossible d'envoyer la photo"),
  });

  const deletePhoto = useMutation({
    mutationFn: pressingApi.photos.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      toast.success("Photo supprimée");
    },
    onError: () => toast.error("Impossible de supprimer cette photo"),
  });

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const payload = new FormData();
    payload.append("file", file);
    payload.append("type", uploadType);
    uploadPhoto.mutate(payload);
    event.target.value = "";
  };

  const emptyMessage = isLoading
    ? "Chargement des photos..."
    : isError
      ? "Connectez votre API pour afficher la galerie."
      : "Aucun justificatif photo trouvé pour ce filtre.";

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 antialiased">
      <PageHeader
        title="Galerie de Suivi"
        subtitle="Preuves visuelles de l'état du linge avant et après traitement"
        actions={
          <div className="flex w-full flex-wrap items-center gap-2.5 rounded-xl border border-slate-200/60 bg-slate-50 p-1.5 shadow-sm sm:w-auto">
            <input ref={inputRef} type="file" accept="image/*" hidden onChange={onUpload} />
            <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
              <SelectTrigger className="h-9 flex-1 border-slate-200 bg-background text-xs font-semibold sm:w-[150px] sm:flex-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Toutes les photos</SelectItem>
                <SelectItem value="Avant">Avant</SelectItem>
                <SelectItem value="Après">Après</SelectItem>
              </SelectContent>
            </Select>
            <Select value={uploadType} onValueChange={(value) => setUploadType(value as "Avant" | "Après")}>
              <SelectTrigger className="h-9 flex-1 bg-background text-xs font-semibold sm:w-[120px] sm:flex-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Avant">Avant</SelectItem>
                <SelectItem value="Après">Après</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => inputRef.current?.click()} disabled={uploadPhoto.isPending} className="h-9 gap-1.5 font-semibold">
              <Upload className="h-3.5 w-3.5" /> Charger
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {filtered.map((photo: PhotoItem) => {
          const isBefore = photo.type === "Avant";
          return (
            <Card key={photo.id} className="group flex flex-col justify-between overflow-hidden border-slate-200/80 bg-background shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="relative aspect-square overflow-hidden bg-slate-900">
                <img src={photo.url} alt={`Suivi vêtement ${photo.orderId}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-950/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Button size="icon" variant="secondary" className="h-9 w-9 rounded-xl bg-white/90" onClick={() => window.open(photo.url, "_blank")}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-9 w-9 rounded-xl" onClick={() => deletePhoto.mutate(photo.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Badge className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white ${isBefore ? "bg-amber-500" : "bg-emerald-600"}`}>
                  {photo.type}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-background p-3">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                    <Hash className="h-3 w-3 shrink-0 text-slate-400" />
                    <span className="truncate">{photo.orderId}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                    <Calendar className="h-3 w-3" />
                    <span>{photo.date}</span>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-1.5 text-slate-400">
                  <Camera className="h-3.5 w-3.5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {(filtered.length === 0 || isLoading || isError) && (
        <Card className="border-2 border-dashed border-slate-200 p-12 text-center text-slate-400 shadow-none">
          <Images className="mx-auto mb-2 h-8 w-8 text-slate-300" />
          <p className="font-medium">{emptyMessage}</p>
        </Card>
      )}
    </div>
  );
}
