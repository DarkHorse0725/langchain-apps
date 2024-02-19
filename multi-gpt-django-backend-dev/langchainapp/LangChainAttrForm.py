from django import forms  
from langchainapp.models import LangChainAttr  
class LangChainAttrForm(forms.ModelForm):  
    class Meta:  
        model = LangChainAttr  
        fields = "__all__"  