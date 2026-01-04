import sys

# DEBUG: Print immediately to confirm script is running
print("🚀 Starting seed script...")

try:
    from main import SessionLocal, User, Account, Transaction, Subscription, Achievement, engine, Base
    from datetime import datetime, timedelta
    import random
    print("✅ Imports successful. Connecting to database...")
except Exception as e:
    print(f"❌ Error during imports: {e}")
    sys.exit(1)

# Ensure tables exist
try:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    print("✅ Database connection established.")
except Exception as e:
    print(f"❌ Database Error: {e}")
    sys.exit(1)

# Check if we already have data
existing_user = db.query(User).filter(User.email == "demo@example.com").first()

if existing_user:
    # If user exists, we just want to add subs/achievements if they are missing
    user = existing_user
    print(f"👤 User found: {user.full_name}")
else:
    # Create User
    user = User(email="demo@example.com", password_hash="hashed", full_name="Demo User", currency_pref="₦")
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create Account
    account = Account(user_id=user.id, institution_name="GTBank", account_type="Savings", balance=450000.0)
    db.add(account)
    db.commit()

# --- SEED SUBSCRIPTIONS ---
# Check if user has subscriptions, if not add them
if not db.query(Subscription).filter(Subscription.user_id == user.id).first():
    print("🌱 Seeding Subscriptions...")
    subs_data = [
        {"name": "Netflix Premium", "price": 4500, "due": "Oct 23", "cycle": "Monthly", "logo": "N", "color": "bg-red-600"},
        {"name": "Spotify Duo", "price": 1900, "due": "Nov 01", "cycle": "Monthly", "logo": "S", "color": "bg-green-500"},
        {"name": "Spectranet", "price": 21000, "due": "Oct 30", "cycle": "Monthly", "logo": "Sp", "color": "bg-blue-600"},
        {"name": "Apple Music", "price": 1000, "due": "Nov 15", "cycle": "Monthly", "logo": "A", "color": "bg-pink-500"},
        {"name": "DSTV Premium", "price": 29500, "due": "Nov 05", "cycle": "Monthly", "logo": "D", "color": "bg-sky-500"},
        {"name": "YouTube Prem", "price": 1100, "due": "Nov 20", "cycle": "Monthly", "logo": "Y", "color": "bg-red-500"},
        {"name": "Showmax", "price": 2900, "due": "Nov 10", "cycle": "Monthly", "logo": "Sh", "color": "bg-purple-600"},
        {"name": "iCloud+", "price": 900, "due": "Nov 02", "cycle": "Monthly", "logo": "iC", "color": "bg-blue-400"}
    ]
    for sub in subs_data:
        db.add(Subscription(
            user_id=user.id, name=sub["name"], price=sub["price"], 
            due_date=sub["due"], cycle=sub["cycle"], logo_text=sub["logo"], color=sub["color"]
        ))
    db.commit()
else:
    print("ℹ️ Subscriptions already exist.")

# --- SEED ACHIEVEMENTS ---
# Check if user has achievements, if not add them
if not db.query(Achievement).filter(Achievement.user_id == user.id).first():
    print("🌱 Seeding Achievements...")
    ach_data = [
        {"title": "Savings Ninja", "desc": "Save 20% of income", "progress": 100, "completed": True, "icon": "Zap", "color": "text-yellow-500 bg-yellow-100"},
        {"title": "Budget Boss", "desc": "Stay under budget", "progress": 65, "completed": False, "icon": "Target", "color": "text-emerald-500 bg-emerald-100"},
        {"title": "Debt Destroyer", "desc": "Pay off a loan", "progress": 0, "completed": False, "icon": "Shield", "color": "text-purple-500 bg-purple-100"},
        {"title": "Safety Net", "desc": "Save 3 months expenses", "progress": 40, "completed": False, "icon": "Shield", "color": "text-blue-500 bg-blue-100"},
        {"title": "Streak Master", "desc": "Login 7 days in a row", "progress": 85, "completed": False, "icon": "Zap", "color": "text-orange-500 bg-orange-100"},
        {"title": "Investor", "desc": "Open an investment account", "progress": 0, "completed": False, "icon": "Target", "color": "text-green-500 bg-green-100"}
    ]
    for ach in ach_data:
        db.add(Achievement(
            user_id=user.id, title=ach["title"], description=ach["desc"], 
            progress=ach["progress"], completed=ach["completed"], icon_type=ach["icon"], color_class=ach["color"]
        ))
    db.commit()
else:
    print("ℹ️ Achievements already exist.")

print(f"✅ Seeding Complete! User ID: {user.id}")
print(f"👉 Copy this ID if you need it: {user.id}")
db.close()