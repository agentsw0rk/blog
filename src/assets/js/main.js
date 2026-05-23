const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const basePath = getBasePath(navLinks);
const currentPath = normalizePath(window.location.pathname, basePath);

for (const link of navLinks) {
  const linkPath = normalizePath(new URL(link.href).pathname, basePath);

  if (linkPath === currentPath || (linkPath !== "/" && currentPath.startsWith(linkPath))) {
    link.setAttribute("aria-current", "page");
  }
}

initAnsiLogoRotation();

for (const block of document.querySelectorAll("pre")) {
  const code = block.querySelector("code");

  if (!code) {
    continue;
  }

  const button = document.createElement("button");
  button.className = "code-copy";
  button.type = "button";
  button.textContent = "Copy";

  if (!navigator.clipboard?.writeText) {
    button.disabled = true;
    button.textContent = "Copy unavailable";
  } else {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        setTemporaryButtonText(button, "Copied");
      } catch {
        setTemporaryButtonText(button, "Copy failed");
      }
    });
  }

  block.prepend(button);
}

function initAnsiLogoRotation() {
  const target = document.querySelector("[data-ansi-logo]");
  const meta = document.querySelector("[data-ansi-logo-meta]");
  const logos = window.AGENT_ANSI_LOGOS || [];

  if (!target || logos.length === 0) {
    return;
  }

  let index = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const render = () => {
    const logo = logos[index];
    target.innerHTML = ansiToHtml(logo.ansi);
    target.dataset.font = logo.font;

    if (meta) {
      meta.textContent = `${String(index + 1).padStart(2, "0")} / ${String(logos.length).padStart(2, "0")} · ${logo.font}`;
    }
  };

  render();

  if (reduceMotion.matches || logos.length < 2) {
    return;
  }

  window.setInterval(() => {
    target.classList.add("is-switching");

    window.setTimeout(() => {
      index = (index + 1) % logos.length;
      render();
      target.classList.remove("is-switching");
    }, 180);
  }, 2600);
}

function getBasePath(links) {
  const paths = links
    .map((link) => normalizePath(new URL(link.href).pathname))
    .sort((a, b) => a.length - b.length);

  return paths[0] || "/";
}

function normalizePath(path, basePath = "/") {
  let value = path.endsWith("/") ? path : `${path}/`;

  if (basePath !== "/" && value.startsWith(basePath)) {
    value = `/${value.slice(basePath.length)}`;
  }

  return value.replace(/\/{2,}/g, "/");
}

function setTemporaryButtonText(button, text) {
  button.textContent = text;

  window.setTimeout(() => {
    button.textContent = "Copy";
  }, 1400);
}

function ansiToHtml(input) {
  let color = "";
  let output = "";
  let cursor = 0;
  const ansiPattern = /\x1b\[([0-9;]*)m/g;
  let match;

  while ((match = ansiPattern.exec(input)) !== null) {
    output += wrapAnsiText(input.slice(cursor, match.index), color);
    color = parseAnsiColor(match[1], color);
    cursor = ansiPattern.lastIndex;
  }

  output += wrapAnsiText(input.slice(cursor), color);
  return output;
}

function parseAnsiColor(code, currentColor) {
  const values = code.split(";").filter(Boolean).map(Number);

  if (values.length === 0 || values.includes(0)) {
    return "";
  }

  const trueColorIndex = values.findIndex((value, index) =>
    value === 38 && values[index + 1] === 2
  );

  if (trueColorIndex !== -1 && values.length >= trueColorIndex + 5) {
    const [red, green, blue] = values.slice(trueColorIndex + 2, trueColorIndex + 5);
    return `rgb(${red}, ${green}, ${blue})`;
  }

  const ansiColors = {
    30: "#111827",
    31: "#ef4444",
    32: "#22c55e",
    33: "#f59e0b",
    34: "#3b82f6",
    35: "#d946ef",
    36: "#06b6d4",
    37: "#f8fafc",
    90: "#64748b",
    91: "#f87171",
    92: "#6ff2b4",
    93: "#ffd166",
    94: "#60a5fa",
    95: "#f0abfc",
    96: "#72e4ff"
  };

  return ansiColors[values.find((value) => ansiColors[value])] || currentColor;
}

function wrapAnsiText(text, color) {
  const escaped = escapeHtml(text);

  if (!color || escaped.length === 0) {
    return escaped;
  }

  return `<span style="color: ${color}">${escaped}</span>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
