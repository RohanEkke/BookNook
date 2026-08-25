import os
import sys
import django

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

sys.path.insert(0, BASE_DIR)

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "bookstore_main.settings"
)

django.setup()

from catalog.models import Book, Genre

print("Django loaded successfully!")

# Get genres
mystery = Genre.objects.get(name="Mystery")
friction = Genre.objects.get(name="Fiction")
non_friction = Genre.objects.get(name="Non-Fiction")
sic_fi = Genre.objects.get(name="Sci-Fi")
biography = Genre.objects.get(name="Biography")
fantasy = Genre.objects.get(name="Fantasy")


books = [
    {
        "title": "The Silent Witness",
        "author": "Alex Morgan",
        "description": "A detective investigates a mysterious disappearance where the only witness refuses to speak. As hidden clues emerge, the case becomes more dangerous than anyone expected.",
        "price": 399.00,
        "stock": 25,
        "genres": [mystery],
    },
    {
        "title": "Murder at Midnight",
        "author": "Daniel Brooks",
        "description": "A murder inside an old mansion brings together a group of strangers, each hiding a secret. A determined detective must uncover the truth before another victim appears.",
        "price": 449.00,
        "stock": 18,
        "genres": [mystery],
    },
    {
        "title": "The Hidden Room",
        "author": "Emily Carter",
        "description": "When a young journalist discovers a locked room in an abandoned house, she begins investigating its strange history and uncovers a mystery that connects several missing people.",
        "price": 349.00,
        "stock": 30,
        "genres": [mystery, fantasy],
    },
    {
        "title": "Shadows on the Lake",
        "author": "Robert Hayes",
        "description": "A quiet lakeside town is disturbed by a series of unexplained events. A retired detective returns to solve a case that he thought he had left behind forever.",
        "price": 499.00,
        "stock": 20,
        "genres": [mystery],
    },

    {
        "title": "The Last Summer",
        "author": "Sarah Mitchell",
        "description": "A young woman returns to her hometown for one final summer and discovers that old friendships, forgotten memories, and unexpected relationships can change everything.",
        "price": 299.00,
        "stock": 40,
        "genres": [friction],
    },
    {
        "title": "Letters from Home",
        "author": "Michael Adams",
        "description": "A collection of heartfelt letters follows the lives of two people separated by distance. Their words reveal love, friendship, hope, and the importance of home.",
        "price": 329.00,
        "stock": 35,
        "genres": [friction],
    },
    {
        "title": "A Journey Between Us",
        "author": "Rachel Stone",
        "description": "Two strangers meet during a difficult journey and slowly discover that their different experiences have brought them together for a reason.",
        "price": 379.00,
        "stock": 28,
        "genres": [friction],
    },

    {
        "title": "The Power of Habits",
        "author": "James Anderson",
        "description": "This practical guide explores how everyday habits shape our lives and provides simple strategies for creating positive routines and breaking unhealthy patterns.",
        "price": 399.00,
        "stock": 50,
        "genres": [non_friction],
    },
    {
        "title": "Understanding the Mind",
        "author": "Laura Wilson",
        "description": "An accessible introduction to human psychology, emotions, decision making, and behavior designed for readers who want to better understand themselves and others.",
        "price": 429.00,
        "stock": 32,
        "genres": [non_friction],
    },
    {
        "title": "The Art of Better Decisions",
        "author": "Thomas Reed",
        "description": "Learn how to recognize common thinking mistakes and develop practical methods for making clearer and more effective decisions in everyday life.",
        "price": 459.00,
        "stock": 27,
        "genres": [non_friction],
    },

    {
        "title": "Beyond the Stars",
        "author": "Ethan Clarke",
        "description": "Humanity discovers a distant planet capable of supporting life. A small team of explorers travels across the galaxy and faces challenges that could change the future of civilization.",
        "price": 499.00,
        "stock": 22,
        "genres": [sic_fi],
    },
    {
        "title": "The Last Colony",
        "author": "Nathan Wright",
        "description": "The final human colony on Mars loses contact with Earth. A young engineer must uncover what happened before the colony's limited resources disappear.",
        "price": 479.00,
        "stock": 19,
        "genres": [sic_fi],
    },
    {
        "title": "Time Beyond Tomorrow",
        "author": "Olivia Grant",
        "description": "A scientist accidentally creates a device capable of sending memories into the future. What begins as an experiment soon threatens the course of human history.",
        "price": 529.00,
        "stock": 16,
        "genres": [sic_fi, fantasy],
    },

    {
        "title": "The Life of a Visionary",
        "author": "William Harris",
        "description": "The inspiring story of a visionary who overcame countless obstacles and transformed a small idea into a movement that influenced generations around the world.",
        "price": 399.00,
        "stock": 24,
        "genres": [biography],
    },
    {
        "title": "A Life of Courage",
        "author": "David Peterson",
        "description": "An inspiring biography following an individual's journey through hardship, personal sacrifice, and extraordinary achievements that changed the lives of many people.",
        "price": 449.00,
        "stock": 21,
        "genres": [biography],
    },
    {
        "title": "The Story of a Leader",
        "author": "James Collins",
        "description": "This biography explores the early struggles, important decisions, failures, and achievements of a leader whose ideas influenced society.",
        "price": 499.00,
        "stock": 17,
        "genres": [biography],
    },

    {
        "title": "The Kingdom of Dreams",
        "author": "Emma Richardson",
        "description": "A young traveler enters a magical kingdom hidden beyond the ordinary world and discovers that an ancient prophecy depends on her courage.",
        "price": 429.00,
        "stock": 31,
        "genres": [fantasy],
    },
    {
        "title": "The Enchanted Forest",
        "author": "Lucas Bennett",
        "description": "Deep inside an enchanted forest, a group of friends discovers magical creatures and an ancient secret that could determine the future of their world.",
        "price": 379.00,
        "stock": 26,
        "genres": [fantasy],
    },
    {
        "title": "The Dragon's Legacy",
        "author": "Christopher Young",
        "description": "A forgotten kingdom is threatened by an ancient dragon. A young hero discovers a mysterious connection to the creature and must decide the fate of both humans and dragons.",
        "price": 549.00,
        "stock": 14,
        "genres": [fantasy],
    },
    {
        "title": "The Forgotten Kingdom",
        "author": "Sophia Martin",
        "description": "A mysterious map leads an adventurer to a forgotten kingdom filled with ancient magic, hidden treasures, and powerful enemies determined to protect its secrets.",
        "price": 459.00,
        "stock": 23,
        "genres": [fantasy, mystery],
    },
]


for book_data in books:
    genres = book_data.pop("genres")

    book = Book.objects.create(**book_data)
    book.genre.set(genres)

    print(f"Created: {book.title}")


print(f"\nCreated {len(books)} books successfully!")