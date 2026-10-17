
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuToggle.addEventListener("click", function () {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
});

navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
});


const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const name = document.getElementById("name").value.trim();

  formStatus.textContent =
    `Thanks, ${name}! Your form works, but the message has not been sent.`;

  contactForm.reset();
});

async function loadPortfolioProjects() {
    const grid = document.querySelector(".project-grid");

    if (!grid) {
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:3000/api/projects"
        );

        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }

        const projects = await response.json();
        const fragment = document.createDocumentFragment();

        projects.forEach(project => {
            const card = document.createElement("article");
            card.className = "project-card";

            const icon = document.createElement("div");
            icon.className = "project-icon";
            icon.textContent = project.icon;
            card.appendChild(icon);

            if (project.status) {
                const status = document.createElement("p");
                status.className = "project-status";
                status.textContent = project.status;
                card.appendChild(status);
            }

            const title = document.createElement("h3");
            title.textContent = project.name;
            card.appendChild(title);

            const description = document.createElement("p");
            description.className = "project-description";
            description.textContent = project.description;
            card.appendChild(description);

            const tags = document.createElement("div");
            tags.className = "project-tags";

            project.tags.forEach(tag => {
                const span = document.createElement("span");
                span.textContent = tag;
                tags.appendChild(span);
            });

            card.appendChild(tags);

            const actions = document.createElement("div");
            actions.className = "project-actions";

            project.actions.forEach(action => {
                const link = document.createElement("a");
                link.href = action.href;
                link.className = action.className;
                link.textContent = action.text;

                if (action.target) {
                    link.target = action.target;
                    link.rel = "noopener noreferrer";
                }

                if (action.ariaLabel) {
                    link.setAttribute("aria-label", action.ariaLabel);
                }

                actions.appendChild(link);
            });

            card.appendChild(actions);
            fragment.appendChild(card);
        });

        // Replace the existing cards only after loading succeeds.
        grid.replaceChildren(fragment);

    } catch (error) {
        // Keep the original HTML cards if the backend is unavailable.
        console.error("Could not load portfolio projects:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadPortfolioProjects);


const projectsApiUrl =
    "https://portfolio-backend-089l.onrender.com/api/projects";

async function loadProjects() {
    const projectGrid = document.getElementById("project-grid");
    const message = document.getElementById("projects-message");

    try {
        const response = await fetch(projectsApiUrl);

        if (!response.ok) {
            throw new Error("Failed to load projects");
        }

        const projects = await response.json();

        projectGrid.replaceChildren();

        projects.forEach((project) => {
            const card = document.createElement("article");
            card.className = "project-card";

            const icon = document.createElement("div");
            icon.className = "project-icon";
            icon.textContent = project.icon || "💻";
            card.appendChild(icon);

            if (project.status) {
                const status = document.createElement("p");
                status.className = "project-status";
                status.textContent = project.status;
                card.appendChild(status);
            }

            const title = document.createElement("h3");
            title.textContent = project.name;
            card.appendChild(title);

            const description = document.createElement("p");
            description.className = "project-description";
            description.textContent = project.description;
            card.appendChild(description);

            const tags = document.createElement("div");
            tags.className = "project-tags";

            project.tags.forEach((tag) => {
                const span = document.createElement("span");
                span.textContent = tag;
                tags.appendChild(span);
            });

            card.appendChild(tags);

            if (project.actions?.length) {
                const actions = document.createElement("div");
                actions.className = "project-actions";

                project.actions.forEach((action) => {
                    const link = document.createElement("a");
                    link.textContent = action.text;
                    link.href = action.href;
                    link.className = action.className || "project-link";

                    if (action.ariaLabel) {
                        link.setAttribute("aria-label", action.ariaLabel);
                    }

                    if (action.target === "_blank") {
                        link.target = "_blank";
                        link.rel = "noopener noreferrer";
                    }

                    actions.appendChild(link);
                });

                card.appendChild(actions);
            }

            projectGrid.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading projects:", error);

        projectGrid.replaceChildren();

        const errorMessage = document.createElement("p");
        errorMessage.textContent =
            "Projects could not load. Please try again later.";

        projectGrid.appendChild(errorMessage);
    }
}

loadProjects();
