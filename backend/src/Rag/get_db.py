from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os
# import getpass
from dotenv import load_dotenv

load_dotenv()

# Access the API key
api_key = os.getenv('GOOGLE_API_KEY')
# print(api_key)

# if "GOOGLE_API_KEY" not in os.environ:
#     os.environ["GOOGLE_API_KEY"] = getpass.getpass("api_key")

embeddings = GoogleGenerativeAIEmbeddings(api_key=api_key,model="models/embedding-001")



def get_vector_db (book) :
    vectorstore = Chroma(
    collection_name=book+"_collection",
    embedding_function=embeddings,

    persist_directory="./chroma_langchain_"+book+"_db",  
)
    return vectorstore

