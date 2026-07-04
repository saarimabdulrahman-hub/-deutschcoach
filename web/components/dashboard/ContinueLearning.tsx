import Link from "next/link";

interface ContinueLesson {
  id: number;
  title: string;
  level: string;
  unit: number;
  progress_pct: number;
}

interface ContinueLearningProps {
  lesson: ContinueLesson;
}

export function ContinueLearning({ lesson }: ContinueLearningProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500 font-medium">Continue Learning</p>
          <h3 className="text-lg font-semibold mt-1">{lesson.title}</h3>
          <span className="inline-block mt-1 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            {lesson.level}
          </span>
        </div>
        <Link
          href={`/curriculum/${lesson.level.toLowerCase()}/${lesson.id}`}
          className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors"
        >
          Resume &rarr;
        </Link>
      </div>
      <div className="mt-4">
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${lesson.progress_pct}%` }}
          />
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          {lesson.progress_pct}% complete
        </p>
      </div>
    </div>
  );
}
