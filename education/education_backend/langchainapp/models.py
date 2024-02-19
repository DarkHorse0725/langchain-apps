from django.db import models

class LangChainAttr(models.Model):
    rubrics = models.TextField()
    assignments = models.TextField(default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "langchainattr"

class WriteStore(models.Model):
    write = models.TextField()
    result = models.TextField()
    user_id = models.IntegerField(blank=True, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "write_store"        