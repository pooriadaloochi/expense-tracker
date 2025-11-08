import os
import subprocess
import sys
import venv
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(BASE_DIR, "backend")
frontend_dir = os.path.join(BASE_DIR, "frontend")
venv_dir = os.path.join(backend_dir, ".venv")
python_in_venv = os.path.join(venv_dir, "Scripts", "python.exe")
requirements_path = os.path.join(backend_dir, "requirements.txt")

def run_cmd(cmd, cwd=None, shell=False):
    """اجرای دستور و چاپ خروجی به صورت زنده"""
    print(f"\n[CMD] {cmd} (cwd={cwd or os.getcwd()})\n" + "-"*70)
    process = subprocess.Popen(cmd, cwd=cwd, shell=shell)
    return process

# =====================================================================
# مرحله 1: ساخت venv اگر وجود ندارد
# =====================================================================
if not os.path.exists(python_in_venv):
    print("[SETUP] Virtual environment not found. Creating one in backend/.venv ...")
    venv.create(venv_dir, with_pip=True)
    print("[SETUP] Virtual environment created.")

# =====================================================================
# مرحله 2: نصب پکیج‌های backend
# =====================================================================
if os.path.exists(requirements_path):
    print(f"[SETUP] Installing backend dependencies from {requirements_path} ...")
    subprocess.check_call([python_in_venv, "-m", "pip", "install", "--upgrade", "pip"])
    subprocess.check_call([python_in_venv, "-m", "pip", "install", "-r", requirements_path])
else:
    print("[WARN] No requirements.txt found — installing minimal FastAPI + Uvicorn ...")
    subprocess.check_call([python_in_venv, "-m", "pip", "install", "fastapi", "uvicorn"])

# =====================================================================
# مرحله 3: نصب و اجرای frontend
# =====================================================================
if os.path.isdir(frontend_dir):
    print("[SETUP] Installing frontend dependencies (npm install) ...")
    subprocess.check_call("npm install", cwd=frontend_dir, shell=True)
else:
    print(f"[WARN] Frontend directory not found: {frontend_dir}")

# =====================================================================
# مرحله 4: اجرای همزمان backend و frontend
# =====================================================================
backend_cmd = [python_in_venv, "-m", "uvicorn", "src.app:app", "--reload", "--port", "8000"]
frontend_cmd = "npm start"

print("\n[START] Launching backend & frontend ...\n" + "="*70)

procs = []
procs.append(run_cmd(backend_cmd, cwd=backend_dir))
if os.path.isdir(frontend_dir):
    procs.append(run_cmd(frontend_cmd, cwd=frontend_dir, shell=True))

try:
    for p in procs:
        p.wait()
except KeyboardInterrupt:
    print("\n[EXIT] Shutting down...")
    for p in procs:
        p.terminate()
