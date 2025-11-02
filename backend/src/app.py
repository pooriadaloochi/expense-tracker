from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict
from datetime import date as _date

from src.db import create_table, create_connection

app = FastAPI(title="Expense Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # در توسعه باز بگذار، برای پروداکشن محدود کن
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExpenseIn(BaseModel):
    category: str = Field(min_length=1)
    amount: float = Field(gt=0)
    description: str = ""
    date: str  # "YYYY-MM-DD"

class ExpenseOut(ExpenseIn):
    id: int

@app.on_event("startup")
def startup():
    create_table()

@app.get("/api/expenses", response_model=List[ExpenseOut])
def list_expenses():
    conn = create_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, category, amount, description, date FROM expenses ORDER BY date DESC")
    rows = cur.fetchall()
    conn.close()
    return [{"id": r[0], "category": r[1], "amount": r[2], "description": r[3], "date": r[4]} for r in rows]

@app.post("/api/expenses", response_model=ExpenseOut, status_code=201)
def add_expense(exp: ExpenseIn):
    conn = create_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO expenses (category, amount, description, date) VALUES (?, ?, ?, ?)",
        (exp.category, exp.amount, exp.description, exp.date)
    )
    new_id = cur.lastrowid
    conn.commit()
    conn.close()
    return {**exp.dict(), "id": new_id}

@app.delete("/api/expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: int):
    conn = create_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Expense not found")
    conn.commit()
    conn.close()
    return

@app.get("/api/summary", response_model=Dict[str, float])
def summary_by_category():
    conn = create_connection()
    cur = conn.cursor()
    cur.execute("SELECT category, SUM(amount) FROM expenses GROUP BY category")
    data = cur.fetchall()
    conn.close()
    return {row[0]: float(row[1]) for row in data}
