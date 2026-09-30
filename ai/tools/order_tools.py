from orders.models import Order, OrderItem, Shipment, ShipmentEvent, Refund, ReturnItem, ReturnRequest
from django.db import transaction

def get_user_orders(user_id):

    """ Get all orders belonging to the current user. """

    orders = Order.objects.filter(user_id=user_id).prefetch_related("items__book").order_by("-created_at")

    if not orders.exists():
        return {
            "success":True,
            "count":0,
            "orders":[],
            "message":"No orders found for this user."
        }

    order_data = []

    for order in orders:
        order_data.append({
            "order_id":order.id,
            "status":order.status,
            "patment_status":order.payment_status,
            "payment_method":order.payment_method,
            "total_amount":str(order.total_amount),
            "created_at":order.created_at.isoformat(),
        })

    return {
        "success":True,
        "count":len(order_data),
        "orders":order_data
    }


def get_order_details(user_id, order_id):

    """ Get complete details of a specific order. The order must belong to the current user. """

    try:
        order = Order.objects.select_related("address").prefetch_related("items__book").get(id=order_id, user_id=user_id)

    except Order.DoesNotExist:
        return {
            "success":False,
            "message":"Order not found"
        }

    items = []

    for item in order.items.all():
        items.append({
            "order_item_id":item.id,
            "book_id":item.book.id,
            "book_title":item.book.title,
            "quantity":item.quantity,
            "price":str(item.price),
            "subtotal":str(item.price * item.quantity)
        })
    return {
        "success":True,
        "order": {
            "order_id":order.id,
            "status":order.status,
            "payment_status":order.payment_status,
            "payment_method":order.payment_method,
            "total_amount":str(order.total_amount),
            "created_at":order.created_at.isoformat(),
            "updated_at":order.updated_at.isoformat(),
            "address":{
                "id":order.address.id,
                "name":getattr(order.address, "name", ""),
                "address_line":str(order.address)
            },
            "items":items,

        }
    }


def get_tracking_status(user_id, order_id):
    """ Get the current shipment/tracking status for the user's order. """

    try:
        order = Order.objects.get(
            id=order_id,
            user_id=user_id
        )

    except Order.DoesNotExist:
        return {
            "success":False,
            "message":"Order does not found."
        }

    try:
        shipment = order.shipment
    except Shipment.DoesNotExist:
        return {
            "success":False,
            "message":"Tracking information is not available for this order yet"
        }

    
    return {
        "success":True,
        "tracking": {
            "order_id":order.id,
            "courier_name":shipment.courier_name,
            "tracking_number":shipment.tracking_number,
            "tracking_url":shipment.tracking_url,
            "status":shipment.status,
            "estimated_delivery_date":(
                shipment.estimated_delivery_date.isoformat()
                if shipment.estimated_delivery_date
                else None
            ),
            "shipped_at":(
                shipment.shipped_at.isoformat()
                if shipment.shipped_at
                else None
            ),
            "delivered_at":(
                shipment.delivered_at.isoformat()
                if shipment.delivered_at
                else None
            ),

        }
        
    }


def get_tracking_history(user_id, order_id):
    """
    Get tracking event history for a user's order.
    """

    try:
        order = Order.objects.get(id=order_id, user_id=user_id)

    except Order.DoesNotExist:
        return {
            "status":False,
            "message":"Order not found"
        }

    try:
        shipment = order.shipment

    except Exception:
        return {
            "success":False,
            "message":"No shipment information available for for this order."
        }

    events = shipment.events.order_by("-event_time")

    history = []

    for event in events:
        history.append({
            "status":event.status,
            "location":event.location,
            "description":event.description,
            "event_time":event.event_time.isoformat(),
        })

    return {
        "success":True,
        "order_id":order.id,
        "tracking_number":shipment.tracking_number,
        "courier_name":shipment.courier_name,
        "history":history
    }


