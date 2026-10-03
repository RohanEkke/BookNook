from collections import Counter

from catalog.models import Book
from orders.models import Order


# =========================================================
# 1. GENERAL RECOMMENDATIONS
# =========================================================

def get_recommendations(
    genre=None,
    author=None,
    max_price=None,
    limit=5
):
    """
    Get general book recommendations based on optional filters.
    """

    books = Book.objects.filter(stock__gt=0)

    # Filter by genre name
    if genre:
        books = books.filter(
            genre__name__icontains=genre
        )

    # Filter by author
    if author:
        books = books.filter(
            author__icontains=author
        )

    # Filter by maximum price
    if max_price is not None:
        books = books.filter(
            price__lte=max_price
        )

    # ManyToMany joins can create duplicate books
    books = (
        books
        .distinct()
        .order_by("?")[:limit]
    )

    recommendations = []

    for book in books:
        recommendations.append({
            "book_id": book.id,
            "title": book.title,
            "author": book.author,
            "genres": list(
                book.genre.values_list("name", flat=True)
            ),
            "price": str(book.price),
            "stock": book.stock,
        })

    return {
        "success": True,
        "recommendations": recommendations,
        "count": len(recommendations),
    }


# =========================================================
# 2. PERSONALIZED RECOMMENDATIONS
# =========================================================

def get_personalized_recommendations(
    user_id,
    limit=5
):
    """
    Recommend books based on the user's last 5 orders.

    Logic:
    - Get latest 5 orders
    - Find books purchased in those orders
    - Count preferred genres
    - Count preferred authors
    - Exclude already purchased books
    - Return available books matching preferred genres
    """

    # Get user's latest 5 orders
    orders = (
        Order.objects
        .filter(user_id=user_id)
        .order_by("-created_at")[:5]
    )

    if not orders.exists():
        return {
            "success": True,
            "based_on_orders": 0,
            "message": "No previous orders found.",
            "recommendations": [],
            "count": 0,
        }

    purchased_book_ids = set()

    genres = Counter()
    authors = Counter()

    # Analyze purchased books
    for order in orders:

        items = order.items.select_related("book")

        for item in items:

            book = item.book

            # Remember purchased book
            purchased_book_ids.add(book.id)

            # Count every genre because Book.genre is ManyToMany
            for genre in book.genre.all():
                genres[genre.name] += item.quantity

            # Count author
            if book.author:
                authors[book.author] += item.quantity

    # Most preferred genres/authors
    preferred_genres = [
        genre
        for genre, count in genres.most_common()
    ]

    preferred_authors = [
        author
        for author, count in authors.most_common()
    ]

    # Start with books that are currently available
    books = (
        Book.objects
        .filter(stock__gt=0)
        .exclude(id__in=purchased_book_ids)
    )

    # Match preferred genres
    if preferred_genres:

        books = (
            books
            .filter(
                genre__name__in=preferred_genres
            )
            .distinct()
        )

    # Limit results
    books = books.order_by("?")[:limit]

    recommendations = []

    for book in books:

        recommendations.append({
            "book_id": book.id,
            "title": book.title,
            "author": book.author,
            "genres": list(
                book.genre.values_list("name", flat=True)
            ),
            "price": str(book.price),
            "stock": book.stock,
        })

    return {
        "success": True,

        "based_on_orders": len(orders),

        "preferred_genres": [
            {
                "genre": genre,
                "count": count,
            }
            for genre, count in genres.most_common()
        ],

        "preferred_authors": [
            {
                "author": author,
                "count": count,
            }
            for author, count in authors.most_common()
        ],

        "recommendations": recommendations,

        "count": len(recommendations),
    }


# =========================================================
# 3. SIMILAR BOOKS
# =========================================================

def get_similar_books(
    book_id,
    limit=5
):
    """
    Find books that share one or more genres
    with the selected book.
    """

    try:
        book = Book.objects.get(id=book_id)

    except Book.DoesNotExist:

        return {
            "success": False,
            "error": "Book not found.",
        }

    # Get genre IDs of the selected book
    book_genre_ids = book.genre.values_list(
        "id",
        flat=True
    )

    # Find other books sharing those genres
    similar_books = (
        Book.objects
        .filter(
            stock__gt=0,
            genre__id__in=book_genre_ids
        )
        .exclude(id=book.id)
        .distinct()
        .order_by("?")[:limit]
    )

    recommendations = []

    for similar_book in similar_books:

        recommendations.append({
            "book_id": similar_book.id,
            "title": similar_book.title,
            "author": similar_book.author,
            "genres": list(
                similar_book.genre.values_list(
                    "name",
                    flat=True
                )
            ),
            "price": str(similar_book.price),
            "stock": similar_book.stock,
        })

    return {
        "success": True,

        "source_book": {
            "book_id": book.id,
            "title": book.title,
            "author": book.author,
            "genres": list(
                book.genre.values_list(
                    "name",
                    flat=True
                )
            ),
        },

        "similar_books": recommendations,

        "count": len(recommendations),
    }