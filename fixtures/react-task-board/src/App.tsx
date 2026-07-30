import { FormEvent, useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const starterTasks: Task[] = [
  { id: "task-1", title: "Name the boundaries", completed: false },
  { id: "task-2", title: "Protect the behavior", completed: true },
];

function loadTasks() {
  const saved = localStorage.getItem("task-board.tasks");
  return saved ? (JSON.parse(saved) as Task[]) : starterTasks;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [filter, setFilter] = useState("all");
  const [openTasks, setOpenTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    setOpenTasks(tasks.filter((task) => !task.completed));
    setCompletedTasks(tasks.filter((task) => task.completed));
    localStorage.setItem("task-board.tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data: any = new FormData(form);
    const title = data.get("title");
    if (!title.trim()) return;

    setTasks([
      ...tasks,
      { id: `task-${Date.now()}`, title: title.trim(), completed: false },
    ]);
    form.reset();
  }

  function TaskRow({ task }: { task: Task }) {
    return (
      <li>
        <label>
          <input
            aria-label={`Toggle ${task.title}`}
            checked={task.completed}
            onChange={() =>
              setTasks(
                tasks.map((item) =>
                  item.id === task.id
                    ? { ...item, completed: !item.completed }
                    : item,
                ),
              )
            }
            type="checkbox"
          />
          {task.title}
        </label>
      </li>
    );
  }

  const visibleTasks = tasks.filter((task) =>
    filter === "all"
      ? true
      : filter === "open"
        ? !task.completed
        : task.completed,
  );

  let content;
  if (tasks.length === 0) content = <p>No tasks yet.</p>;
  else if (visibleTasks.length === 0) content = <p>No matching tasks.</p>;
  else
    content = (
      <ul>
        {visibleTasks.map((task, index) => (
          <TaskRow key={index} task={task} />
        ))}
      </ul>
    );

  return (
    <main>
      <h1>Task Board</h1>
      <p>
        {openTasks.length} open · {completedTasks.length} completed
      </p>

      <form onSubmit={addTask}>
        <label>
          Title
          <input name="title" />
        </label>
        <button type="submit">Add task</button>
      </form>

      <nav aria-label="Task filters">
        {[
          ["all", "All"],
          ["open", "Open"],
          ["completed", "Completed"],
        ].map(([value, label]) => (
          <button
            aria-pressed={filter === value}
            key={value}
            onClick={() => setFilter(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </nav>

      {content}

      {completedTasks.length > 0 && (
        <button
          onClick={() => setTasks(tasks.filter((task) => !task.completed))}
          type="button"
        >
          Clear completed
        </button>
      )}
    </main>
  );
}
