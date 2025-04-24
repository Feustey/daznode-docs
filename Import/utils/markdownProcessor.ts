import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import { locales } from "../../i18n.config.base";

// Interface pour les métadonnées du frontmatter
export interface MarkdownMeta {
  title: string;
  order: number;
  section: string;
  language: string;
  relatedContent?: string[];
  description?: string;
  tags?: string[];
  lastUpdated?: string;
}

// Interface pour le contenu Markdown traité
export interface ProcessedMarkdown {
  meta: MarkdownMeta;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "app/learn/content");

// Récupérer tous les fichiers .md dans un répertoire donné
export async function getMarkdownFiles(
  sectionDir: string,
  locale: string
): Promise<string[]> {
  const dir = path.join(CONTENT_DIR, locale, sectionDir);

  try {
    const files = await fs.promises.readdir(dir);
    return files.filter((file) => file.endsWith(".md"));
  } catch (error) {
    console.error(`Erreur en lisant le répertoire ${dir}:`, error);
    return [];
  }
}

// Récupérer toutes les sections disponibles
export async function getSections(locale: string): Promise<string[]> {
  try {
    const dir = path.join(CONTENT_DIR, locale);
    const sections = await fs.promises.readdir(dir);
    return sections.filter(async (section) => {
      const stat = await fs.promises.stat(path.join(dir, section));
      return stat.isDirectory();
    });
  } catch (error) {
    console.error(`Erreur en récupérant les sections pour ${locale}:`, error);
    return [];
  }
}

// Traiter un fichier Markdown spécifique
export async function processMarkdownFile(
  filePath: string
): Promise<ProcessedMarkdown | null> {
  try {
    const fileContents = await fs.promises.readFile(filePath, "utf8");

    // Extraire le frontmatter avec gray-matter
    const { data, content } = matter(fileContents);

    // Validation basique des métadonnées
    if (!data.title || !data.section || !data.language) {
      console.error(`Métadonnées invalides dans ${filePath}`);
      return null;
    }

    // Vérifier que la langue est supportée
    if (!locales.includes(data.language as any)) {
      console.error(`Langue non supportée dans ${filePath}: ${data.language}`);
      return null;
    }

    // Traiter le contenu Markdown en HTML
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(content);

    return {
      meta: data as MarkdownMeta,
      content: processedContent.toString(),
    };
  } catch (error) {
    console.error(`Erreur en traitant le fichier ${filePath}:`, error);
    return null;
  }
}

// Récupérer un chapitre spécifique
export async function getChapter(
  locale: string,
  section: string,
  chapterId: string
): Promise<ProcessedMarkdown | null> {
  const filePath = path.join(CONTENT_DIR, locale, section, `${chapterId}.md`);

  try {
    return await processMarkdownFile(filePath);
  } catch (error) {
    console.error(`Erreur en récupérant le chapitre ${chapterId}:`, error);
    return null;
  }
}

// Obtenir les métadonnées de tous les chapitres d'une section
export async function getChapterMetadata(
  locale: string,
  section: string
): Promise<MarkdownMeta[]> {
  const files = await getMarkdownFiles(section, locale);
  const metadataPromises = files.map(async (file) => {
    const filePath = path.join(CONTENT_DIR, locale, section, file);
    const processed = await processMarkdownFile(filePath);
    return processed?.meta;
  });

  const metadataList = await Promise.all(metadataPromises);
  return metadataList
    .filter((meta): meta is MarkdownMeta => meta !== undefined)
    .sort((a, b) => a.order - b.order);
}

// Obtenir tous les chapitres traduits pour un chapitre spécifique
export async function getAllTranslations(
  section: string,
  chapterId: string
): Promise<Record<string, ProcessedMarkdown | null>> {
  const translationPromises = locales.map(async (locale) => {
    const translation = await getChapter(locale as string, section, chapterId);
    return { locale, translation };
  });

  const translations = await Promise.all(translationPromises);
  return translations.reduce(
    (acc, { locale, translation }) => {
      acc[locale as string] = translation;
      return acc;
    },
    {} as Record<string, ProcessedMarkdown | null>
  );
}
