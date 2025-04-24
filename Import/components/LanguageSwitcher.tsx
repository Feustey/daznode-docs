"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { locales, localeNames, localeFlags } from "../../i18n.config.base";

interface LanguageSwitcherProps {
  className?: string;
  baseUrl?: string;
}

export default function LanguageSwitcher({
  className = "",
  baseUrl = "",
}: LanguageSwitcherProps) {
  const params = useParams();

  // Déterminer l'URL actuelle
  const getUrlForLocale = (locale: string) => {
    if (baseUrl) {
      return `${baseUrl}/${locale}`;
    }

    // Récupérer les paramètres de l'URL
    const section = params.section;
    const chapter = params.chapter;

    // Construire l'URL avec le nouveau locale
    let url = `/learn/${locale}`;
    if (section && typeof section === "string") {
      url += `/${section}`;
      if (chapter && typeof chapter === "string") {
        url += `/${chapter}`;
      }
    }

    return url;
  };

  // Déterminer le locale actuel
  const getCurrentLocale = () => {
    if (params.locale && typeof params.locale === "string") {
      return params.locale;
    }
    return "fr"; // Locale par défaut
  };

  const currentLocale = getCurrentLocale();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={getUrlForLocale(locale)}
          className={`px-2 py-1 text-sm rounded-md flex items-center ${
            locale === currentLocale
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary"
          }`}
        >
          <span className="mr-1.5">{localeFlags[locale]}</span>
          <span>{localeNames[locale]}</span>
        </Link>
      ))}
    </div>
  );
}
