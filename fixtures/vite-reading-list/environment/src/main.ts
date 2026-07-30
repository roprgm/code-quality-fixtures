type ReadingItem = {
  id: string;
  title: string;
  url: string;
  read: boolean;
};

const starterItems: ReadingItem[] = [
  {
    id: "item-1",
    title: "Read the Vite guide",
    url: "https://vite.dev/guide/",
    read: false,
  },
  {
    id: "item-2",
    title: "Compare benchmark results",
    url: "https://example.com/benchmarks",
    read: true,
  },
];

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <header class="app-header">
    <div class="brand">
      <strong>Reading List</strong>
      <span>Keep useful links close</span>
    </div>
    <p id="reading-stats" aria-live="polite"></p>
  </header>
  <main>
    <section aria-labelledby="add-heading">
      <h1 id="add-heading">Save an article</h1>
      <form id="add-form">
        <label>
          Title
          <input name="title" required />
        </label>
        <label>
          URL
          <input name="url" type="url" required />
        </label>
        <button type="submit">Add article</button>
      </form>
    </section>
    <section aria-labelledby="articles-heading">
      <div>
        <h2 id="articles-heading">Articles</h2>
        <nav aria-label="Reading filters">
          <button aria-pressed="true" data-filter="all" type="button">All</button>
          <button aria-pressed="false" data-filter="unread" type="button">Unread</button>
          <button aria-pressed="false" data-filter="read" type="button">Read</button>
        </nav>
      </div>
      <p id="empty-message" hidden>No matching articles.</p>
      <ul id="article-list"></ul>
      <button id="clear-read" type="button">Clear read</button>
    </section>
  </main>
  <footer>
    <small>Your list is stored in this browser.</small>
  </footer>
`;

const form = document.querySelector<HTMLFormElement>("#add-form")!;
const list = document.querySelector<HTMLUListElement>("#article-list")!;
const stats = document.querySelector<HTMLParagraphElement>("#reading-stats")!;
const emptyMessage = document.querySelector<HTMLParagraphElement>("#empty-message")!;
const clearRead = document.querySelector<HTMLButtonElement>("#clear-read")!;
const filterButtons = document.querySelectorAll<HTMLButtonElement>("[data-filter]");

const savedItems = localStorage.getItem("reading-list.items");
let items: ReadingItem[] = savedItems
  ? (JSON.parse(savedItems) as ReadingItem[])
  : starterItems;
let currentFilter = "all";
let visibleItems = items;
let unreadCount = items.filter((item) => !item.read).length;

function render() {
  visibleItems = items.filter((item) => {
    if (currentFilter === "unread") return !item.read;
    if (currentFilter === "read") return item.read;
    return true;
  });
  unreadCount = items.filter((item) => !item.read).length;

  stats.textContent = `${unreadCount} unread · ${items.length} total`;
  emptyMessage.hidden = visibleItems.length !== 0;
  clearRead.hidden = !items.some((item) => item.read);
  list.innerHTML = visibleItems
    .map(
      (item) => `
        <li data-id="${item.id}">
          <label>
            <input
              aria-label="Toggle ${item.title}"
              ${item.read ? "checked" : ""}
              data-action="toggle"
              type="checkbox"
            />
            <a href="${item.url}">${item.title}</a>
          </label>
        </li>
      `,
    )
    .join("");

  localStorage.setItem("reading-list.items", JSON.stringify(items));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data: any = new FormData(form);
  const title = data.get("title").trim();
  const url = data.get("url").trim();
  if (!title || !url) return;

  items = [
    ...items,
    { id: `item-${Date.now()}`, title, url, read: false },
  ];
  form.reset();
  render();
});

list.addEventListener("change", (event) => {
  const input = event.target as HTMLInputElement;
  const id = input.closest("li")?.dataset.id;
  items = items.map((item) =>
    item.id === id ? { ...item, read: !item.read } : item,
  );
  render();
});

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter!;
    for (const candidate of filterButtons) {
      candidate.setAttribute(
        "aria-pressed",
        String(candidate === button),
      );
    }
    render();
  });
}

clearRead.addEventListener("click", () => {
  items = items.filter((item) => !item.read);
  render();
});

render();

export {};
