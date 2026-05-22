const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const basePath = getBasePath(navLinks);
const currentPath = normalizePath(window.location.pathname, basePath);

for (const link of navLinks) {
  const linkPath = normalizePath(new URL(link.href).pathname, basePath);

  if (linkPath === currentPath || (linkPath !== "/" && currentPath.startsWith(linkPath))) {
    link.setAttribute("aria-current", "page");
  }
}

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
