"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// ── Sentence-level speech — for lesson content ───────────────────────

interface SentenceSpeechState {
  isPlaying: boolean;
  isPaused: boolean;
  activeIndex: number;
}

export function useSentenceSpeech() {
  const [state, setState] = useState<SentenceSpeechState>({
    isPlaying: false,
    isPaused: false,
    activeIndex: -1,
  });

  const sentencesRef = useRef<string[]>([]);
  const langRef = useRef("de-DE");
  const currentIndexRef = useRef(0);
  const pausedRef = useRef(false);
  const stoppedRef = useRef(false);

  const speakNext = useCallback(() => {
    if (stoppedRef.current) return;
    if (pausedRef.current) return;

    const idx = currentIndexRef.current;
    const sentences = sentencesRef.current;

    if (idx >= sentences.length) {
      // Done — reset
      setState({ isPlaying: false, isPaused: false, activeIndex: -1 });
      currentIndexRef.current = 0;
      return;
    }

    setState({ isPlaying: true, isPaused: false, activeIndex: idx });

    const utterance = new SpeechSynthesisUtterance(sentences[idx]);
    utterance.lang = langRef.current;
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      currentIndexRef.current += 1;
      // Small pause between sentences for learners
      setTimeout(() => speakNext(), 200);
    };

    utterance.onerror = (e) => {
      // Ignore "interrupted" errors — they happen on pause/stop
      if (e.error !== "interrupted" && e.error !== "canceled") {
        setState({ isPlaying: false, isPaused: false, activeIndex: -1 });
      }
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const speakSentences = useCallback(
    (sentences: string[], lang: string = "de-DE") => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();
      sentencesRef.current = sentences.filter((s) => s.trim().length > 0);
      langRef.current = lang;
      currentIndexRef.current = 0;
      pausedRef.current = false;
      stoppedRef.current = false;
      speakNext();
    },
    [speakNext]
  );

  const pause = useCallback(() => {
    pausedRef.current = true;
    window.speechSynthesis.cancel(); // Stops current utterance
    setState((s) => ({ ...s, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
    stoppedRef.current = false;
    setState((s) => ({ ...s, isPaused: false }));
    // Resume from current index (the one we were on when paused)
    setTimeout(() => speakNext(), 50);
  }, [speakNext]);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    pausedRef.current = false;
    window.speechSynthesis.cancel();
    currentIndexRef.current = 0;
    setState({ isPlaying: false, isPaused: false, activeIndex: -1 });
  }, []);

  const replaySentence = useCallback(
    (index: number) => {
      if (index < 0 || index >= sentencesRef.current.length) return;
      stoppedRef.current = false;
      pausedRef.current = false;
      window.speechSynthesis.cancel();
      currentIndexRef.current = index;
      setTimeout(() => speakNext(), 50);
    },
    [speakNext]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      window.speechSynthesis.cancel();
    };
  }, []);

  return {
    ...state,
    speakSentences,
    pause,
    resume,
    stop,
    replaySentence,
    totalSentences: sentencesRef.current.length,
  };
}

// ── Word/phrase-level speech — for vocab cards, quick reads ──────────

export function useWordSpeech() {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text: string, lang: string = "de-DE") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak, speaking };
}

// ── Utility: split text into speakable sentences ─────────────────────

export function splitSentences(text: string): string[] {
  if (!text) return [];
  // Split on sentence-ending punctuation followed by space or end-of-string.
  // Handles: . ! ? ... followed by space/capital/newline
  const raw = text
    .replace(/\n+/g, ". ") // Newlines become sentence breaks
    .split(/(?<=[.!?])\s+(?=[A-ZÄÖÜA-Z])/g);
  return raw
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
