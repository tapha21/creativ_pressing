import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/pages/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Creativ Pressing - Le CRM des pressings sénégalais" },
      {
        name: "description",
        content:
          "Gérez clients, commandes, dépenses et performance de votre pressing depuis une seule plateforme moderne.",
      },
      {
        property: "og:title",
        content: "Creativ Pressing - CRM pour pressings",
      },
      {
        property: "og:description",
        content: "Le logiciel tout-en-un pour piloter votre pressing au Sénégal.",
      },
    ],
  }),
  component: LandingPage,
});
