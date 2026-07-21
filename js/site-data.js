// KennyIzzy — shared content helpers
// Fetches the JSON content files (editable via /admin CMS) and renders them into the page.

const KZ = (() => {
  const cache = {};

  async function fetchJSON(path) {
    if (cache[path]) return cache[path];
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    const data = await res.json();
    cache[path] = data;
    return data;
  }

  function slugify(str) {
    return String(str)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch (e) {
      return "";
    }
  }

  // Minimal markdown renderer: paragraphs + *italic* + **bold** — enough for journal/chapter bodies
  // without pulling in a full markdown library.
  function renderMarkdown(md) {
    if (!md) return "";
    const escaped = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const withInline = escaped
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");
    return withInline
      .split(/\n\s*\n/)
      .map(p => `<p>${p.trim().replace(/\n/g, "<br>")}</p>`)
      .join("\n");
  }

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  return { fetchJSON, slugify, formatDate, renderMarkdown, getParam };
})();
