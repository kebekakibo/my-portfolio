
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

contactForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const submitButton = contactForm.querySelector(
    'button[type="submit"]'
  );

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  formStatus.textContent = "";

  try {
    const response = await fetch(
      "https://portfolio-backend-089l.onrender.com/api/contacts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to send your message."
      );
    }

    formStatus.textContent =
      `Thanks, ${name}! Your message was sent successfully.`;

    contactForm.reset();

  } catch (error) {
    console.error("Contact form error:", error);

    formStatus.textContent =
      "Sorry, your message could not be sent. Please try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Message";
  }
});


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

        if (message) {
            message.textContent =
                "Projects could not load. Please try again later.";
        }
    }
}

loadProjects();


