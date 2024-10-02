from Rag.get_db import get_vector_db
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
# from Rag.back import create_rag_chain,invoke_rag_chain,get_session_history

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
# #     docs = retriever.invoke("what was arjuns dilemma?")
# #     combined_content = " ".join([doc.page_content for doc in docs])

# # # Print or use the combined content
# #     return combined_content
#     rag_chain = create_rag_chain(retriever)
#     answer = invoke_rag_chain(rag_chain, question, session_id)

#     # logging.debug(f"Answer generated for session {session_id}: {answer}")
#     # logging.debug(f"Session Data After Processing: {get_session_data(session_id)}")
    
#     return answer





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

    # qa_system_prompt = """You are a mental heath assistant, and talking to students. \
    # Use the following pieces of retrieved context from the book to answer the question in an understanding way. \
    # If the context does not contain the answer, acknowledge it, and try to formulate your own answer. \
    # If a concept is found, explain it in brief to the student.\
    qa_system_prompt = """
    You are an assistant for question-answering tasks. \
    You are talking to students, who are chatting with you to seek mental support, and advice for their problems.\
    Use the following pieces of retrieved context to answer the question to the best of your ability. \
    If you don't know the answer, try to relate from the context provide, mix in your own knowledge and answer. \
    Use three sentences maximum and keep the answer concise.\

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

    

# testing 

# while True :
#     question = input ("enter question ")
#     if question == "end":
#         break

#     print(" ")
#     print(get_ans(question,"2","1"))
#     print(" ")

# print(get_ans("what are the rules for changing my habits?", "2", "1"))
# print(get_ans("what did krishna advice arjun to do", "1", "1"))
# print(get_ans("what was arjun's dillema ?", "1", "1"))

# while True :
#     question = input("enter your question")
#     print(" ")

#     if question == "end":
#         break
#     print(get_ans(question,"1","ee3bdbc8-294d-48b5-b1f7-3003acb3990b"))
#     print(" ")
