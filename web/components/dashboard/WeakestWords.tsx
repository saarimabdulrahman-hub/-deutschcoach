import Link from "next/link";

interface WeakWord {
  id: number;
  german: string;
  english: string;
  lapses: number;
}

interface WeakestWordsProps {
  words: WeakWord[];
}

export function WeakestWords({ words }: WeakestWordsProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <h3 className="font-semibold text-neutral-800 mb-3">
        Words to Practice
      </h3>
      {words.length === 0 ? (
        <p className="text-sm text-neutral-400">
          No weak words yet. Keep learning!
        </p>
      ) : (
        <ul className="space-y-2">
          {words.map((w) => (
            <li
              key={w.id}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <span className="font-semibold text-neutral-800">
                  {w.german}
                </span>
                <span className="text-neutral-400 ml-2">{w.english}</span>
              </div>
              <span className="text-xs text-red-500 font-medium">
                {w.lapses} lapse{w.lapses !== 1 ? "s" : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/review"
        className="inline-block mt-4 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
      >
        Practice these &rarr;
      </Link>
    </div>
  );
}
