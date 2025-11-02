import os
import subprocess
import sys

backend_python = os.path.join("backend", ".venv", "Scripts", "python.exe")


procs = []

# ===== Backend =====
backend_cmd = [backend_python, "-m", "uvicorn", "src.app:app", "--reload", "--port", "8000"]
procs.append(subprocess.Popen(backend_cmd, cwd="backend"))

# ===== Frontend =====
fe_cmd = "npm install && npm start"
procs.append(subprocess.Popen(fe_cmd, cwd="frontend", shell=True))

try:
    for p in procs:
        p.wait()
except KeyboardInterrupt:
    for p in procs:
        p.terminate()
