import { initPatientController } from "../controllers/patientController.js";
import { initDoctorController } from "../controllers/doctorController.js";
import { initBillingController } from "../controllers/billingController.js";

// Load a view into #app container
async function loadView(path) {
  const html = await fetch(path).then(res => res.text());
  document.querySelector("#app").innerHTML = html;
}

// Decide which view to load based on URL
export async function router() {
  const path = window.location.pathname;
  if (path === "/" || path === "/home") {
    await loadView("/frontend/pages/home.html");
  }

  else if (path === "/patients") {
    await loadView("/frontend/pages/patients.html");
    initPatientController();
  }

  else if (path === "/doctors") {
    await loadView("/frontend/pages/doctors.html");
    initDoctorController();
  }

  else if (path === "/billing") {
    await loadView("/frontend/pages/billing.html");
    initBillingController();
  }

  else if (path === "/about") {
    await loadView("/frontend/pages/about.html");
  }

  else if (path === "/contact") {
    await loadView("/frontend/pages/contact.html");
  }



  else {
    await loadView("/frontend/pages/404.html");
  }
}

// Make links work without page reload
export function initRouterEvents() {
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      history.pushState(null, "", e.target.href);
      router();
    }
  });

  // Back/forward buttons support
  window.addEventListener("popstate", router);
}
