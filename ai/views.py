from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Agent, Conversation
from ai.agents.shopping_agent import run_shopping_agent


class AiChatAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        # -----------------------------
        # Get request data
        # -----------------------------

        user_message = request.data.get("message")
        conversation_id = request.data.get("conversation_id")

        if not user_message:
            return Response(
                {
                    "success": False,
                    "error": "Message is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -----------------------------
        # Get existing conversation
        # -----------------------------

        if conversation_id:

            try:
                conversation = Conversation.objects.get(
                    id=conversation_id,
                    user=request.user
                )

            except Conversation.DoesNotExist:

                return Response(
                    {
                        "success": False,
                        "error": "Conversation not found."
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

        # -----------------------------
        # Create new conversation
        # -----------------------------

        else:

            try:
                agent = Agent.objects.get(
                    agent_type="shopping",
                    is_active=True
                )

            except Agent.DoesNotExist:

                return Response(
                    {
                        "success": False,
                        "error": "Shopping agent is not configured."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            conversation = Conversation.objects.create(
                user=request.user,
                agent=agent
            )

        # -----------------------------
        # Run shopping agent
        # -----------------------------

        result = run_shopping_agent(
            user_message=user_message,
            conversation_id=conversation.id,
            user_id=request.user.id
        )

        # -----------------------------
        # Return response
        # -----------------------------

        return Response(
            {
                "conversation_id": conversation.id,
                **result
            },
            status=status.HTTP_200_OK
        )