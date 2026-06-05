import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload, Trash2 } from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = list.filter((p) => filter === "Tous" || p.type === filter);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setList((l) => [{ id: `p${Date.now()}`, orderId: "CMD-XXXX", type: "Avant", url, date: new Date().toISOString().slice(0,10) }, ...l]);
    toast.success("Photo ajoutée");
    e.target.value = "";
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Galerie photos" subtitle="Photos avant / après lavage"
        actions={<>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={onUpload} />
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Toutes</SelectItem>
              <SelectItem value="Avant">Avant</SelectItem>
              <SelectItem value="Après">Après</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => inputRef.current?.click()}><Upload className="mr-1 h-4 w-4" /> Uploader</Button>
        </>}
      />
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <Card key={p.id} className="overflow-hidden p-0 group relative">
            <div className="aspect-square overflow-hidden bg-muted">
              <img src={p.url} alt={p.type} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
            </div>
            <div className="flex items-center justify-between p-3">
              <div>
                <div className="text-xs font-medium">{p.orderId}</div>
                <div className="text-[10px] text-muted-foreground">{p.date}</div>
              </div>
              <Badge variant={p.type === "Avant" ? "secondary" : "default"}>{p.type}</Badge>
            </div>
            <Button size="icon" variant="destructive" className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100" onClick={() => { setList((l) => l.filter((x) => x.id !== p.id)); toast.success("Supprimée"); }}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}