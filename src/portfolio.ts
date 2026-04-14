type ProjectLinkType = "github" | "demo" | "design" | "pdf" | "image" | "youtube" | "other";

type EmbedType = "youtube" | "canva" | "generic";

export {};

interface ProjectLink {
  type: ProjectLinkType;
  label: string;
  url: string;
}

interface ProjectEmbed {
  type: EmbedType;
  title: string;
  src: string;
  ratio?: "16-9" | "4-3" | "1-1";
}

interface Project {
  id: string;
  title: string;
  subtitle?: string;
  coverUrl?: string;
  description: string;
  role?: string;
  contributions?: string[];
  techStack?: string[];
  links?: ProjectLink[];
  embeds?: ProjectEmbed[];
  tags?: string[];
}

const SUMMARY_MAX_CHARS = 160;
const SUMMARY_MAX_TECH_TAGS = 5;
const SUMMARY_MAX_META_TAGS = 2;

function initPortfolio() {
  const container = document.getElementById("projects-container");
  const emptyState = document.getElementById("projects-empty-state");
  const errorState = document.getElementById("projects-error-state");

  if (!container) {
    return;
  }

  fetch("data/projects.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json() as Promise<Project[]>;
    })
    .then((projects) => {
      if (!projects || projects.length === 0) {
        if (emptyState) {
          emptyState.classList.remove("hidden");
        }
        return;
      }
      renderProjects(container, projects);
    })
    .catch(() => {
      if (errorState) {
        errorState.classList.remove("hidden");
      }
    });
}

function renderProjects(container: HTMLElement, projects: Project[]) {
  container.innerHTML = "";
  projects.forEach((project) => {
    const card = createProjectCard(project);
    container.appendChild(card);
  });
}

function createProjectCard(project: Project): HTMLElement {
  const card = document.createElement("article");
  card.className = "project-card project-card-compact";
  card.tabIndex = 0;
  card.setAttribute("role", "link");
  card.setAttribute("aria-label", `查看詳情：${project.title}`);
  card.dataset.href = `project.html?id=${encodeURIComponent(project.id)}`;

  const header = document.createElement("header");
  header.className = "project-header";

  const thumb = document.createElement("div");
  thumb.className = "project-thumb";
  const coverUrl = getCoverUrl(project);
  if (coverUrl) {
    const img = document.createElement("img");
    img.className = "project-thumb-img";
    img.loading = "lazy";
    img.alt = `${project.title} 封面圖`;
    img.src = coverUrl;
    thumb.appendChild(img);
  }
  header.appendChild(thumb);

  const title = document.createElement("h2");
  title.className = "project-title";
  title.textContent = project.title;
  header.appendChild(title);

  if (project.subtitle) {
    const subtitle = document.createElement("p");
    subtitle.className = "project-subtitle";
    subtitle.textContent = project.subtitle;
    header.appendChild(subtitle);
  }

  if (project.role) {
    const role = document.createElement("p");
    role.className = "project-role";
    role.textContent = project.role;
    header.appendChild(role);
  }

  card.appendChild(header);

  const body = document.createElement("div");
  body.className = "project-body";

  const description = document.createElement("p");
  description.className = "project-summary";
  description.textContent = buildSummary(project.description);
  body.appendChild(description);

  const tagsContainer = createSummaryTags(project);
  if (tagsContainer) body.appendChild(tagsContainer);

  const actions = document.createElement("div");
  actions.className = "project-actions";

  const view = document.createElement("a");
  view.className = "project-view";
  view.href = `project.html?id=${encodeURIComponent(project.id)}`;
  view.textContent = "View →";
  view.addEventListener("click", (e) => e.stopPropagation());
  actions.appendChild(view);

  const primaryLinks = pickPrimaryLinks(project.links ?? []);
  primaryLinks.forEach((link) => actions.appendChild(createProjectLinkChip(link)));

  body.appendChild(actions);

  card.appendChild(body);

  card.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest("a")) return;
    const href = card.dataset.href;
    if (href) window.location.href = href;
  });

  card.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    const href = card.dataset.href;
    if (href) window.location.href = href;
  });

  return card;
}

function buildSummary(description: string): string {
  const normalized = description.replace(/\\n/g, "\n").replace(/\s+/g, " ").trim();
  if (normalized.length <= SUMMARY_MAX_CHARS) return normalized;
  return `${normalized.slice(0, SUMMARY_MAX_CHARS).trimEnd()}…`;
}

function createSummaryTags(project: Project): HTMLElement | null {
  const techStack = project.techStack ?? [];
  const metaTags = project.tags ?? [];
  if (techStack.length === 0 && metaTags.length === 0) return null;

  const container = document.createElement("div");
  container.className = "project-techstack project-techstack-compact";

  const techToShow = techStack.slice(0, SUMMARY_MAX_TECH_TAGS);
  techToShow.forEach((tech) => {
    const tag = document.createElement("span");
    tag.className = "tag tag-tech";
    tag.textContent = `#${tech}`;
    container.appendChild(tag);
  });

  const metaToShow = metaTags.slice(0, SUMMARY_MAX_META_TAGS);
  metaToShow.forEach((t) => {
    const tag = document.createElement("span");
    tag.className = "tag tag-meta";
    tag.textContent = `#${t}`;
    container.appendChild(tag);
  });

  const remaining = techStack.length - techToShow.length + (metaTags.length - metaToShow.length);
  if (remaining > 0) {
    const more = document.createElement("span");
    more.className = "tag tag-more";
    more.textContent = `+${remaining}`;
    container.appendChild(more);
  }

  return container;
}

function pickPrimaryLinks(links: ProjectLink[]): ProjectLink[] {
  if (links.length === 0) return [];
  const byType = (t: ProjectLinkType) => links.find((l) => l.type === t);
  const picked: ProjectLink[] = [];
  const demo = byType("demo");
  const github = byType("github");
  if (demo) picked.push(demo);
  if (github && picked.length < 2) picked.push(github);
  for (const l of links) {
    if (picked.length >= 2) break;
    if (!picked.includes(l)) picked.push(l);
  }
  return picked;
}

function createProjectLinkChip(link: ProjectLink): HTMLAnchorElement {
  const a = document.createElement("a");
  a.href = link.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.className = `project-link project-link-${link.type}`;
  a.textContent = link.label;
  a.addEventListener("click", (e) => e.stopPropagation());
  return a;
}

function getCoverUrl(project: Project): string | null {
  if (project.coverUrl) return project.coverUrl;

  const youtubeEmbed = project.embeds?.find((e) => e.type === "youtube")?.src ?? null;
  if (youtubeEmbed) {
    const id = extractYouTubeId(youtubeEmbed);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }

  const youtubeLink =
    project.links?.find((l) => l.type === "youtube")?.url ??
    project.links?.find((l) => l.type === "other" && /youtu\.be|youtube\.com/i.test(l.url))?.url ??
    null;
  if (youtubeLink) {
    const id = extractYouTubeId(youtubeLink);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }

  const fromImageLink = project.links?.find((l) => l.type === "image")?.url ?? null;
  if (fromImageLink) return fromImageLink;

  return null;
}

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) {
        const id = u.pathname.split("/").filter(Boolean)[1];
        return id || null;
      }
      const v = u.searchParams.get("v");
      if (v) return v;
    }
  } catch {
    // ignore
  }
  return null;
}

document.addEventListener("DOMContentLoaded", initPortfolio);

