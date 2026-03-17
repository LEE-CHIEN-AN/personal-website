"use strict";
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
        return response.json();
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
function renderProjects(container, projects) {
    container.innerHTML = "";
    projects.forEach((project) => {
        const card = createProjectCard(project);
        container.appendChild(card);
    });
}
function createProjectCard(project) {
    const card = document.createElement("article");
    card.className = "project-card";
    const header = document.createElement("header");
    header.className = "project-header";
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
    description.className = "project-description";
    description.textContent = project.description.replace(/\\n/g, "\n");
    body.appendChild(description);
    if (project.contributions && project.contributions.length > 0) {
        const contribTitle = document.createElement("div");
        contribTitle.className = "project-section-title";
        contribTitle.textContent = "我負責的部分";
        body.appendChild(contribTitle);
        const list = document.createElement("ul");
        list.className = "project-contributions";
        project.contributions.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);
        });
        body.appendChild(list);
    }
    if (project.techStack && project.techStack.length > 0) {
        const tagsContainer = document.createElement("div");
        tagsContainer.className = "project-techstack";
        project.techStack.forEach((tech) => {
            const tag = document.createElement("span");
            tag.className = "tag tag-tech";
            tag.textContent = `#${tech}`;
            tagsContainer.appendChild(tag);
        });
        if (project.tags && project.tags.length > 0) {
            project.tags.forEach((t) => {
                const tag = document.createElement("span");
                tag.className = "tag tag-meta";
                tag.textContent = `#${t}`;
                tagsContainer.appendChild(tag);
            });
        }
        body.appendChild(tagsContainer);
    }
    else if (project.tags && project.tags.length > 0) {
        const tagsContainer = document.createElement("div");
        tagsContainer.className = "project-techstack";
        project.tags.forEach((t) => {
            const tag = document.createElement("span");
            tag.className = "tag tag-meta";
            tag.textContent = `#${t}`;
            tagsContainer.appendChild(tag);
        });
        body.appendChild(tagsContainer);
    }
    if (project.links && project.links.length > 0) {
        const linksContainer = document.createElement("div");
        linksContainer.className = "project-links";
        project.links.forEach((link) => {
            const a = document.createElement("a");
            a.href = link.url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.className = `project-link project-link-${link.type}`;
            a.textContent = link.label;
            linksContainer.appendChild(a);
        });
        body.appendChild(linksContainer);
    }
    if (project.embeds && project.embeds.length > 0) {
        const embedsContainer = document.createElement("div");
        embedsContainer.className = "project-embeds";
        project.embeds.forEach((embed) => {
            const wrapper = document.createElement("div");
            wrapper.className = "embed-wrapper";
            const ratioClass = getRatioClass(embed.ratio);
            wrapper.classList.add(ratioClass);
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
        body.appendChild(embedsContainer);
    }
    card.appendChild(body);
    return card;
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
document.addEventListener("DOMContentLoaded", initPortfolio);
