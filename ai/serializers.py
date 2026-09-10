
from rest_framework import serializers


class ChatSerializer(serializers.Serializer):
    message = serializers.CharField(
        required=True,
        allow_blank=False
    )

    conversation_id = serializers.IntegerField(
        required=False,
        allow_null=True
    )

