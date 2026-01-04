import React, { useState, useEffect, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  MessageSquare,
  Home,
  CreditCard,
  Camera,
  Settings,
  Send,
  Plus,
  TrendingUp,
  AlertCircle,
  Search,
  Menu,
  X,
  Target,
  ChevronRight,
  Loader,
  Check,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Award,
  User,
  Bell,
  Shield,
  Zap,
  LogOut,
  Upload,
  Moon,
  Sun,
  CreditCard as CardIcon,
  Lock,
  Mail,
  RefreshCw,
} from "lucide-react";

// --- CONFIGURATION ---
const API_URL = "http://127.0.0.1:8000";

// --- Default Data ---
const weeklySpending = [
  { day: "Mon", amount: 4500 },
  { day: "Tue", amount: 3200 },
  { day: "Wed", amount: 8900 },
  { day: "Thu", amount: 1500 },
  { day: "Fri", amount: 12000 },
  { day: "Sat", amount: 15500 },
  { day: "Sun", amount: 6000 },
];

const spendingData = [
  { name: "Food", value: 45000, color: "#10B981" },
  { name: "Transport", value: 12000, color: "#3B82F6" },
  { name: "Shopping", value: 25000, color: "#F59E0B" },
  { name: "Bills", value: 30000, color: "#EC4899" },
];

const mockTransactions = [
  {
    id: 1,
    title: "Uber Ride",
    date: "2025-10-26",
    amount: -2500,
    type: "expense",
    category: "Transport",
  },
  {
    id: 2,
    title: "Shoprite Grocery",
    date: "2025-10-25",
    amount: -15400,
    type: "expense",
    category: "Food",
  },
];

const mockSubscriptions = [
  {
    id: 1,
    name: "Netflix Premium",
    price: 4500,
    due_date: "Oct 23",
    cycle: "Monthly",
    logo_text: "N",
    color: "bg-red-600",
  },
  {
    id: 2,
    name: "Spotify Duo",
    price: 1900,
    due_date: "Nov 01",
    cycle: "Monthly",
    logo_text: "S",
    color: "bg-green-500",
  },
];

const mockAchievements = [
  {
    id: 1,
    title: "Savings Ninja",
    description: "Save 20% of income",
    progress: 100,
    completed: true,
    icon_type: "Zap",
    color_class: "text-yellow-500 bg-yellow-100",
  },
];

// --- Components ---