def check_return_eligibility(user_id, order_id, book_id, reason):
    """
    Check whether a book from an order is eligible for return.
    """

    # 1. Get user's order
    try:
        order = Order.objects.get(
            id=order_id,
            user_id=user_id
        )
    except Order.DoesNotExist:
        return {
            "success": False,
            "eligible": False,
            "message": "Order not found."
        }

    # 2. Order must be delivered
    if order.status != "delivered":
        return {
            "success": True,
            "eligible": False,
            "message": "The order must be delivered before a return can be requested."
        }

    # 3. Check book belongs to order
    order_item = order.items.filter(
        book_id=book_id
    ).first()

    if not order_item:
        return {
            "success": True,
            "eligible": False,
            "message": "This book is not part of this order."
        }

    # 4. Validate reason
    allowed_reasons = [
        "damaged",
        "defective",
        "wrong_item",
        "missing_pages",
        "other"
    ]

    if reason not in allowed_reasons:
        return {
            "success": True,
            "eligible": False,
            "message": "Invalid return reason."
        }

    # 5. Calculate already returned quantity
    already_returned_quantity = 0

    for return_request in order.returns.all():

        if return_request.status == "cancelled":
            continue

        for return_item in return_request.items.filter(
            order_item=order_item
        ):
            already_returned_quantity += return_item.quantity

    # 6. Calculate remaining quantity
    returnable_quantity = (
        order_item.quantity - already_returned_quantity
    )

    if returnable_quantity <= 0:
        return {
            "success": True,
            "eligible": False,
            "message": "This item has already been returned."
        }

    # 7. Return eligibility
    return {
        "success": True,
        "eligible": True,
        "message": "This item is eligible for return.",
        "order_id": order.id,
        "book_id": order_item.book.id,
        "book_title": order_item.book.title,
        "reason": reason,
        "ordered_quantity": order_item.quantity,
        "already_returned_quantity": already_returned_quantity,
        "returnable_quantity": returnable_quantity
    }


def get_refund_status(user_id, order_id):
    """
    Get refund status for a user's order.
    Read-only tool.
    """

    try:
        order = Order.objects.get(id=order_id, user_id=user_id)

    except Order.DoesNotExist:
        return {
            "success":False,
            "message":"Order not found"
        }

    refunds = (order.refunds.select_related("return_request").order_by("-created_at"))

    refund_list = []

    for refund in refunds:
        refund_list.append({

            "refund_id":refund.id,
            "amount":str(refund.amount),
            "status":refund.status,
            "payment_referance":refund.payment_referance,
            "return_id":(
                refund.return_request.id
                if refund.retuen_request
                else None
            ),
            "initiated_at":(
                refund.initiated_at.isoformat()
                if refund.return_request
                else None
            ),
            "completed_at":(
                refund.completed_at.isoformat()
                if refund.completed_at
                else None
            ),
            "created_at":refund.created_at.isoformat(),

        })
    return {
        "success":True,
        "order_id":order_id,
        "refund_count":len(refund_list),
        "refunds":refund_list
    }


def get_return_status(user_id, order_id):
    """
    Get return request status for a user's order.
    Read-only tool.
    """

    try:
        order = Order.objects.get(id=order_id, user_id=user_id)

    except Order.DoesNotExist:
        return {
            "success":False,
            "message":"Order not found"
        }

    return_requests = (
        order.returns.prefetch_related("items__order_item__book").order_by("-requested_at")
    )

    returns = []

    for return_request in return_requests:
        items = []

        for return_item in return_request.items.all():
            items.append({
                "book_id":return_item.order_item.book.id,
                "book_title":return_item.order_item.book.title,
                "quantity":return_item.quantity
            })

        returns.append({
            "return_id":return_request.id,
            "status":return_request.status,
            "reason":return_request.reason,
            "requested_at":return_request.requested_at.isoformat(),
            "updated_at":return_request.updated_at.isoformat(),
            "completed_at":(
                return_request.completed_at.isoformat()
                if return_request.completed_at
                else None
            ),
            "items":items,
        })

    return {
        "success":True,
        "order_id":order.id,
        "return_count":len(returns),
        "returns":returns
    }


def create_return_request(user_id, order_id, book_id, quantity, reason):
    """
    Create a return request for a book in a user's order.
    Write/action tool.
    """

    # -----------------------------------------
    # 1. Validate quantity
    # -----------------------------------------

    if quantity <= 0:
        return {
            "success": False,
            "message": "Return quantity must be greater than 0."
        }

    # -----------------------------------------
    # 2. Get user's order
    # -----------------------------------------

    try:
        order = Order.objects.get(
            id=order_id,
            user_id=user_id
        )
    except Order.DoesNotExist:
        return {
            "success": False,
            "message": "Order not found."
        }

    # -----------------------------------------
    # 3. Order must be delivered
    # -----------------------------------------

    if order.status != "delivered":
        return {
            "success": False,
            "message": "A return can only be requested after the order is delivered."
        }

    # -----------------------------------------
    # 4. Find book in order
    # -----------------------------------------

    order_item = order.items.filter(
        book_id=book_id
    ).first()

    if not order_item:
        return {
            "success": False,
            "message": "This book is not part of the specified order."
        }

    # -----------------------------------------
    # 5. Validate reason
    # -----------------------------------------

    allowed_reasons = [
        "damaged",
        "defective",
        "wrong_item",
        "missing_pages",
        "other",
    ]

    if reason not in allowed_reasons:
        return {
            "success": False,
            "message": (
                "Invalid return reason. "
                "Allowed reasons: damaged, defective, "
                "wrong_item, missing_pages, other."
            )
        }

    # -----------------------------------------
    # 6. Calculate already returned quantity
    # -----------------------------------------

    already_returned_quantity = 0

    for return_request in order.returns.all():

        # Cancelled returns don't count
        if return_request.status == "cancelled":
            continue

        for return_item in return_request.items.filter(
            order_item=order_item
        ):
            already_returned_quantity += return_item.quantity

    # -----------------------------------------
    # 7. Calculate remaining quantity
    # -----------------------------------------

    returnable_quantity = (
        order_item.quantity - already_returned_quantity
    )

    if returnable_quantity <= 0:
        return {
            "success": False,
            "message": "This item has already been fully returned."
        }

    # -----------------------------------------
    # 8. Check requested quantity
    # -----------------------------------------

    if quantity > returnable_quantity:
        return {
            "success": False,
            "message": (
                f"Only {returnable_quantity} item(s) "
                "are available for return."
            )
        }

    # -----------------------------------------
    # 9. Prevent duplicate active return
    # -----------------------------------------

    active_returns = order.returns.filter(
        status__in=[
            "requested",
            "approved",
            "pickup_scheduled",
            "picked_up",
            "received",
        ]
    )

    for return_request in active_returns:

        if return_request.items.filter(
            order_item=order_item
        ).exists():
            return {
                "success": False,
                "message": (
                    "There is already an active return request "
                    "for this item."
                )
            }

    # -----------------------------------------
    # 10. Create return atomically
    # -----------------------------------------

    with transaction.atomic():

        return_request = ReturnRequest.objects.create(
            order=order,
            user=order.user,
            reason=reason,
            status="requested",
        )

        ReturnItem.objects.create(
            return_request=return_request,
            order_item=order_item,
            quantity=quantity,
        )

    # -----------------------------------------
    # 11. Return result
    # -----------------------------------------

    return {
        "success": True,
        "message": "Return request created successfully.",
        "return_id": return_request.id,
        "order_id": order.id,
        "book_id": order_item.book.id,
        "book_title": order_item.book.title,
        "quantity": quantity,
        "reason": reason,
        "status": return_request.status,
    }


def cancel_return_request(user_id, return_id):
    """
    Cancel a user's return request.
    Write/action tool.
    """

    # -----------------------------------------
    # 1. Find return belonging to user
    # -----------------------------------------

    try:
        return_request = ReturnRequest.objects.select_for_update().get(
            id=return_id,
            user_id=user_id
        )
    except ReturnRequest.DoesNotExist:
        return {
            "success": False,
            "message": "Return request not found."
        }

    # -----------------------------------------
    # 2. Check current status
    # -----------------------------------------

    cancellable_statuses = [
        "requested",
        "approved",
        "pickup_scheduled",
    ]

    if return_request.status not in cancellable_statuses:
        return {
            "success": False,
            "message": (
                f"This return cannot be cancelled because "
                f"its current status is '{return_request.status}'."
            )
        }

    # -----------------------------------------
    # 3. Update status
    # -----------------------------------------

    with transaction.atomic():

        return_request.status = "cancelled"
        return_request.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

    return {
        "success": True,
        "message": "Return request cancelled successfully.",
        "return_id": return_request.id,
        "order_id": return_request.order.id,
        "status": return_request.status,
    }


def cancel_order(user_id, order_id):
    """
    Cancel a user's order.
    Write/action tool.
    """

    # -----------------------------------------
    # 1. Find user's order
    # -----------------------------------------

    try:
        order = Order.objects.select_for_update().get(
            id=order_id,
            user_id=user_id
        )
    except Order.DoesNotExist:
        return {
            "success": False,
            "message": "Order not found."
        }

    # -----------------------------------------
    # 2. Check order status
    # -----------------------------------------

    cancellable_statuses = [
        "pending",
        "confirmed",
        "processing",
    ]

    if order.status not in cancellable_statuses:
        return {
            "success": False,
            "message": (
                f"This order cannot be cancelled because "
                f"its current status is '{order.status}'."
            )
        }

    # -----------------------------------------
    # 3. Prevent cancellation if already cancelled
    # -----------------------------------------

    if order.status == "cancelled":
        return {
            "success": False,
            "message": "This order is already cancelled."
        }

    # -----------------------------------------
    # 4. Cancel order
    # -----------------------------------------

    with transaction.atomic():

        order.status = "cancelled"
        order.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

    return {
        "success": True,
        "message": "Order cancelled successfully.",
        "order_id": order.id,
        "status": order.status,
    }