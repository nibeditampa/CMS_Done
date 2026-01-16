from datetime import datetime
from .connection import get_connection

def db_get_all():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM billing ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_get_one(bill_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM billing WHERE id = ?", (bill_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def db_create(data):
    conn = get_connection()
    now = datetime.now().isoformat()
    cur = conn.execute(
        "INSERT INTO billing (patient_id, doctor_attended, amount, bill_date, created_at) VALUES (?, ?, ?, ?, ?)",
        (data["patient_id"], data["doctor_attended"], data["amount"], data["bill_date"], now)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_one(new_id)

def db_update(bill_id, data):
    conn = get_connection()
    now = datetime.now().isoformat()
    conn.execute("""
        UPDATE billing SET patient_id=?, doctor_attended=?, amount=?, bill_date=?, updated_at=?
        WHERE id=?
    """, (data["patient_id"], data["doctor_attended"], data["amount"], data["bill_date"], now, bill_id))
    conn.commit()
    conn.close()
    return db_get_one(bill_id)

def db_delete(bill_id):
    bill = db_get_one(bill_id)
    if not bill:
        return None
    
    conn = get_connection()
    conn.execute("DELETE FROM billing WHERE id=?", (bill_id,))
    conn.commit()
    conn.close()
    return bill
