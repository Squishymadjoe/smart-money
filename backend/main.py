import os
import warnings
import json
import random # Added for bank simulation
from io import BytesIO
from PIL import Image
from datetime import datetime, timedelta # Added timedelta for past dates
from typing import List, Optional
from uuid import uuid4
from contextlib import asynccontextmanager

# Suppress Warnings
warnings.filterwarnings("ignore", category=FutureWarning)

from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy import func
import google.generativeai as genai

# --- Configuration ---
DATABASE_URL = "sqlite:///./smartmoney.db"

# ⚠️ PASTE YOUR API KEY BELOW ⚠️
GEMINI_API_KEY = "AIzaSyCwxUlupwU5IvL5Hwa0RDkFpK3p7k--k-k" 

try:
    genai.configure(api_key=GEMINI_API_KEY)
except Exception as e:
    print(f"Warning: Gemini API Key configuration failed. {e}")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="SmartMoney API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Models ---
class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    full_name = Column(String)
    currency_pref = Column(String, default="NGN")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    accounts = relationship("Account", back_populates="owner")
    transactions = relationship("Transaction", back_populates="owner")
    subscriptions = relationship("Subscription", back_populates="owner")
    achievements = relationship("Achievement", back_populates="owner")

class Account(Base):
    __tablename__ = "accounts"
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    institution_name = Column(String) 
    account_type = Column(String)     
    balance = Column(Float, default=0.0)
    is_connected = Column(Boolean, default=False)
    owner = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    account_id = Column(String, ForeignKey("accounts.id"))
    amount = Column(Float)
    category = Column(String)
    merchant_name = Column(String)
    description = Column(Text, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    is_recurring = Column(Boolean, default=False)
    owner = relationship("User", back_populates="transactions")
    account = relationship("Account", back_populates="transactions")

class Subscription(Base):
    __tablename__ = "subscriptions"
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String)
    price = Column(Float)
    due_date = Column(String) # e.g. "Oct 23"
    cycle = Column(String) # "Monthly"
    logo_text = Column(String) # "N"
    color = Column(String) # "bg-red-600"
    owner = relationship("User", back_populates="subscriptions")

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    title = Column(String)
    description = Column(String)
    progress = Column(Float) # 0 to 100
    completed = Column(Boolean, default=False)
    icon_type = Column(String) # "Zap", "Target", etc.
    color_class = Column(String) # "text-yellow-500 bg-yellow-100"
    owner = relationship("User", back_populates="achievements")

# --- Pydantic Schemas ---
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class TransactionCreate(BaseModel):
    amount: float
    category: str
    merchant_name: str
    date: datetime = datetime.utcnow()

class ChatRequest(BaseModel):
    message: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"message": "SmartMoney API is running! 🚀"}

