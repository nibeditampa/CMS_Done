from datetime import datetime
from .connection import get_connection

def db_get_all():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM patients ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_get_one(patient_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM patients WHERE id = ?", (patient_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def db_create(data):
    conn = get_connection()
    now = datetime.now().isoformat()
    cur = conn.execute(
        "INSERT INTO patients (name, age, gender, contact, created_at) VALUES (?, ?, ?, ?, ?)",
        (data["name"], data["age"], data["gender"], data["contact"], now)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_one(new_id)

def db_update(patient_id, data):
    conn = get_connection()
    now = datetime.today().isoformat()
    conn.execute("""
        UPDATE patients SET name=?, age=?, gender=?, contact=?, updated_at=?
        WHERE id=?
    """, (data["name"], data["age"], data["gender"], data["contact"], now, patient_id))
    conn.commit()
    conn.close()
    return db_get_one(patient_id)

def db_delete(patient_id):
    patient = db_get_one(patient_id)
    if not patient:
        return None
    
    conn = get_connection()
    conn.execute("DELETE FROM patients WHERE id=?", (patient_id,))
    conn.commit()
    conn.close()
    return patient
