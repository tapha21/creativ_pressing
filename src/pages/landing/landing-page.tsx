import { useEffect } from "react";

import { isPwaDisplayMode } from "@/services/auth";

import { Footer, Navbar } from "./landing-layout";
import {
  AdvantagesSection,
  FAQ,
  FeaturesSection,
  FinalCTA,
  Hero,
  InstallSection,
  ProblemsSection,
  ProofStrip,
  RolesSection,
} from "./landing-sections";
import { pressingWaterStyles } from "./landing-styles";

export function LandingPage() {
  useEffect(() => {
    if (isPwaDisplayMode() && window.location.pathname === "/") {
      window.location.replace("/demo");
    }
  }, []);

  return (
    <div className="pressing-page antialiased selection:bg-sky-100 selection:text-sky-700">
      <style>{pressingWaterStyles}</style>
      <Navbar />
      <main>
        <Hero />
        <ProofStrip />
        <InstallSection />
        <ProblemsSection />
        <FeaturesSection />
        <RolesSection />
        <AdvantagesSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
