from django.db.models import Q
from catalog.models import Book


def search_book(query=None, category=None, max_price=None):

    try:

        books = Book.objects.all()

        # --------------------------------
        # Category filter
        # --------------------------------

        if category:
            books = books.filter(
                genre__name__iexact=category
            )

        # --------------------------------
        # Text search
        # --------------------------------

        if query:
            books = books.filter(
                Q(title__icontains=query) |
                Q(author__icontains=query) |
                Q(description__icontains=query)
            )

        # --------------------------------
        # Price filter
        # --------------------------------

        if max_price is not None:
            books = books.filter(
                price__lte=max_price
            )

        books = books.distinct()

        # --------------------------------
        # Format results
        # --------------------------------

        result = []

        for book in books:

            result.append({
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "category": [
                    genre.name
                    for genre in book.genre.all()
                ],
                "price": float(book.price),
                "stock": book.stock,
            })

        # --------------------------------
        # No results
        # --------------------------------

        if not result:
            return {
                "success": True,
                "count": 0,
                "books": [],
                "message": "No books found matching the search criteria."
            }

        return {
            "success": True,
            "count": len(result),
            "books": result
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }

def get_book_detail(book_id):
    try:
        book = Book.objects.get(id=book_id)
        return {
            "success":True,
            "book_id":book.id,
            "title":book.title,
            "author":book.author,
            "category":[category.name for category in book.genre.all()],
            "price":float(book.price),
            "stock":book.stock,
            "description":book.description
        }
    except Book.DoesNotExist:
        return {
            "success":False,
            "error":f"Book of id #{book_id} not found."
            }


def check_book_stock(book_id):
    try:
        book = Book.objects.get(id=book_id)
        return {
            "success":True,
            "book_id": book.id,
            "stock": book.stock,
            "message":f"{book.stock} copies are currently available."
        }
    except Book.DoesNotExist:
        return {
            "success":False,
            "message":f"Book of id #{book_id} not found."
        }

def compare_books(book_ids):
    try:
        books = Book.objects.filter(id__in=book_ids)

        if not books.exists():
            return {
                "success":False,
                "error":"No book found."
                }

        result = []

        for book in books:
            result.append({
                "id":book.id,
                "title":book.title,
                "author":book.author,
                "category":[category.name for category in book.genre.all()],
                "price":float(book.price),
                "stock":book.stock
            })

        return {
            "success":True,
            "count":len(result),
            "books":result
        }
    except Exception as e:
        return {
            "success":False,
            "error":str(e)
        }



def get_recommendations(category=None, query=None, max_price=None):
    try:
        books = Book.objects.all()

        # Search by book topic/title/author/description
        if query:
            books = books.filter(
                Q(title__icontains=query) |
                Q(author__icontains=query) |
                Q(description__icontains=query)
            )

        # Filter by category
        if category:
            books = books.filter(
                genre__name__icontains=category
            )

        # Filter by maximum price
        if max_price is not None:
            books = books.filter(
                price__lte=max_price
            )

        # Remove duplicates caused by ManyToMany relationship
        books = books.distinct()

        # Only recommend books that are in stock
        books = books.filter(stock__gt=0)

        result = []

        for book in books:
            result.append({
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "category": [
                    category.name
                    for category in book.genre.all()
                ],
                "price": float(book.price),
                "stock": book.stock,
            })

        if not result:
            return {
                "success": True,
                "count": 0,
                "books": [],
                "message": "No books found matching the recommendation criteria."
            }

        return {
            "success": True,
            "count": len(result),
            "books": result
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }