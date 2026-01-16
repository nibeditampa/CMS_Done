import json
from core.responses import send_json, send_404
from core.request import parse_json_body
from services.doctor_service import (
    service_get_all
    , service_get_one
    , service_create
    , service_update
    , service_delete
)

def get_all_doctors(handler):
    return send_json(handler, 200, service_get_all())


def get_doctor(handler, doctor_id):
    doctor = service_get_one(doctor_id)
    return send_json(handler, 200, doctor) if doctor else send_404(handler)

def create_doctor(handler):
    data = parse_json_body(handler)
    new_doctor = service_create(data)
    return send_json(handler, 201, new_doctor)

def update_doctor(handler, doctor_id):
    data = parse_json_body(handler)
    updated = service_update(doctor_id, data)
    return send_json(handler, 200, updated) if updated else send_404(handler)

def delete_doctor(handler, doctor_id):
    deleted = service_delete(doctor_id)
    return send_json(handler, 200, {"deleted": True}) if deleted else send_404(handler)
