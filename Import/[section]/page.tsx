import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { sections } from "../metadata";

export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}

export default async function LearnSectionPage({
  params,
}: {
  params: { section: string };
}) {
  const locale = await getLocale();
  const section = sections[params.section as keyof typeof sections];

  if (!section) {
    return notFound();
  }

  const { title, description } =
    section.translations[locale as keyof typeof section.translations] ||
    section.translations.en;

  return (
    <PageContainer>
      <div className="space-y-8 py-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl">{description}</p>
        <ul className="mt-8 space-y-4">
          {section.chapters.map(({ slug, translations }) => {
            const chapterTranslation =
              translations[locale as keyof typeof translations] ||
              translations.en;
            return (
              <li key={slug}>
                <Link
                  href={`/learn/${params.section}/${slug}`}
                  className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {chapterTranslation.title}
                    </h2>
                    <p className="text-gray-400">
                      {chapterTranslation.description}
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </PageContainer>
  );
}
