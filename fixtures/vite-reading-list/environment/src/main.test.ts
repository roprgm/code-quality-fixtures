import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, screen } from "@testing-library/dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

async function startApp() {
  const html = readFileSync(join(process.cwd(), "index.html"), "utf8");
  const page = new DOMParser().parseFromString(html, "text/html");
  document.body.innerHTML = page.body.innerHTML;
  vi.resetModules();
  await import("./main");
}

describe("reading list", () => {
  beforeEach(() => localStorage.clear());

  it("shows and filters the starter articles", async () => {
    await startApp();
    expect(screen.getByText(/1 unread · 2 total/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Unread" }));
    expect(screen.getByText("Read the Vite guide")).toBeInTheDocument();
    expect(screen.queryByText("Compare benchmark results")).not.toBeInTheDocument();
  });

  it("adds and persists an article", async () => {
    await startApp();
    fireEvent.input(screen.getByLabelText("Title"), {
      target: { value: "Review the refactor" },
    });
    fireEvent.input(screen.getByLabelText("URL"), {
      target: { value: "https://example.com/refactor" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add article" }));

    expect(screen.getByText("Review the refactor")).toBeInTheDocument();
    expect(localStorage.getItem("reading-list.items")).toContain(
      "Review the refactor",
    );
  });

  it("toggles and clears read articles", async () => {
    await startApp();
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Toggle Read the Vite guide" }),
    );
    expect(screen.getByText(/0 unread · 2 total/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear read" }));
    expect(screen.getByText("No matching articles.")).toBeVisible();
  });
});