@app.post("/auth/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Basic insecure hashing for prototype
    hashed_pw = user.password + "_hashed"
    
    new_user = User(
        email=user.email,
        password_hash=hashed_pw, 
        full_name=user.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create default account for new user
    account = Account(user_id=new_user.id, institution_name="Wallet", account_type="Cash", balance=0.0)
    db.add(account)
    db.commit()
    
    return {"message": "User created successfully", "user_id": new_user.id}

@app.post("/auth/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check password logic
    # 1. Check Standard Register Logic
    if db_user.password_hash == user.password + "_hashed":
        return {"message": "Login successful", "user_id": db_user.id}
    
    # 2. Check Demo User Special Case (from seed.py)
    if db_user.email == "demo@example.com" and (user.password == "password" or user.password == "hashed"):
        return {"message": "Login successful", "user_id": db_user.id}
        
    raise HTTPException(status_code=401, detail="Incorrect password")

@app.get("/dashboard/{user_id}")
def get_dashboard(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    
    total_balance = sum(acc.balance for acc in user.accounts)
    recent_txs = db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.date.desc()).limit(5).all()
    
    return {
        "user": user.full_name,
        "total_balance": total_balance,
        "currency": user.currency_pref,
        "recent_transactions": [
            {
                "id": tx.id,
                "title": tx.merchant_name,
                "amount": tx.amount,
                "date": tx.date.strftime("%Y-%m-%d"),
                "type": "income" if tx.amount > 0 else "expense",
                "category": tx.category
            } for tx in recent_txs
        ]
    }

@app.get("/subscriptions/{user_id}")
def get_subscriptions(user_id: str, db: Session = Depends(get_db)):
    return db.query(Subscription).filter(Subscription.user_id == user_id).all()

@app.get("/achievements/{user_id}")
def get_achievements(user_id: str, db: Session = Depends(get_db)):
    return db.query(Achievement).filter(Achievement.user_id == user_id).all()

@app.post("/transactions/{user_id}")
def add_transaction(user_id: str, transaction: TransactionCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    if not user.accounts: raise HTTPException(status_code=404, detail="No accounts found")
    account = user.accounts[0]

    new_tx = Transaction(
        user_id=user_id, account_id=account.id, amount=transaction.amount,
        category=transaction.category, merchant_name=transaction.merchant_name, date=transaction.date
    )
    account.balance += transaction.amount
    db.add(new_tx)
    db.commit()
    return {"message": "Transaction added", "new_balance": account.balance}

# --- 🏦 BANK SIMULATOR (Live Sync) ---
@app.post("/bank/sync/{user_id}")
def sync_bank_account(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's account or create one
    if not user.accounts:
        account = Account(user_id=user.id, institution_name="GTBank", account_type="Savings", balance=0.0)
        db.add(account)
        db.commit()
        db.refresh(account)
    else:
        account = user.accounts[0]
    
    # 1. Simulate finding new transactions at the bank
    potential_transactions = [
        ("Jumia Nigeria", "Shopping", -15000),
        ("Uber Trip", "Transport", -2500),
        ("Chicken Republic", "Food", -3500),
        ("Apple Music", "Bills", -1000),
        ("Salary Deposit", "Salary", 250000),
        ("Total Energies", "Transport", -12000),
        ("FilmHouse Cinema", "Entertainment", -6000),
        ("Transfer from Abiola", "Gift", 5000)
    ]
    
    # Randomly pick 3 to 6 new transactions
    new_txs_count = random.randint(3, 6)
    synced_data = []
    
    for _ in range(new_txs_count):
        merchant, category, amount = random.choice(potential_transactions)
        
        # Add slight variance to amount for realism
        if amount < 0:
            final_amount = amount + random.randint(-500, 0)
        else:
            final_amount = amount
            
        # Date is recently
        date = datetime.utcnow() - timedelta(days=random.randint(0, 5))
        
        tx = Transaction(
            user_id=user.id,
            account_id=account.id,
            amount=float(final_amount),
            category=category,
            merchant_name=merchant,
            date=date
        )
        
        # Update balance
        account.balance += final_amount
        db.add(tx)
        synced_data.append(tx)
        
    db.commit()
    
    return {
        "message": f"Successfully synced {new_txs_count} new transactions from {account.institution_name}.",
        "new_balance": account.balance,
        "synced_count": new_txs_count
    }

@app.post("/chat/{user_id}")
def chat_agent(user_id: str, request: ChatRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user: return {"response": "I can't find your user profile!"}

    total_balance = sum(acc.balance for acc in user.accounts)
    recent_txs = db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.date.desc()).limit(20).all()
    tx_history = "\n".join([f"- {tx.date.strftime('%Y-%m-%d')}: {tx.merchant_name} ({tx.category}) - ₦{tx.amount:,.2f}" for tx in recent_txs]) if recent_txs else "No recent transactions."

    system_instruction = f"You are SmartMoney assistant for {user.full_name}. Balance: ₦{total_balance:,.2f}. Transactions: {tx_history}. User asks: '{request.message}'"

    try:
        available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        if not available_models: return {"response": "⚠️ No available AI models."}
        # Pick first available text model
        model_name = available_models[0]
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(system_instruction)
        return {"response": response.text.replace("**", "").replace("*", "-")}
    except Exception as e:
        return {"response": f"⚠️ Error: {str(e)}"}

@app.post("/scan-receipt")
async def scan_receipt(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(BytesIO(contents))
        
        # Determine model
        available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        if not available_models: return {"error": "No AI models available."}
        
        # Prefer flash for vision, fallback to first available
        model_name = 'gemini-1.5-flash' if 'models/gemini-1.5-flash' in available_models else available_models[0]
        
        prompt = "Extract receipt data as raw JSON keys: merchant_name, total_amount, date, category. No markdown."
        
        model = genai.GenerativeModel(model_name)
        response = model.generate_content([prompt, image])
        
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text)
    except Exception as e:
        print(f"Scan Error: {e}")
        return {"error": str(e)}