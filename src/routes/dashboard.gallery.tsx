import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload, Trash2, Camera, Calendar, Hash, Eye, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/page-header";
import { initialPhotos, type PhotoItem } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/gallery")({ component: GalleryPage });

function GalleryPage() {
  const [list, setList] = useState<PhotoItem[]>(initialPhotos);
  const [filter, setFilter] = useState<"Tous" | "Avant" | "Après">("Tous");
  const [uploadType, setUploadType] = useState<"Avant" | "Après">("Avant");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = list.filter((p) => filter === "Tous" || p.type === filter);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulation d'une référence de commande aléatoire ou par défaut pour le prototype
    const mockOrderId = `CMD-${Math.floor(1000 + Math.random() * 9000)}`;
    const url = URL.createObjectURL(file);
    
    setList((l) => [
      { 
        id: `p${Date.now()}`, 
        orderId: mockOrderId, 
        type: uploadType, 
        url, 
        date: new Date().toISOString().slice(0, 10) 
      }, 
      ...l
    ]);
    
    toast.success(`Cliché "${uploadType}" enregistré avec succès`);
    e.target.value = "";
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer définitivement cette photo de suivi de linge ?")) {
      setList((l) => l.filter((x) => x.id !== id));
      toast.success("Média supprimé de la fiche de suivi");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 antialiased">
      {/* En-tête de la galerie avec filtres et téléversement groupés */}
      <PageHeader 
        title="Galerie de Suivi" 
        subtitle="Preuves visuelles de l'état du linge avant et après traitement"
        actions={
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60 shadow-sm">
            <input ref={inputRef} type="file" accept="image/*" hidden onChange={onUpload} />
            
            {/* Filtre d'affichage principal */}
            <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <SelectTrigger className="w-[140px] h-9 border-slate-200 bg-background text-xs font-semibold shadow-none">
                <SelectValue placeholder="Filtrer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous" className="text-xs">Toutes les photos</SelectItem>
                <SelectItem value="Avant" className="text-xs">État "Avant"</SelectItem>
                <SelectItem value="Après" className="text-xs">État "Après"</SelectItem>
              </SelectContent>
            </Select>

            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

            {/* Sélecteur de contexte d'upload */}
            <Select value={uploadType} onValueChange={(v) => setUploadType(v as "Avant" | "Après")}>
              <SelectTrigger className="w-[110px] h-9 border-transparent bg-transparent text-xs font-bold text-slate-600 shadow-none focus:ring-0">
                <SelectValue placeholder="Type d'upload" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Avant" className="text-xs font-medium">Uploader : Avant</SelectItem>
                <SelectItem value="Après" className="text-xs font-medium">Uploader : Après</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              size="sm" 
              onClick={() => inputRef.current?.click()} 
              className="font-semibold h-9 px-3 gap-1.5 shadow-sm"
            >
              <Upload className="h-3.5 w-3.5" /> Charger
            </Button>
          </div>
        }
      />

      {/* 📸 Grille multimédia */}
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => {
          const isBefore = p.type === "Avant";

          return (
            <Card key={p.id} className="overflow-hidden border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 bg-background group flex flex-col justify-between">
              
              {/* Conteneur d'image avec superposition dynamique */}
              <div className="aspect-square overflow-hidden bg-slate-900 relative">
                <img 
                  src={p.url} 
                  alt={`Suivi vêtement ${p.orderId}`} 
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  loading="lazy" 
                />
                
                {/* Overlay sombre au survol avec bouton d'action */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <Button 
                    size="icon" 
                    variant="secondary"
                    title="Agrandir l'image" 
                    className="h-9 w-9 rounded-xl backdrop-blur-sm bg-white/90 text-slate-800 hover:bg-white border-0 transition-transform scale-90 group-hover:scale-100 duration-200"
                    onClick={() => window.open(p.url, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    title="Retirer cette photo"
                    className="h-9 w-9 rounded-xl shadow-lg border-0 transition-transform scale-90 group-hover:scale-100 duration-200" 
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Badge contextuel épinglé directement sur l'image pour un look moderne */}
                <Badge 
                  className={`absolute left-2.5 top-2.5 px-2.5 py-0.5 text-[10px] font-black rounded-full border shadow-sm select-none uppercase tracking-wider ${
                    isBefore 
                      ? "bg-amber-500 text-white border-amber-400 hover:bg-amber-500" 
                      : "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-600"
                  }`}
                >
                  {p.type}
                </Badge>
              </div>

              {/* Cartouche d'informations en bas de carte */}
              <div className="p-3 bg-background border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Hash className="h-3 w-3 text-slate-400" />
                    <span>{p.orderId}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{p.date}</span>
                  </div>
                </div>
                
                <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 border border-slate-100">
                  <Camera className="h-3.5 w-3.5" />
                </div>
              </div>

            </Card>
          );
        })}
      </div>

      {/* État vide si aucune photo trouvée */}
      {filtered.length === 0 && (
        <Card className="p-12 text-center text-slate-400 border-dashed border-2 border-slate-200 shadow-none">
          <div className="flex flex-col items-center justify-center gap-2">
            <Images className="h-8 w-8 text-slate-300" />
            <p className="font-medium">Aucun justificatif photo trouvé pour ce filtre</p>
          </div>
        </Card>
      )}
    </div>
  );
}