print("STEP 1: Script started", flush=True)
import os
import django
from dotenv import load_dotenv
from openai import OpenAI

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookstore_main.settings')
django.setup()

print("STEP 2: Django loaded", flush=True)

from django.conf import settings
print("STEP 3: Settings imported", flush=True)
print("Base URL:", repr(settings.BASE_URL))
print("API key loaded:", bool(settings.AI_CRED_KEY))


client = OpenAI(
    api_key=settings.AI_CRED_KEY,
    base_url=settings.BASE_URL,
)

print("STEP 4: Sending API request...", flush=True)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "Reply with OK"}
    ],
)

print("STEP 5: API response received", flush=True)
print(response.choices[0].message.content)