from cart.models import Cart, CartItem
from catalog.models import Book


def get_cart(user_id):
    try:
        cart = Cart.objects.get(user_id=user_id)

        cart_items = cart.items.select_related("book").all()

        if not cart_items.exists():
            return {
                "success": True,
                "count": 0,
                "items": [],
                "total": 0,
                "message": "Your cart is empty."
            }

        items = []
        total = 0

        for cart_item in cart_items:
            subtotal = cart_item.book.price * cart_item.quantity

            items.append({
                "book_id": cart_item.book.id,
                "title": cart_item.book.title,
                "author": cart_item.book.author,
                "price": float(cart_item.book.price),
                "quantity": cart_item.quantity,
                "subtotal": float(subtotal),
            })

            total += subtotal

        return {
            "success": True,
            "count": len(items),
            "items": items,
            "total": float(total)
        }

    except Cart.DoesNotExist:
        return {
            "success": True,
            "count": 0,
            "items": [],
            "total": 0,
            "message": "Your cart is empty."
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def add_to_cart(user_id, book_id, quantity=1):
    try:
        cart = Cart.objects.get(user_id=user_id)

        if quantity < 1:
            return {
                "success":False,
                "message":"Quantity must be atleast 1"
            }

        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return {
                "success":False,
                "message":"Book not found"
            }

        if book.stock <= 0:
            return {
                "success":False,
                "message":f"{book.title} is currently out of stock"
            }

        cart_item = CartItem.objects.filter(cart=cart, book=book).first()

        if cart_item:
            new_quantity = cart_item.quantity + quantity


            if new_quantity > book.stock:
                return {
                    "success":False,
                    "message":f"Only {book.stock} copies of {book.title} available."
                }

            cart_item.quantity = new_quantity
            cart_item.save()

        else:
            if quantity > book.stock:
                return {
                    "success":False,
                    "message":f"Only copies of {book.title} available."
                }

            cart_item = CartItem.objects.create(cart=cart, book=book, quantity=quantity)

        subtotal = book.price * cart_item.quantity

        return {
            "success":True,
            "message":f"{book.title} added to your cart.",
            "item":{
                "book_id":book.id,
                "title":book.title,
                "price":float(book.price),
                "quantity":cart_item.quantity,
                "subtotal":float(subtotal)
            }
        }


    except Cart.DoesNotExist:
        return{
            "success":False,
            "message":"Cart not found"
        }

    except Exception as e:
        return {
            "success":False,
            "error":str(e)
        }
    
    
def update_cart_quantity(user_id, book_id, quantity):
    try:
        cart = Cart.objects.get(user_id=user_id)

        if quantity < 1:
            return {
                "success":False,
                "message":"Quantity must be atleast 1"
            }

        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return {
                "success":False,
                "message":"Book not found"
            }

        try:
            cart_item = CartItem.objects.get(cart=cart, book=book)
        except CartItem.DoesNotExist:
            return {
                "success":False,
                "message":f"{book.title} is not in your cart."
            }

        if quantity > book.stock:
            return {
                "success":False,
                "message":f"Only {book.stock} copies of {book.title} available."
            }

        cart_item.quantity = quantity
        cart_item.save()

        subtotal = book.price * quantity

        return {
            "success": True,
            "message":f"Cart updated, {book.title} quantity is now {quantity}.",
            "item":{
                "book_id":book.id,
                "title":book.title,
                "price":float(book.price),
                "quantity":quantity,
                "subtotal":float(subtotal)
            }
        }

    except Cart.DoesNotExist:
        return {
            "success":False,
            "message":"Cart not found."
        }

    except Exception as e:
        return {
            "success":False,
            "error":str(e)
        }
    

def remove_from_cart(user_id, book_id):
    try:
        cart = Cart.objects.get(user_id=user_id)

        try:
            cart_item = CartItem.objects.get(cart=cart, book_id=book_id)
        except CartItem.DoesNotExist:
            return {
                "success":False,
                "message":"This book is not in your cart."
            }
        
        book_title = cart_item.book.title
        book_id = cart_item.book.id

        print("REMOVE CART")
        print("USER ID:", user_id)
        print("BOOK ID:", book_id)

        cart_item.delete()

        return {
            "success":True,
            "message":f"{book_title} has been removed from your cart.",
            "book_id":book_id
        }

    except Cart.DoesNotExist:
        return {
            "success":False,
            "message":"Cart not found"
        }

    except Exception as e:
        return {
            "success":False,
            "error":str(e)
        }
    