// Custom Logo Component (Modern Tech-S)
const AppLogo = ({ className }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="logoGradient"
        x1="0"
        y1="0"
        x2="100"
        y2="100"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#10B981" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* Background Shape */}
    <rect width="100" height="100" rx="28" fill="url(#logoGradient)" />

    {/* Abstract S Path */}
    <path
      d="M70 30H45C36.7157 30 30 36.7157 30 45C30 53.2843 36.7157 60 45 60H55C63.2843 60 70 66.7157 70 75C70 83.2843 63.2843 90 55 90H30"
      stroke="white"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
    />

    {/* Tech Nodes */}
    <circle cx="70" cy="30" r="7" fill="white" />
    <circle cx="30" cy="90" r="7" fill="white" />

    {/* Digital Spark */}
    <path
      d="M65 25L75 15"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.6"
    />
    <path
      d="M78 28L85 22"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const endpoint = isLogin ? "login" : "register";

    try {
      const url = `${API_URL}/auth/${endpoint}`;
      const body = isLogin
        ? { email, password }
        : { email, password, full_name: fullName };
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        onAuthSuccess(data.user_id);
      } else {
        setError(data.detail || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      if (err.message && err.message.includes("Failed to fetch")) {
        if (window.confirm("Backend unreachable. Use Offline Demo Mode?"))
          onAuthSuccess("offline-demo");
        else setError("Connection failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center p-2">
            <AppLogo className="w-full h-full drop-shadow-lg" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            SmartMoney
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            {isLogin
              ? "Welcome back! Please sign in."
              : "Create an account to start saving."}
          </p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-rose-100 text-rose-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" />
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="ml-2 text-emerald-500 font-bold hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const AddTransactionModal = ({
  isOpen,
  onClose,
  userId,
  onTransactionAdded,
  initialData,
}) => {
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("Food");
  const [customCategory, setCustomCategory] = useState("");
  const [type, setType] = useState("expense");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.total_amount || "");
      setMerchant(initialData.merchant_name || "");
      const defaultCats = [
        "Food",
        "Transport",
        "Bills",
        "Shopping",
        "Salary",
        "Entertainment",
      ];
      const scannedCat = initialData.category || "Food";
      if (defaultCats.includes(scannedCat)) {
        setCategory(scannedCat);
      } else {
        setCategory("Other");
        setCustomCategory(scannedCat);
      }
      setType("expense");
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalAmount =
      type === "expense"
        ? -Math.abs(parseFloat(amount))
        : Math.abs(parseFloat(amount));
    const finalCategory = category === "Other" ? customCategory : category;

    if (userId === "offline-demo") {
      alert("Transaction simulated (Offline Mode)");
      onTransactionAdded();
      onClose();
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          merchant_name: merchant,
          category: finalCategory,
          date: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        onTransactionAdded();
        onClose();
        setAmount("");
        setMerchant("");
        setCustomCategory("");
        setCategory("Food");
      } else {
        alert("Failed to add transaction");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Error connecting to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Add Transaction
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`py-2 rounded-lg text-sm font-bold transition-all ${
                type === "expense"
                  ? "bg-white dark:bg-slate-600 text-rose-500 shadow-sm"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`py-2 rounded-lg text-sm font-bold transition-all ${
                type === "income"
                  ? "bg-white dark:bg-slate-600 text-emerald-500 shadow-sm"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Income
            </button>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                ₦
              </span>
              <input
                required
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-8 pr-4 font-bold text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Merchant / Title
            </label>
            <input
              required
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Shoprite, Uber"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Bills</option>
              <option>Shopping</option>
              <option>Salary</option>
              <option>Entertainment</option>
              <option>Other</option>
            </select>
          </div>
          {category === "Other" && (
            <div className="animate-fade-in">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                Specify Category
              </label>
              <input
                required
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Health, Education"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              "Save Transaction"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout }) => {
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Overview" },
    { id: "chat", icon: MessageSquare, label: "Ask AI" },
    { id: "transactions", icon: CreditCard, label: "Transactions" },
    { id: "subscriptions", icon: Calendar, label: "Subscriptions" },
    { id: "achievements", icon: Award, label: "Achievements" },
    { id: "scan", icon: Camera, label: "Scan Receipt" },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 dark:bg-slate-950 text-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 flex flex-col border-r border-slate-800`}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-emerald-400">
          <AppLogo className="w-8 h-8 drop-shadow-sm" />
          SmartMoney
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-slate-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === item.id
                ? "bg-emerald-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => {
            setActiveTab("settings");
            setIsOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
            activeTab === "settings"
              ? "text-emerald-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:text-rose-300 hover:bg-rose-900/20 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

const BudgetGoalCard = ({ userId, onBalanceUpdate }) => {
  const [savedAmount, setSavedAmount] = useState(() => {
    const saved = localStorage.getItem("savings_amount");
    return saved ? parseFloat(saved) : 150000;
  });
  const targetAmount = 300000;
  const [isAdding, setIsAdding] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [source, setSource] = useState("wallet");

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!amountToAdd) return;
    const value = parseFloat(amountToAdd);
    if (isNaN(value) || value <= 0) return;

    if (userId === "offline-demo") {
      const newAmount = Math.min(savedAmount + value, targetAmount);
      setSavedAmount(newAmount);
      localStorage.setItem("savings_amount", newAmount.toString());
      setAmountToAdd("");
      setIsAdding(false);
      if (source === "wallet" && onBalanceUpdate) onBalanceUpdate();
      return;
    }

    if (source === "wallet") {
      try {
        const response = await fetch(`${API_URL}/transactions/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: -value,
            merchant_name: "Savings Goal: Holiday",
            category: "Savings",
            date: new Date().toISOString(),
          }),
        });
        if (response.ok) {
          if (onBalanceUpdate) onBalanceUpdate();
        } else {
          alert("Failed to transfer from wallet. Check connection.");
          return;
        }
      } catch (error) {
        console.error("Transfer error:", error);
        return;
      }
    }
    const newAmount = Math.min(savedAmount + value, targetAmount);
    setSavedAmount(newAmount);
    localStorage.setItem("savings_amount", newAmount.toString());
    setAmountToAdd("");
    setIsAdding(false);
  };

  const progress = Math.min((savedAmount / targetAmount) * 100, 100);

  return (
    <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[60px] opacity-20"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
              <Target size={20} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Saving for</p>
              <h3 className="font-bold text-lg">Holiday 🎄</h3>
            </div>
          </div>
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors"
            >
              + Add
            </button>
          ) : (
            <button
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          )}
        </div>
        {isAdding && (
          <form onSubmit={handleAddFunds} className="mb-4 animate-fade-in">
            <div className="flex gap-2 items-center mb-2">
              <input
                type="number"
                autoFocus
                placeholder="Amount"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(e.target.value)}
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                Save
              </button>
            </div>
            <div className="flex gap-3 text-[10px] text-slate-400 px-1">
              <label className="flex items-center gap-1 cursor-pointer hover:text-white">
                <input
                  type="radio"
                  name="source"
                  checked={source === "wallet"}
                  onChange={() => setSource("wallet")}
                  className="accent-emerald-500"
                />
                From Wallet
              </label>
              <label className="flex items-center gap-1 cursor-pointer hover:text-white">
                <input
                  type="radio"
                  name="source"
                  checked={source === "external"}
                  onChange={() => setSource("external")}
                  className="accent-emerald-500"
                />
                External Deposit
              </label>
            </div>
          </form>
        )}
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-bold">
            ₦{(savedAmount / 1000).toFixed(0)}k
          </span>
          <span className="text-slate-400 text-sm mb-1">
            / ₦{(targetAmount / 1000).toFixed(0)}k
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3 mb-2">
          <div
            className="bg-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-400 text-right">
          {progress.toFixed(0)}% Reached
        </p>
      </div>
    </div>
  );
};

