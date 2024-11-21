"use client";

import { Flashcard } from "@/components/Flashcard";
import { useParams, useSearchParams } from "next/navigation";

export default function LearnModePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const mode = params.mode as "collection" | "topic";
  const type = params.type as "new" | "review";

  const id = searchParams.get("id") || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <Flashcard mode={mode} id={id} isRevision={type === "review"} />
    </div>
  );
}
