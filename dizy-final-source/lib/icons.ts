export const IC: Record<string, string> = {
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  box: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
  cart: "M3 4h2l2.5 11h10L20 8H6M9 20h.01M17 20h.01",
  wallet: "M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 7l12-3v3M17 14h.01",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  book: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 5v16",
  note: "M9 18V5l11-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM20 16a3 3 0 11-6 0 3 3 0 016 0z",
  play: "M7 4l13 8-13 8z",
  font: "M4 20L10 4h1l6 16M6.5 14h8",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  check: "M5 12l5 5L20 7",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  lock: "M6 11h12v10H6zM8 11V7a4 4 0 018 0v4",
  dl: "M12 4v12M7 11l5 5 5-5M4 20h16",
  store: "M4 9l1-5h14l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6",
  lib: "M4 4h4v16H4zM10 4h4v16h-4zM16 5l4 1-3 14-4-1z",
  menu: "M4 6h16M4 12h16M4 18h16",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
};
export function icon(k: string) {
  return `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="${IC[k]}"/></svg>`;
}
