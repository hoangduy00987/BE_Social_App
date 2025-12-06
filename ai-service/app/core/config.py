import os
from dotenv import load_dotenv
from pathlib import Path

# path tới file .env ở root FINALPROJECT
env_path = Path(__file__).resolve().parents[3] / ".env"


load_dotenv(dotenv_path=env_path)
class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    NEO4J_URI: str = os.getenv("NEO4J_URI")
    NEO4J_USER: str = os.getenv("NEO4J_USER", "neo4j")
    NEO4J_PASSWORD: str = os.getenv("NEO4J_PASSWORD", "password")

settings = Settings()
