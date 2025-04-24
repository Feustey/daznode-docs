import { Metadata } from "next";

export const sections = {
  basics: {
    translations: {
      fr: {
        title: "Les bases",
        description:
          "Découvrez les concepts fondamentaux de Daznode et du Lightning Network",
      },
      en: {
        title: "Basics",
        description:
          "Learn the fundamental concepts of Daznode and Lightning Network",
      },
      es: {
        title: "Conceptos básicos",
        description:
          "Descubra los conceptos fundamentales de Daznode y Lightning Network",
      },
      de: {
        title: "Grundlagen",
        description:
          "Lernen Sie die grundlegenden Konzepte von Daznode und Lightning Network",
      },
    },
    chapters: [
      {
        slug: "introduction",
        translations: {
          fr: {
            title: "Introduction à Daznode",
            description:
              "Présentation générale de la plateforme et de ses fonctionnalités",
          },
          en: {
            title: "Introduction to Daznode",
            description: "General overview of the platform and its features",
          },
          es: {
            title: "Introducción a Daznode",
            description:
              "Descripción general de la plataforma y sus características",
          },
          de: {
            title: "Einführung in Daznode",
            description:
              "Allgemeiner Überblick über die Plattform und ihre Funktionen",
          },
        },
      },
    ],
  },
  channels: {
    translations: {
      fr: {
        title: "Canaux de paiement",
        description: "Gérez vos canaux Lightning et optimisez vos connexions",
      },
      en: {
        title: "Payment Channels",
        description:
          "Manage your Lightning channels and optimize your connections",
      },
      es: {
        title: "Canales de pago",
        description: "Gestione sus canales Lightning y optimice sus conexiones",
      },
      de: {
        title: "Zahlungskanäle",
        description:
          "Verwalten Sie Ihre Lightning-Kanäle und optimieren Sie Ihre Verbindungen",
      },
    },
    chapters: [
      {
        slug: "opening-channels",
        translations: {
          fr: {
            title: "Ouvrir des canaux",
            description: "Guide pour ouvrir vos premiers canaux Lightning",
          },
          en: {
            title: "Opening channels",
            description: "Guide to opening your first Lightning channels",
          },
          es: {
            title: "Abrir canales",
            description: "Guía para abrir sus primeros canales Lightning",
          },
          de: {
            title: "Kanäle öffnen",
            description: "Anleitung zum Öffnen Ihrer ersten Lightning-Kanäle",
          },
        },
      },
    ],
  },
  lightning: {
    translations: {
      fr: {
        title: "Lightning Network",
        description: "Tout sur le Lightning Network et son fonctionnement",
      },
      en: {
        title: "Lightning Network",
        description: "All about the Lightning Network and how it works",
      },
      es: {
        title: "Lightning Network",
        description: "Todo sobre Lightning Network y cómo funciona",
      },
      de: {
        title: "Lightning Network",
        description: "Alles über das Lightning Network und wie es funktioniert",
      },
    },
    chapters: [
      {
        slug: "getting-started",
        translations: {
          fr: {
            title: "Démarrer avec Lightning",
            description: "Guide de démarrage avec le Lightning Network",
          },
          en: {
            title: "Getting Started with Lightning",
            description: "Getting started guide with Lightning Network",
          },
          es: {
            title: "Empezar con Lightning",
            description: "Guía de inicio con Lightning Network",
          },
          de: {
            title: "Erste Schritte mit Lightning",
            description: "Erste Schritte mit dem Lightning Network",
          },
        },
      },
    ],
  },
};

export const metadata: Metadata = {
  title: "Centre d'apprentissage | Daznode",
  description:
    "Guides et tutoriels pour maîtriser Daznode et le Lightning Network",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US", "es_ES", "de_DE"],
  },
};
