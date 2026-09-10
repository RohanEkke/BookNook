from django.contrib import admin
from .models import Agent, AgentLog, Conversation, Message


admin.site.register(Conversation)
admin.site.register(Message)
admin.site.register(Agent)
admin.site.register(AgentLog)

# Register your models here.
