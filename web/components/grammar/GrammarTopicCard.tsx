import Link from "next/link";

interface GrammarTopicCardProps {
  topic: {
    id: number;
    slug: string;
    title: string;
    level: string;
  };
}

export function GrammarTopicCard({ topic }: GrammarTopicCardProps) {
  return (
    <Link
      href={`/grammar/${topic.slug}`}
      className="block p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
    >
      <div className="font-semibold text-neutral-800">{topic.title}</div>
      <div className="text-xs text-neutral-400 mt-1">CEFR {topic.level}</div>
    </Link>
  );
}
