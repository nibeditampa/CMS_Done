from database.billing_queries import (
    db_get_all
    , db_get_one
    , db_create
    , db_update
    , db_delete
)

def service_get_all():
    return db_get_all()

def service_get_one(bill_id):
    return db_get_one(bill_id)

def service_create(data):
    return db_create(data)

def service_update(bill_id, data):
    return db_update(bill_id, data)

def service_delete(bill_id):
    return db_delete(bill_id)
