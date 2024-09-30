from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os
import getpass

if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = getpass.getpass("api_key")

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")



def get_vector_db (book) :
    vectorstore = Chroma(
    collection_name=book+"_collection",
    embedding_function=embeddings,

    persist_directory=f"./chroma_langchain_"+book+"_db",  
)
    return vectorstore

