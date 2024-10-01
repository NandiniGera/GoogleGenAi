from get_db import get_vector_db
from dotenv import load_dotenv
import os 
# import getpass
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_history_aware_retriever
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory


store = {}

load_dotenv()

# Access the API key
api_key = os.getenv('GOOGLE_API_KEY')


# if "GOOGLE_API_KEY" not in os.environ:
#     os.environ["GOOGLE_API_KEY"] = getpass.getpass("api-key")

llm = ChatGoogleGenerativeAI(api_key=api_key,model="gemini-1.5-flash")




def get_ans(question,book_code,session_id: str):
    # return store[session_id]
    vectorstore = get_vector_db(book_code)


    retriever = vectorstore.as_retriever()

    contextualize_q_system_prompt = """Given a chat history and the latest user question \
    which might reference context in the chat history, formulate a standalone question \
    which can be understood without the chat history. Do NOT answer the question, \
    just reformulate it if needed and otherwise return it as is."""
    
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    
    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_q_prompt
    )

    qa_system_prompt = """You are a mental heath assistant, a book expert and talking to students. \
    Use the following pieces of retrieved context from the book to answer the question in an understanding way. \
    If the context does not contain the answer, acknowledge it, and try to formulate your own answer. \
    If a concept is found, explain it in brief to the student.\

    {context}"""
    
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

    def get_session_history(session_id: str) -> BaseChatMessageHistory:
        if session_id not in store:
            store[session_id] = ChatMessageHistory()
        return store[session_id]
    
    

    conversational_rag_chain = RunnableWithMessageHistory(
        rag_chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="chat_history",
        output_messages_key="answer",
    )

    
    # invoke_chain = conversational_rag_chain(question,session_id)
    result = conversational_rag_chain.invoke(
    {"input": question},
    config={"configurable": {"session_id": session_id}}
    )
    # return store[session_id]
    return result['answer']

    




print(get_ans("what are the rules for changing my habits?", "2", "1"))
# print(get_ans("what did krishna advice arjun to do", "1", "1"))

