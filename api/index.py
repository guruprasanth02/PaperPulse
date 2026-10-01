import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import FastAPI
from backend.main import app as sub_app

app = FastAPI()

# Mount the sub-app at both /api and / to handle all rewrite configurations seamlessly
app.mount("/api", sub_app)
app.mount("/", sub_app)
