// frontend/assets/js/router/viewRouter.js

async function loadView(path) {
  const res = await fetch(path);

  if (!res.ok) {
    const fallback = await fetch("/frontend/pages/404.html").then(r => r.text());
    document.querySelector("#app").innerHTML = fallback;
    return;
  }

  const html = await res.text();
  document.querySelector("#app").innerHTML = html;
}

export async function router() {
  let path = window.location.pathname;
  if (path.length > 1) path = path.replace(/\/$/, "");

  // HOME
  if (path === "/" || path === "/home") {
    await loadView("/frontend/pages/home.html");
    return;
  }

  // PATIENTS
  if (path === "/patients") {
    await loadView("/frontend/pages/patients.html");
    const mod = await import("../controllers/patientController.js");
    mod.initPatientController();
    return;
  }

  // DOCTORS
  if (path === "/doctors") {
    await loadView("/frontend/pages/doctors.html");
    const mod = await import("../controllers/doctorController.js");
    mod.initDoctorController();
    return;
  }

  // BILLINGS
  if (path === "/billing") {
    await loadView("/frontend/pages/billing.html");
    const mod = await import("../controllers/billingController.js");
    mod.initBillingController();
    return;
  }

  // ABOUT
  if (path === "/about") {
    await loadView("/frontend/pages/about.html");
    return;
  }

  // CONTACT
  if (path === "/contact") {
    await loadView("/frontend/pages/contact.html");
    return;
  }

  // PROFILES DIRECTORY (AUTO OPEN PATIENTS)
  if (path === "/profiles") {
    await loadView("/frontend/pages/profiles.html");

    const mod = await import("../controllers/profilesController.js");
    mod.initProfilesController();

    // 👇 automatically open Patients tab
    setTimeout(() => {
      const btn = document.querySelector('[data-type="patients"]');
      if (btn) btn.click();
    }, 100);

    return;
  }



  // PATIENT PROFILE (single patient)
  if (path.startsWith("/profiles/patients/")) {
    await loadView("/frontend/pages/profile.html");

    const patientId = path.split("/")[3];

    const mod = await import("../controllers/profileController.js");
    if (mod.loadPatientProfile) {
      mod.loadPatientProfile(patientId);
    } else {
      console.error("loadPatientProfile not implemented");
    }
    return;
  }

  // DOCTOR PROFILE (single doctor)
  if (path.startsWith("/profiles/doctors/")) {
    await loadView("/frontend/pages/profile.html");

    const doctorId = path.split("/")[3];

    const mod = await import("../controllers/profileController.js");
    if (mod.loadDoctorProfile) {
      mod.loadDoctorProfile(doctorId);
    } else {
      console.error("loadDoctorProfile not implemented");
    }
    return;
  }

  // BILL PROFILE (single bill)
  if (path.startsWith("/profiles/bills/")) {
    await loadView("/frontend/pages/profile.html");

    const billId = path.split("/")[3];

    const mod = await import("../controllers/profileController.js");
    if (mod.loadBillProfile) {
      mod.loadBillProfile(billId);
    } else {
      console.error("loadBillProfile not implemented");
    }
    return;
  }

  // PROFILES DIRECTORY (list)
  if (path === "/profiles") {
    await loadView("/frontend/pages/profiles.html");

    const mod = await import("../controllers/profilesController.js");
    mod.initProfilesController();
    return;
  }

  // DEFAULT
  await loadView("/frontend/pages/404.html");
}

export function initRouterEvents() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-link]");
    if (!link) return;

    e.preventDefault();
    history.pushState(null, "", link.getAttribute("href"));
    router();
  });

  window.addEventListener("popstate", router);
}