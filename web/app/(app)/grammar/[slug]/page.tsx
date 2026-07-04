"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { GrammarContent } from "@/components/grammar/GrammarContent";

interface GrammarTopicDetail {
  id: number;
  slug: string;
  title: string;
  level: string;
  content: string | null;
  examples: Record<string, string> | null;
  related_lessons: {
    id: number;
    title: string;
    level: string;
  }[] | null;
}

export default function GrammarDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [topic, setTopic] = useState<GrammarTopicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopic() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<GrammarTopicDetail>(`/grammar/${slug}`);
        setTopic(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load grammar topic"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchTopic();
  }, [slug]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-neutral-200 rounded w-32 mb-4" />
        <div className="h-8 bg-neutral-200 rounded w-64 mb-2" />
        <div className="h-4 bg-neutral-100 rounded w-20 mb-6" />
        <div className="space-y-3">
          <div className="h-4 bg-neutral-100 rounded w-full" />
          <div className="h-4 bg-neutral-100 rounded w-5/6" />
          <div className="h-4 bg-neutral-100 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Link
          href="/grammar"
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Back to Grammar
        </Link>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-12 text-neutral-400">
        Topic not found.
        <br />
        <Link
          href="/grammar"
          className="text-blue-600 hover:text-blue-700 underline mt-2 inline-block"
        >
          Back to Grammar
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/grammar"
        className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700 mb-4"
      >
        &larr; Back to Grammar
      </Link>

      {/* Title and level badge */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">{topic.title}</h1>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          {topic.level}
        </span>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        {topic.content ? (
          <GrammarContent content={topic.content} />
        ) : (
          <div className="text-neutral-400 italic">
            No content available for this topic.
          </div>
        )}
      </div>

      {/* Examples section */}
      {topic.examples && Object.keys(topic.examples).length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Examples
          </h2>
          <div className="space-y-3">
            {Object.entries(topic.examples).map(([key, value]) => (
              <div
                key={key}
                className="bg-neutral-50 border rounded-lg p-4"
              >
                <div className="text-xs text-neutral-400 mb-1 uppercase tracking-wide">
                  {key}
                </div>
                <code className="text-sm text-neutral-800 font-mono block whitespace-pre-wrap">
                  {value}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Lessons section */}
      {topic.related_lessons && topic.related_lessons.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Related Lessons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topic.related_lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/curriculum/${lesson.level.toLowerCase()}/${lesson.id}`}
                className="block p-3 border rounded-lg hover:shadow-sm transition-shadow bg-white"
              >
                <div className="font-medium text-neutral-700 text-sm">
                  {lesson.title}
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {lesson.level}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
