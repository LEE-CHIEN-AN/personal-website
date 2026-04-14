function initProjectPage() {
    const container = document.getElementById("project-container");
    const errorState = document.getElementById("project-error-state");
    if (!container)
        return;
    const id = getProjectIdFromQuery();
    if (!id) {
        showError(container, errorState);
        return;
    }
    fetch("data/projects.json")
        .then((response) => {
        if (!response.ok)
            throw new Error(`HTTP error ${response.status}`);
        return response.json();
    })
        .then((projects) => {
        const project = projects.find((p) => p.id === id) ??
            projects.find((p) => p.id.trim() === id.trim());
        if (!project) {
            showError(container, errorState);
            return;
        }
        renderProject(container, project);
        document.title = `${project.title} | Joan's Website`;
    })
        .catch(() => {
        showError(container, errorState);
    });
}
function showError(container, errorState) {
    container.innerHTML = "";
    if (errorState)
        errorState.classList.remove("hidden");
}
function getProjectIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id)
        return null;
    return id;
}
function renderProject(container, project) {
    container.innerHTML = "";
    const header = document.createElement("header");
    header.className = "project-detail-header";
    const title = document.createElement("h1");
    title.className = "project-detail-title";
    title.textContent = project.title;
    header.appendChild(title);
    if (project.subtitle) {
        const subtitle = document.createElement("p");
        subtitle.className = "project-detail-subtitle";
        subtitle.textContent = project.subtitle;
        header.appendChild(subtitle);
    }
    if (project.role) {
        const role = document.createElement("p");
        role.className = "project-detail-role";
        role.textContent = project.role;
        header.appendChild(role);
    }
    container.appendChild(header);
    const sections = document.createElement("div");
    sections.className = "project-detail-sections";
    const details = renderProjectDetails(project);
    if (details)
        sections.appendChild(details);
    sections.appendChild(renderOverview(project));
    if (project.contributions && project.contributions.length > 0) {
        sections.appendChild(renderContributions(project.contributions));
    }
    if ((project.techStack && project.techStack.length > 0) || (project.tags && project.tags.length > 0)) {
        sections.appendChild(renderTags(project.techStack ?? [], project.tags ?? []));
    }
    if (project.links && project.links.length > 0) {
        sections.appendChild(renderLinks(project.links));
    }
    if (project.embeds && project.embeds.length > 0) {
        sections.appendChild(renderEmbeds(project.embeds));
    }
    container.appendChild(sections);
}
function renderProjectDetails(project) {
    const hasMeta = Boolean(project.date || project.course);
    const topics = project.topics ?? [];
    const hasTopics = topics.length > 0;
    if (!hasMeta && !hasTopics)
        return null;
    const section = document.createElement("section");
    section.className = "project-detail-section";
    const h = document.createElement("h2");
    h.className = "project-detail-section-title";
    h.textContent = "Project details";
    section.appendChild(h);
    if (hasMeta) {
        const dl = document.createElement("dl");
        dl.className = "project-detail-dl";
        if (project.date) {
            const dt = document.createElement("dt");
            dt.textContent = "Date";
            const dd = document.createElement("dd");
            dd.textContent = project.date;
            dl.appendChild(dt);
            dl.appendChild(dd);
        }
        if (project.course) {
            const dt = document.createElement("dt");
            dt.textContent = "Course";
            const dd = document.createElement("dd");
            dd.textContent = project.course;
            dl.appendChild(dt);
            dl.appendChild(dd);
        }
        section.appendChild(dl);
    }
    if (hasTopics) {
        const topicsWrap = document.createElement("div");
        topicsWrap.className = "project-detail-topics";
        topics.forEach((t) => {
            const chip = document.createElement("span");
            chip.className = "tag tag-meta";
            chip.textContent = t;
            topicsWrap.appendChild(chip);
        });
        section.appendChild(topicsWrap);
    }
    return section;
}
function renderOverview(project) {
    const section = document.createElement("section");
    section.className = "project-detail-section";
    const h = document.createElement("h2");
    h.className = "project-detail-section-title";
    h.textContent = "Overview";
    section.appendChild(h);
    const p = document.createElement("p");
    p.className = "project-detail-description";
    p.textContent = project.description.replace(/\\n/g, "\n");
    section.appendChild(p);
    return section;
}
function renderContributions(items) {
    const section = document.createElement("section");
    section.className = "project-detail-section";
    const h = document.createElement("h2");
    h.className = "project-detail-section-title";
    h.textContent = "What I did";
    section.appendChild(h);
    const list = document.createElement("ul");
    list.className = "project-detail-list";
    items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });
    section.appendChild(list);
    return section;
}
function renderTags(techStack, tags) {
    const section = document.createElement("section");
    section.className = "project-detail-section";
    const h = document.createElement("h2");
    h.className = "project-detail-section-title";
    h.textContent = "Tech & Tags";
    section.appendChild(h);
    const container = document.createElement("div");
    container.className = "project-detail-tags";
    techStack.forEach((tech) => {
        const tag = document.createElement("span");
        tag.className = "tag tag-tech";
        tag.textContent = `#${tech}`;
        container.appendChild(tag);
    });
    tags.forEach((t) => {
        const tag = document.createElement("span");
        tag.className = "tag tag-meta";
        tag.textContent = `#${t}`;
        container.appendChild(tag);
    });
    section.appendChild(container);
    return section;
}
function renderLinks(links) {
    const section = document.createElement("section");
    section.className = "project-detail-section";
    const h = document.createElement("h2");
    h.className = "project-detail-section-title";
    h.textContent = "Links";
    section.appendChild(h);
    const linksContainer = document.createElement("div");
    linksContainer.className = "project-links";
    links.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = `project-link project-link-${link.type}`;
        a.textContent = link.label;
        linksContainer.appendChild(a);
    });
    section.appendChild(linksContainer);
    return section;
}
function renderEmbeds(embeds) {
    const section = document.createElement("section");
    section.className = "project-detail-section";
    const h = document.createElement("h2");
    h.className = "project-detail-section-title";
    h.textContent = "Media";
    section.appendChild(h);
    const embedsContainer = document.createElement("div");
    embedsContainer.className = "project-embeds";
    embeds.forEach((embed) => {
        const wrapper = document.createElement("div");
        wrapper.className = "embed-wrapper";
        wrapper.classList.add(getRatioClass(embed.ratio));
        if (embed.title) {
            const label = document.createElement("div");
            label.className = "embed-title";
            label.textContent = embed.title;
            wrapper.appendChild(label);
        }
        const iframeContainer = document.createElement("div");
        iframeContainer.className = "embed-frame-container";
        const iframe = document.createElement("iframe");
        iframe.src = embed.src;
        iframe.loading = "lazy";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
        iframeContainer.appendChild(iframe);
        wrapper.appendChild(iframeContainer);
        embedsContainer.appendChild(wrapper);
    });
    section.appendChild(embedsContainer);
    return section;
}
function getRatioClass(ratio) {
    switch (ratio) {
        case "4-3":
            return "embed-ratio-4-3";
        case "1-1":
            return "embed-ratio-1-1";
        case "16-9":
        default:
            return "embed-ratio-16-9";
    }
}
document.addEventListener("DOMContentLoaded", initProjectPage);
export {};
