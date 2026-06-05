import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Bell, Menu, Search, X, Command } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — Creativ Pressing" }] }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const [open, setOpen] = useState(false);

  // Petite astuce UX : Fermer automatiquement le menu mobile si on agrandit l'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50/50 text-slate-900 antialiased">
      
      {/* 🖥️ Sidebar version Desktop */}
      <aside className="hidden lg:block border-r border-slate-200/80 bg-card">
        <DashboardSidebar />
      </aside>

      {/* 📱 Sidebar version Mobile (Avec transition fluide de glissement) */}
      <div 
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop / Fond sombre cliquable */}
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-all" 
          onClick={() => setOpen(false)} 
        />
        
        {/* Conteneur de la sidebar glissante */}
        <div 
          className={`absolute inset-y-0 left-0 w-72 bg-card transform transition-transform duration-300 ease-out shadow-2xl ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <DashboardSidebar onNavigate={() => setOpen(false)} />
        </div>
      </div>

      {/* 🚀 Zone principale de contenu */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* ─── Barre supérieure (Header) ─── */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-background px-4 lg:px-8 shadow-sm shadow-slate-100/40">
          
          {/* Côté gauche : Bouton Menu (Mobile) & Recherche (Desktop) */}
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden h-9 w-9 text-slate-600 hover:bg-slate-100 transition-colors" 
              onClick={() => setOpen(!open)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Barre de recherche intelligente */}
            <div className="relative hidden sm:block w-full group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Rechercher une commande, un client (Ex: Ndiaye)..." 
                className="pl-9 pr-12 h-10 w-full bg-slate-50 border-slate-200 focus-visible:bg-background focus-visible:ring-primary/20 transition-all text-sm rounded-lg" 
              />
              {/* Badge de raccourci clavier interactif */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-slate-200 bg-background text-[10px] font-medium text-slate-400 shadow-sm">
                <Command className="h-2.5 w-2.5" />
                <span>K</span>
              </div>
            </div>
          </div>

          {/* Côté droit : Notifications & Profil Utilisateur */}
          <div className="flex items-center gap-4 pl-4">
            
            {/* Bouton de notifications avec badge animé */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-all"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-background animate-pulse" />
            </Button>

            {/* Séparateur vertical discret */}
            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />

            {/* Bloc Profil Utilisateur */}
            <div className="flex items-center gap-3 group cursor-pointer select-none">
              <div className="hidden text-right sm:block transition-transform duration-200 group-hover:translate-x-[-2px]">
                <div className="text-sm font-semibold text-slate-800 leading-tight">Ousmane Diop</div>
                <div className="text-xs text-muted-foreground font-medium">Propriétaire</div>
              </div>
              
              {/* Avatar stylisé */}
              <div 
                className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white shadow-md shadow-blue-600/10 transition-transform duration-200 group-hover:scale-105" 
                style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}
              >
                OD
              </div>
            </div>

          </div>
        </header>

        {/* ─── Contenu de la page courante ─── */}
        <main className="flex-1 overflow-auto bg-slate-50/40 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}