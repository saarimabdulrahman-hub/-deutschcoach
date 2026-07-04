"use client";

import { useState } from "react";

interface VocabCardProps {
  german: string;
  english: string;
  example?: string;
  pos?: string;
}

export function VocabCard({ german, english, example, pos }: VocabCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer p-3 border rounded-lg hover:shadow-md transition-shadow bg-white select-none"
    >
      <div className="font-semibold text-lg">{german}</div>
      {pos && (
        <div className="text-xs text-neutral-400 uppercase">{pos}</div>
      )}
      {flipped && (
        <div className="mt-2 pt-2 border-t">
          <div className="text-blue-600">{english}</div>
          {example && (
            <div className="text-sm text-neutral-500 mt-1 italic">
              {example}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
