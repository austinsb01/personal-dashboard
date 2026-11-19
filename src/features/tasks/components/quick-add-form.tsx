"use client";

// Single-field add form. Clears as soon as it is submitted and keeps focus, so
// several to-dos can be typed in a row without waiting on the server.

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TASK_TITLE_MAX_LENGTH } from "@/features/tasks/constants";

export function QuickAddForm({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (title: string) => void;
}) {
  const [title, setTitle] = useState("");
  const trimmedTitle = title.trim();

  // Hands the trimmed title to the parent and clears the field.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmedTitle) return;
    onAdd(trimmedTitle);
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder={placeholder}
        aria-label="New to-do"
        maxLength={TASK_TITLE_MAX_LENGTH}
        autoComplete="off"
        enterKeyHint="done"
        className="h-11 text-base"
      />
      <Button
        type="submit"
        aria-label="Add to-do"
        disabled={!trimmedTitle}
        className="size-11"
      >
        <Plus className="size-5" />
      </Button>
    </form>
  );
}
