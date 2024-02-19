from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts.chat import ChatPromptTemplate
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from .models import LangChainAttr
from .models import WriteStore

import os
from PyPDF2 import PdfReader
from rest_framework.views import APIView

from langchainapp.prompts import gen_prompt

from rest_framework.response import Response
from rest_framework import status
from langchain.vectorstores import Pinecone
from langchain.text_splitter import CharacterTextSplitter
from sentence_transformers import SentenceTransformer

import pinecone
import openai
import numpy as np
import pandas as pd

openai_key = os.environ["OPENAI_API_KEY"]
PINECONE_INDEX_NAME = os.environ["PINECONE_INDEX_NAME"]
TEMP=0.5
MODEL='gpt-3.5-turbo'
PERSONALITY='general assistant'

def embeddingText(text):
    pinecone.init(
        api_key=os.environ["PINECONE_API_KEY"],  # find at app.pinecone.io
        environment=os.environ["PINECONE_ENVIRONMENT"],  # next to api key in console
    )
    index_name = PINECONE_INDEX_NAME
    embeddings = OpenAIEmbeddings()

    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    
    vectorstore = Pinecone.from_texts(texts=[str(chunk) for chunk in chunks], embedding=embeddings, index_name=index_name)
    return vectorstore

class GetAttr(APIView):
    def post(self, request, format=None):
        try:
            attr = LangChainAttr.objects.first()
            return Response({"rubrics": attr.rubrics, "assignments": attr.assignments}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Data doesn't exist."}, status=status.HTTP_404_NOT_FOUND)

class SaveAttr(APIView):
    def post(self, request, format=None):
        # try:
            
        save_data = LangChainAttr.objects.first()
        if 'rubrics' in request.data: 
            save_data.rubrics = request.data['rubrics']
        elif 'assignments' in request.data:
            save_data.assignments = request.data['assignments']
        
        save_data.save()
        
        return Response({"message": "Saved successfully."}, status=status.HTTP_200_OK)  
        
class LibForEmbedding:
    # Single PDF
    def get_pdf_text(pdf):
        text = ""
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    


class CHAT (APIView):
    
    def post(self, request):
        
        writing = request.data['writing']
        lang_code = request.data['langCode']
        rubrics = LangChainAttr.objects.first().rubrics
        assignments = LangChainAttr.objects.first().assignments
        similarity = 0.95

        model = SentenceTransformer('all-MiniLM-L6-v2')
        # embeddings = model.encode(writing)

        pinecone_index = pinecone.Index(index_name=PINECONE_INDEX_NAME)
        # pinecone_index.upsert(items={writing[i]: embeddings[i] for i in range(len(writing))})

        query_embedding = model.encode([writing])
        serialized_data = query_embedding.tolist()

        temp = np.resize(serialized_data, 1536)
        embedding_list = temp.tolist()
        print('embedding_list = ', len(embedding_list))
        results = None
        try:
            results = pinecone_index.query(vector=embedding_list, top_k=5)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
        print('results = ', results)
        res_index= -1
        res = None
        for id, row in enumerate(results.matches):
            print(f"Score { row.score }: {row.id} ")
            if row.score > similarity:
                print('row.idx = ', row.id)
                res_index = row.id
                break
        print('res_index = ', res_index)
        if res_index == -1:

            add = "Using the criteria above, how would you rate the following paragraph and what specific details would you give for improving this writing as an expert teacher? Keep the object shape and keys intact and without removing any characters. AcRead the following passage:"
            double_check = " If the writing sample is the same, please evaluate it the same way as you did previously using the same scores."
            openai.api_key = openai_key

            llm = openai.ChatCompletion.create(
                model='gpt-4',
                messages=[
                    {'role': 'system', 'content': 'You are a good teacher for rubrics'},
                    {'role': 'user', 'content': rubrics + add + writing + double_check + assignments},
                ]
            )

            res = llm['choices'][0]['message']['content']

            save_data = WriteStore.objects.create()

            save_data.result = res
            save_data.user_id = 1
            save_data.write = writing
            save_data.save()
            
            latestIDData = WriteStore.objects.last()
            id = 1
            if latestIDData is not None:
                id = latestIDData.id

            pinecone_index.upsert(vectors=[
                {
                    'id': str(id),
                    'values':embedding_list,
                    'metadata' : {
                        'text' : writing,
                        'id' : str(id)
                    }
                },
            ])
            
        else :
            data = WriteStore.objects.get(id=res_index)
            res = data.result
        return Response({'message': res}, status=status.HTTP_200_OK)

class Translate(APIView):
    def post(self, request):
        text = request.data['text']
        lang_code = request.data['langCode']

        openai.api_key = openai_key

        llm = openai.ChatCompletion.create(
            model='gpt-4',
            messages=[
                {'role': 'system', 'content': 'Use OpenAI language model to translate the text to the target language'},
                {'role': 'user', 'content': 'Translate the following into ' + lang_code + '. Keep the object shape and keys intact and without removing any characters, make it JSON parsable. \n\n ' + text + ''},
            ]
        )

        res = llm['choices'][0]['message']['content']

        return Response({'message': res}, status=status.HTTP_200_OK)