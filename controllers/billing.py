import json
from core.responses import send_json, send_404
from core.request import parse_json_body
from services.billing_service import (
    service_get_all
    , service_get_one
    , service_create
    , service_update
    , service_delete
)

def get_all_bills(handler):
    return send_json(handler, 200, service_get_all())


def get_bill(handler, bill_id):
    bill = service_get_one(bill_id)
    return send_json(handler, 200, bill) if bill else send_404(handler)

def create_bill(handler):
    data = parse_json_body(handler)
    new_bill = service_create(data)
    return send_json(handler, 201, new_bill)

def update_bill(handler, bill_id):
    data = parse_json_body(handler)
    updated = service_update(bill_id, data)
    return send_json(handler, 200, updated) if updated else send_404(handler)

def delete_bill(handler, bill_id):
    deleted = service_delete(bill_id)
    return send_json(handler, 200, {"deleted": True}) if deleted else send_404(handler)
