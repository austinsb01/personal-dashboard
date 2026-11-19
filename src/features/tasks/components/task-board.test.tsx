// Behavior tests for the to-do board: day selection, carry-over, and the
// optimistic add, toggle, and delete flows against mocked server actions.

import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  createTaskAction,
  deleteTaskAction,
  toggleTaskAction,
} from "@/features/tasks/actions";
import { TaskBoard } from "./task-board";

vi.mock("@/features/tasks/actions", () => ({
  createTaskAction: vi.fn(),
  toggleTaskAction: vi.fn(),
  deleteTaskAction: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const TODAY = "2026-11-19";

const TASKS = [
  { id: "t-old-open", title: "Renew passport", day: "2026-11-10", isCompleted: false },
  { id: "t-old-done", title: "Call the bank", day: "2026-11-10", isCompleted: true },
  { id: "t-today", title: "Buy groceries", day: TODAY, isCompleted: false },
];

const NEVER_SETTLES = new Promise<never>(() => {});

function renderBoard() {
  render(<TaskBoard tasks={TASKS} today={TODAY} month="2026-11-01" initialDay={TODAY} />);
  return userEvent.setup();
}

function dayPanel() {
  return within(screen.getByRole("region", { name: "Selected day" }));
}

beforeEach(() => {
  vi.mocked(createTaskAction).mockReset().mockResolvedValue({ ok: true });
  vi.mocked(toggleTaskAction).mockReset().mockResolvedValue({ ok: true });
  vi.mocked(deleteTaskAction).mockReset().mockResolvedValue({ ok: true });
});

describe("TaskBoard", () => {
  it("shows the month and today's list, including carried-over to-dos", () => {
    renderBoard();
    expect(screen.getByRole("heading", { name: "November 2026" })).toBeInTheDocument();
    expect(dayPanel().getByText("Buy groceries")).toBeInTheDocument();
    expect(dayPanel().getByText("Renew passport")).toBeInTheDocument();
    expect(dayPanel().queryByText("Call the bank")).not.toBeInTheDocument();
    expect(dayPanel().getByText("0 of 2 done")).toBeInTheDocument();
  });

  it("shows what was done on a past day when that day is picked", async () => {
    const user = renderBoard();
    await user.click(screen.getByRole("button", { name: /Tuesday, November 10/ }));
    expect(dayPanel().getByRole("heading", { name: "Tuesday, November 10" })).toBeInTheDocument();
    expect(dayPanel().getByText("Call the bank")).toBeInTheDocument();
    expect(dayPanel().queryByText("Buy groceries")).not.toBeInTheDocument();
    expect(dayPanel().getByText("1 of 1 done")).toBeInTheDocument();
  });

  it("adds a to-do to the selected day and shows it right away", async () => {
    vi.mocked(createTaskAction).mockReturnValue(NEVER_SETTLES);
    const user = renderBoard();
    await user.click(screen.getByRole("button", { name: /Friday, November 20/ }));
    const input = dayPanel().getByRole("textbox", { name: "New to-do" });
    await user.type(input, "Book flights{Enter}");
    expect(createTaskAction).toHaveBeenCalledWith({ title: "Book flights", day: "2026-11-20" });
    expect(dayPanel().getByText("Book flights")).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("ignores a blank to-do", async () => {
    const user = renderBoard();
    await user.type(dayPanel().getByRole("textbox", { name: "New to-do" }), "   {Enter}");
    expect(createTaskAction).not.toHaveBeenCalled();
  });

  it("checks off a carried-over to-do onto today", async () => {
    vi.mocked(toggleTaskAction).mockReturnValue(NEVER_SETTLES);
    const user = renderBoard();
    await user.click(dayPanel().getByRole("button", { name: "Renew passport" }));
    expect(toggleTaskAction).toHaveBeenCalledWith({
      id: "t-old-open",
      isCompleted: true,
      day: TODAY,
    });
    expect(dayPanel().getByText("1 of 2 done")).toBeInTheDocument();
  });

  it("deletes a to-do", async () => {
    vi.mocked(deleteTaskAction).mockReturnValue(NEVER_SETTLES);
    const user = renderBoard();
    await user.click(dayPanel().getByRole("button", { name: "Delete Buy groceries" }));
    expect(deleteTaskAction).toHaveBeenCalledWith("t-today");
    expect(dayPanel().queryByText("Buy groceries")).not.toBeInTheDocument();
  });

  it("shows the error when a change fails", async () => {
    vi.mocked(toggleTaskAction).mockResolvedValue({ ok: false, error: "Could not update." });
    const user = renderBoard();
    await user.click(dayPanel().getByRole("button", { name: "Buy groceries" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not update.");
  });

  it("shows an error when the server cannot be reached", async () => {
    vi.mocked(deleteTaskAction).mockRejectedValue(new Error("offline"));
    const user = renderBoard();
    await user.click(dayPanel().getByRole("button", { name: "Delete Buy groceries" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
