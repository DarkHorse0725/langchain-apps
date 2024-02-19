from django.db import models

class LangChainAttr(models.Model):
    
    attribute = models.CharField(max_length = 500)
    attr_type = models.CharField(max_length = 30)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:  
        db_table = "langchainattr"
    def is_active(self):
        return self.is_active