import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("task board", () => {
  beforeEach(() => localStorage.clear());

  it("shows and filters starter tasks", () => {
    render(<App />);
    expect(screen.getByText(/1 open · 1 completed/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Completed" }));
    expect(screen.getByText("Protect the behavior")).toBeInTheDocument();
    expect(screen.queryByText("Name the boundaries")).not.toBeInTheDocument();
  });

  it("adds and persists a task", async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Compare the outputs" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add task" }));

    expect(screen.getByText("Compare the outputs")).toBeInTheDocument();
    await waitFor(() =>
      expect(localStorage.getItem("task-board.tasks")).toContain(
        "Compare the outputs",
      ),
    );
  });

  it("toggles and clears completed tasks", () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Toggle Name the boundaries" }),
    );
    expect(screen.getByText(/0 open · 2 completed/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear completed" }));
    expect(screen.getByText("No tasks yet.")).toBeInTheDocument();
  });
});