const ReceiptScanner = ({ onScanComplete }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };
  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(`${API_URL}/scan-receipt`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.error) {
        alert("Scan failed: " + data.error);
      } else {
        onScanComplete(data);
      }
    } catch (error) {
      console.error("Scan error:", error);
      alert("Could not connect to scanner service");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
      {!preview ? (
        <div className="flex flex-col items-center text-center max-w-md animate-fade-in">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 shadow-inner">
            <Camera size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Scan your Receipt
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Upload a photo of your receipt. Our AI will extract the details.
          </p>
          <label className="bg-slate-900 dark:bg-slate-700 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl cursor-pointer hover:scale-105 transition-all flex items-center gap-2">
            <Upload size={20} />
            <span>Select Photo</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col items-center animate-fade-in">
          <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden shadow-xl mb-6">
            <img
              src={preview}
              alt="Receipt"
              className="w-full h-full object-contain"
            />
            {isScanning && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                <Loader className="animate-spin mb-4" size={48} />
                <p className="font-bold text-lg animate-pulse">
                  AI is reading receipt...
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-4 w-full">
            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors"
            >
              {isScanning ? "Scanning..." : "Extract Data"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ setActiveTab, userId, prefillData, darkMode }) => {
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState("User");
  const [recentTx, setRecentTx] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false); // State for sync button

  const fetchData = () => {
    // Only set loading on initial load, not refreshes
    if (balance === 0) setIsLoading(true);

    if (userId === "offline-demo") {
      setBalance(452000);
      setUserName("John (Offline)");
      setRecentTx(mockTransactions);
      setIsLoading(false);
      return;
    }

    if (userId === "678f677a-51ab-46d3-a3d2-bf572faeaa39E") {
      setBalance(452000);
      setUserName("John (Mock)");
      setIsLoading(false);
      return;
    }
    fetch(`${API_URL}/dashboard/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.total_balance);
        setUserName(data.user.split(" ")[0]);
        setRecentTx(data.recent_transactions || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data:", err);
        // Fallback to offline mode on error to prevent broken UI
        setBalance(452000);
        setUserName("Offline Mode");
        setRecentTx(mockTransactions);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (prefillData) {
      setIsModalOpen(true);
    }
  }, [prefillData]);

  // Handle Bank Sync
  const handleSyncBank = async () => {
    if (userId === "offline-demo") {
      alert("Bank sync simulated! (Offline Mode)");
      setBalance((prev) => prev + 5000);
      return;
    }
    setIsSyncing(true);
    try {
      const response = await fetch(`${API_URL}/bank/sync/${userId}`, {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message); // In real app, use a toast notification
        fetchData(); // Refresh data to show new balance
      } else {
        alert("Sync failed: " + data.detail);
      }
    } catch (e) {
      console.error(e);
      alert("Connection error");
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading && !balance)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  const totalSpending = spendingData.reduce((acc, curr) => acc + curr.value, 0);

  // Dynamic tooltip style based on darkMode
  const tooltipStyle = darkMode
    ? {
        backgroundColor: "#1e293b",
        border: "1px solid #334155",
        borderRadius: "8px",
        color: "#fff",
      }
    : {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        color: "#1e293b",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
        onTransactionAdded={fetchData}
        initialData={prefillData}
      />
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Good Morning, {userName}! ☀️
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Here's your money overview.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Sync Bank Button */}
          <button
            onClick={handleSyncBank}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full shadow-lg transition-transform active:scale-95 font-bold disabled:opacity-70"
          >
            <RefreshCw size={20} className={isSyncing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">
              {isSyncing ? "Syncing..." : "Sync Bank"}
            </span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-lg transition-transform active:scale-95 font-bold"
          >
            <Plus size={20} />
            <span>Add Money</span>
          </button>
          <button
            onClick={() => setActiveTab("scan")}
            className="flex items-center gap-2 bg-slate-900 dark:bg-slate-700 text-white px-5 py-2.5 rounded-full shadow-lg"
          >
            <Camera size={18} />
            <span>Scan</span>
          </button>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-emerald-100 font-medium mb-1">Total Balance</p>
          <h2 className="text-3xl font-bold">₦ {balance.toLocaleString()}</h2>
        </div>
        <BudgetGoalCard userId={userId} onBalanceUpdate={fetchData} />
        <div
          className="bg-indigo-50 dark:bg-slate-800 rounded-2xl p-6 border border-indigo-100 dark:border-slate-700 cursor-pointer"
          onClick={() => setActiveTab("subscriptions")}
        >
          <div className="flex gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg h-fit">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900 dark:text-indigo-200">
                Subscription Alert
              </h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                Netflix price hike detected.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6">
            Weekly Activity
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySpending}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <YAxis hide />
                <RechartsTooltip
                  contentStyle={tooltipStyle}
                  cursor={{
                    fill: darkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                  }}
                />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-2">
            Expenses
          </h3>
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={tooltipStyle} />
                <Pie
                  data={spendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {spendingData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-700 dark:text-white">
                {spendingData.length}
              </span>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {spendingData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-slate-600 dark:text-slate-400">
                    {item.name}
                  </span>
                </div>
                <span className="font-medium text-slate-800 dark:text-white">
                  {((item.value / totalSpending) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white">
            Recent Transactions
          </h3>
          <button
            onClick={() => setActiveTab("transactions")}
            className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:text-emerald-700 flex items-center gap-1"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-700">
          {recentTx.length > 0 ? (
            recentTx.map((tx) => (
              <div
                key={tx.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === "income"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                    }`}
                  >
                    {tx.type === "income" ? (
                      <Plus size={20} />
                    ) : (
                      <CreditCard size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">
                      {tx.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {tx.date} • {tx.category}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-bold ${
                    tx.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-800 dark:text-white"
                  }`}
                >
                  {tx.type === "income" ? "+" : ""}₦
                  {Math.abs(tx.amount).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400">
              No transactions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- CHAT ASSISTANT ---
const ChatAssistant = ({ userId }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hi! I can see your transactions. Ask me anything!",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    if (userId === "offline-demo") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: "I am in offline mode, so I can't reach the real AI brain right now. But I'm listening!",
          },
        ]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/chat/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: data.response },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: "Connection failed." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center gap-3">
        <MessageSquare size={20} className="text-emerald-500" />
        <span className="font-bold text-slate-800 dark:text-white">
          SmartMoney AI
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-slate-900 dark:bg-emerald-600 text-white rounded-br-none"
                  : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-600 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-slate-400 text-xs ml-4">AI is typing...</div>
        )}
        <div ref={scrollRef}></div>
      </div>
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border dark:border-slate-600 rounded-xl px-4 py-2 bg-white dark:bg-slate-700 dark:text-white"
            placeholder="Ask AI..."
          />
          <button className="bg-emerald-500 text-white p-2 rounded-xl">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Transaction History ---
const TransactionHistory = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId === "PASTE_YOUR_ID_HERE") {
      setIsLoading(false);
      return;
    }

    if (userId === "offline-demo") {
      setTransactions(mockTransactions);
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/dashboard/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.recent_transactions || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch transactions:", err);
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin text-emerald-500" size={48} />
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-full overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Transaction History
          </h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400">
              <Filter size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pr-2">
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors border border-slate-100 dark:border-slate-700/50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        tx.type === "income"
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
                          : "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400"
                      }`}
                    >
                      {tx.type === "income" ? (
                        <ArrowDownRight size={24} />
                      ) : (
                        <ArrowUpRight size={24} />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">
                        {tx.title}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {tx.date} • {tx.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`block font-bold text-lg ${
                        tx.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-800 dark:text-white"
                      }`}
                    >
                      {tx.type === "income" ? "+" : ""}₦
                      {Math.abs(tx.amount).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 capitalize bg-white dark:bg-slate-700 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-600">
                      {tx.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <Search
                  size={32}
                  className="text-slate-300 dark:text-slate-500"
                />
              </div>
              <p>No transactions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Subscription Manager (Live) ---
const SubscriptionManager = ({ userId }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId === "PASTE_YOUR_ID_HERE") {
      setIsLoading(false);
      return;
    }

    if (userId === "offline-demo") {
      setSubscriptions(mockSubscriptions);
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/subscriptions/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setSubscriptions(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching subscriptions:", err);
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-32">
        <Loader className="animate-spin text-emerald-500" />
      </div>
    );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden p-6">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
        Active Subscriptions
      </h2>
      <div className="space-y-4">
        {subscriptions.length > 0 ? (
          subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex justify-between items-center border-b dark:border-slate-700 pb-2"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    sub.color || "bg-blue-500"
                  }`}
                >
                  {sub.logo_text}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">
                    {sub.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {sub.cycle} • Due {sub.due_date}
                  </p>
                </div>
              </div>
              <span className="font-bold text-slate-800 dark:text-white">
                ₦{sub.price.toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <CardIcon size={48} className="mx-auto mb-3 opacity-20" />
            <p>No active subscriptions linked.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Achievements (Live) ---
const Achievements = ({ userId }) => {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId === "PASTE_YOUR_ID_HERE") {
      setIsLoading(false);
      return;
    }

    if (userId === "offline-demo") {
      setAchievements(mockAchievements);
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/achievements/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setAchievements(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching achievements:", err);
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-32">
        <Loader className="animate-spin text-emerald-500" />
      </div>
    );

  const getIcon = (type) => {
    if (type === "Zap") return <Zap />;
    if (type === "Target") return <Target />;
    if (type === "Shield") return <Shield />;
    return <Award />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
          Achievements
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Level up your financial game!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievements.length > 0 ? (
          achievements.map((a) => (
            <div
              key={a.id}
              className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border dark:border-slate-700 text-center relative overflow-hidden ${
                a.completed ? "border-emerald-500 ring-1 ring-emerald-500" : ""
              }`}
            >
              {a.completed && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">
                  EARNED
                </div>
              )}
              <div
                className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full mb-4 text-xl ${a.color_class}`}
              >
                {getIcon(a.icon_type)}
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white">
                {a.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                {a.description}
              </p>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    a.completed
                      ? "bg-emerald-500"
                      : "bg-slate-300 dark:bg-slate-500"
                  }`}
                  style={{ width: `${a.progress}%` }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Award size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
              No Achievements Yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Start saving to unlock badges!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Settings Page ---
const SettingsPage = ({ darkMode, setDarkMode }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-10">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
        Settings
      </h2>
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <User size={20} className="text-slate-400" /> Profile
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
              JD
            </div>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
              Change Photo
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue="john.doe@example.com"
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Settings size={20} className="text-slate-400" /> App Preferences
          </h3>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-700">
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <div>
              <p className="font-medium text-slate-800 dark:text-white text-sm">
                Dark Mode
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch between light and dark themes
              </p>
            </div>
            <div
              className="w-14 h-8 bg-slate-200 dark:bg-emerald-600 rounded-full relative cursor-pointer transition-colors flex items-center px-1"
              onClick={() => setDarkMode(!darkMode)}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full absolute transition-all transform duration-300 flex items-center justify-center shadow-md ${
                  darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              >
                {darkMode ? (
                  <Moon size={14} className="text-emerald-600" />
                ) : (
                  <Sun size={14} className="text-orange-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // --- AUTH STATE & LOGIC ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  // Check for existing login on start
  useEffect(() => {
    const storedUserId = localStorage.getItem("smartmoney_userid");
    if (storedUserId) {
      setUserId(storedUserId);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = (newUserId) => {
    setUserId(newUserId);
    setIsAuthenticated(true);
    localStorage.setItem("smartmoney_userid", newUserId);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem("smartmoney_userid");
  };

  const handleScanComplete = (data) => {
    setScannedData(data);
    setActiveTab("dashboard");
  };

  // If not logged in, show Auth Page
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogout={handleLogout}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-600 dark:text-slate-300"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-800 dark:text-white">
            SmartMoney
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600"></div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {activeTab === "dashboard" && (
              <Dashboard
                setActiveTab={setActiveTab}
                userId={userId}
                prefillData={scannedData}
                darkMode={darkMode}
              />
            )}
            {activeTab === "chat" && <ChatAssistant userId={userId} />}
            {activeTab === "transactions" && (
              <TransactionHistory userId={userId} />
            )}
            {activeTab === "scan" && (
              <ReceiptScanner onScanComplete={handleScanComplete} />
            )}
            {activeTab === "subscriptions" && (
              <SubscriptionManager userId={userId} />
            )}
            {activeTab === "achievements" && <Achievements userId={userId} />}
            {activeTab === "settings" && (
              <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
