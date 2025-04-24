"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

// Configurer marked pour utiliser highlight.js
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  gfm: true,
  breaks: true,
});

interface ContentRendererProps {
  content: string;
  className?: string;
}

export default function ContentRenderer({
  content,
  className = "",
}: ContentRendererProps) {
  const [renderedContent, setRenderedContent] = useState("");

  useEffect(() => {
    if (content) {
      // Convertir le markdown en HTML en utilisant marked
      const html = marked(content);
      setRenderedContent(html);
    }
  }, [content]);

  if (!content) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5 mb-4"></div>
      </div>
    );
  }

  return (
    <div
      className={`prose dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
}
