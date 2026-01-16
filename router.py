# router.py

from datetime import datetime
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse

# -------------------------------
# CONTROLLERS
# -------------------------------

from controllers.patients import (
    get_all_patients,
    get_patient,
    create_patient,
    update_patient,
    delete_patient,
)

from controllers.doctors import (
    get_all_doctors,
    get_doctor,
    create_doctor,
    update_doctor,
    delete_doctor,
)

from controllers.billing import (
    get_all_bills,
    get_bill,
    create_bill,
    update_bill,
    delete_bill,
)

from core.static import serve_static
from core.responses import send_404
from core.middleware import add_cors_headers

FRONTEND_ROUTES = { "/", "/home", "/patients", "/doctors", "/billing"}


def handle_ui_routes(handler, path):
    # Serve SPA shell
    if path in FRONTEND_ROUTES:
        serve_static(handler, "frontend/pages/index.html")
        return True

    # Allow direct refresh on routes
    if path.endswith(".html"):
        stripped = path.replace(".html", "")
        if stripped in FRONTEND_ROUTES:
            serve_static(handler, "frontend/pages/index.html")
            return True

    # Serve frontend assets
    if path.startswith("/frontend/"):
        serve_static(handler, path.lstrip("/"))
        return True

    # API documentation
    if path == "/openapi.yaml":
        serve_static(handler, "openapi.yaml")
        return True

    return False


    # -------------------------------
# MAIN ROUTER CLASS
# -------------------------------

class ClinicRouter(BaseHTTPRequestHandler):

    # ---------------------------
    # CORS PREFLIGHT
    # ---------------------------
    def do_OPTIONS(self):
        self.send_response(200)
        add_cors_headers(self)
        self.end_headers()

    # ---------------------------
    # READ (GET)
    # ---------------------------
    def do_GET(self):
        path = urlparse(self.path).path

        # 1. UI routes (SPA)
        if handle_ui_routes(self, path):
            return

        # ---------- PATIENT API ----------
        if path == "/api/patients":
            return get_all_patients(self)

        if path.startswith("/api/patients/"):
            patient_id = int(path.split("/")[-1])
            return get_patient(self, patient_id)

         # ---------- DOCTOR API ----------
        if path == "/api/doctors":
            return get_all_doctors(self)

        if path.startswith("/api/doctors/"):
            doctor_id = int(path.split("/")[-1])
            return get_doctor(self, doctor_id)

        # ---------- BILLING API ----------
        if path == "/api/billing":
            return get_all_bills(self)

        if path.startswith("/api/billing/"):
            bill_id = int(path.split("/")[-1])
            return get_bill(self, bill_id)

        return send_404(self)

    # ---------------------------
    # CREATE (POST)
    # ---------------------------
    def do_POST(self):
        path = urlparse(self.path).path

        if path == "/api/patients":
            return create_patient(self)

        if path == "/api/doctors":
            return create_doctor(self)

        if path == "/api/billing":
            return create_bill(self)

     
    # ---------------------------
    # UPDATE (PUT)
    # ---------------------------
    def do_PUT(self):
        # path = urlparse(self.path).path

        if self.path.startswith("/api/patients/"):
            patient_id = int(self.path.split("/")[-1])
            return update_patient(self, patient_id)

        if self.path.startswith("/api/doctors/"):
            doctor_id = int(self.path.split("/")[-1])
            return update_doctor(self, doctor_id)
        if self.path.startswith("/api/billing/"):
            billing_id = int(self.path.split("/")[-1])
            return update_bill(self, billing_id)
        return send_404(self)
    
    
    # ---------------------------
    # DELETE (DELETE)
    # ---------------------------
    def do_DELETE(self):
        path = urlparse(self.path).path

        if self.path.startswith("/api/patients/"):
            patient_id = int(self.path.split("/")[-1])
            return delete_patient(self, patient_id)

        if self.path.startswith("/api/doctors/"):
            doctor_id = int(self.path.split("/")[-1])
            return delete_doctor(self, doctor_id)
        if self.path.startswith("/api/billing/"):
            billing_id = int(self.path.split("/")[-1])
            return delete_bill(self, billing_id)

        return send_404(self)
    # ---------------------------
    # LOGGING
    # ---------------------------
    def log_message(self, format, *args):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [ClinicServer] {format % args}")

        
    