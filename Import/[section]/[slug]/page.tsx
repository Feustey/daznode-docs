import path from "path";
import fs from "fs/promises";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import ContentRenderer from "../../components/ContentRenderer";
import { sections } from "../../metadata";

export function generateStaticParams() {
  return Object.entries(sections).flatMap(([section, { chapters }]) =>
    chapters.map((chapter) => ({
      section,
      slug: chapter.slug,
    }))
  );
}

export default async function LearnChapterPage({
  params,
}: {
  params: { section: string; slug: string };
}) {
  const locale = await getLocale();
  const section = sections[params.section as keyof typeof sections];

  if (!section) {
    return notFound();
  }

  const chapter = section.chapters.find((c) => c.slug === params.slug);
  if (!chapter) {
    return notFound();
  }

  const chapterTranslation =
    chapter.translations[locale as keyof typeof chapter.translations] ||
    chapter.translations.en;

  const filePath = path.join(
    process.cwd(),
    "app",
    "learn",
    "content",
    locale,
    params.section,
    `${params.slug}.md`
  );

  let content: string;
  try {
    content = await fs.readFile(filePath, "utf8");
  } catch {
    // Si le fichier n'existe pas dans la locale actuelle, essayer en anglais
    if (locale !== "en") {
      const enFilePath = path.join(
        process.cwd(),
        "app",
        "learn",
        "content",
        "en",
        params.section,
        `${params.slug}.md`
      );
      try {
        content = await fs.readFile(enFilePath, "utf8");
      } catch {
        return notFound();
      }
    } else {
      return notFound();
    }
  }

  return (
    <PageContainer>
      <div className="py-12">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent">
          {chapterTranslation.title}
        </h1>
        <ContentRenderer content={content} />
      </div>
    </PageContainer>
  );
}
