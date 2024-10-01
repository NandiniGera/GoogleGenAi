from chunks import TextToChunks
from langchain_google_genai import GoogleGenerativeAIEmbeddings
# import getpass
import os
from langchain_chroma import Chroma
from dotenv import load_dotenv

load_dotenv()

# Access the API key
api_key = os.getenv('API_KEY')

# if "GOOGLE_API_KEY" not in os.environ:
#     os.environ["GOOGLE_API_KEY"] = getpass.getpass("api_key")

embeddings = GoogleGenerativeAIEmbeddings(api_key=api_key,model="models/embedding-001")



with open('gita.txt', 'r', encoding='utf-8') as file:
    gita_text = file.read()

with open('atomichabits.txt', 'r', encoding='utf-8') as file:
    atomic_text = file.read()    



chunker1 = TextToChunks(gita_text)
chunks1 = chunker1.split_text()

chunker2 = TextToChunks(atomic_text)
chunks2 = chunker2.split_text()

# # print((chunks1[0]))



vector_store_gita = Chroma(
    collection_name = "1_collection",
    embedding_function=embeddings,

    persist_directory="./chroma_langchain_1_db",  # Where to save data locally, remove if not necessary
)
vector_store_atomic = Chroma(
    collection_name = "2_collection",
    embedding_function=embeddings,

    persist_directory="./chroma_langchain_2_db",  # Where to save data locally, remove if not necessary
)


vector_store_gita.add_documents(documents = chunks1)
vector_store_atomic.add_documents(documents = chunks2)




