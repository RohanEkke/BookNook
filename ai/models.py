from django.db import models
from django.conf import settings


class Agent(models.Model):

    AGENT_TYPES = [
        ("shopping", "Shopping Agent"),
        ("support", "Support Agent"),
        ("recommendation", "Recommendation Agent"),
    ]

    name = models.CharField(max_length=100)

    agent_type = models.CharField(
        max_length=30,
        choices=AGENT_TYPES,
        unique=True
    )

    description = models.TextField(blank=True)

    model = models.CharField(
        max_length=100,
        default="openai/gpt-4o-mini"
    )

    system_prompt = models.TextField()

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Conversation(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ai_conversations"
    )

    agent = models.ForeignKey(
        Agent,
        on_delete=models.CASCADE,
        related_name="conversations"
    )

    title = models.CharField(
        max_length=200,
        blank=True,
        default=""
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Conversation #{self.id} - {self.user}"


class Message(models.Model):

    ROLE_CHOICES = [
        ("user", "User"),
        ("assistant", "Assistant"),
    ]

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    content = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.role}: {self.content[:50]}"


class AgentLog(models.Model):

    EVENT_CHOICES = [
        ("agent_start", "Agent Started"),
        ("tool_call", "Tool Call"),
        ("tool_result", "Tool Result"),
        ("agent_end", "Agent Completed"),
        ("error", "Error"),
    ]

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="agent_logs"
    )

    event_type = models.CharField(
        max_length=30,
        choices=EVENT_CHOICES
    )

    message = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"[{self.event_type}] {self.message[:50]}"