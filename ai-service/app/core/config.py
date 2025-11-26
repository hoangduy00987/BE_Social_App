import os
from dotenv import load_dotenv
from pathlib import Path

# path tới file .env ở root FINALPROJECT
env_path = Path(__file__).resolve().parents[3] / ".env"


load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
