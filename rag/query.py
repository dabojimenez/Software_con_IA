from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CHROMA_DIR = str(BASE_DIR / "chroma_db")

# 1.- Embeddings
# Necesario para cargar el store
embeddings = OllamaEmbeddings(
    model="nomic-embed-text"
)

# 2.- Cargar vector DB desde disco
vectorstore = Chroma(
    persist_directory=CHROMA_DIR, # Indicamos la ruta donde esta la data en memoria
    embedding_function=embeddings # indicmaos cual fue el embeding que se uso, para su recuperacion
)

# 3.- Modelo (LLM)
llm = ChatOllama(
    model="qwen2.5:0.5b"
    # model="gemma4:e2b"
)

# 4. Cadena RAG
prompt = ChatPromptTemplate.from_template(
    "Responde con base en el contexto proporcionado. Si el contexto está "
    "incompleto, usa lo que encuentres en él sin inventar información. "
    "Responde lo que puedas deducir.\n\n"
    "Contexto:\n{context}\n\nPregunta: {question}"
)

# Junta los chunks recuperados en un bloque de texto legible para el prompt.
def format_docs(chunks):
    return "\n\n".join(c.page_content for c in chunks)


# La cadena LCEL se arma con el operador "|" (paso a paso, como una tubería):
# 1. as_retriever(): encuentra los chunks más parecidos (semánticamente) a la pregunta.
# 2. format_docs(): los une en texto plano.
# 3. prompt: los inserta en la plantilla (context), junto con la pregunta (question).
# 4. llm: genera la respuesta usando el contexto.
# 5. StrOutputParser(): extrae solo el texto final (str) de la respuesta del modelo.
qa = (
    {
        "context": vectorstore.as_retriever(search_kwargs={"k": 3}) | format_docs,
        "question": RunnablePassthrough(),  # pasa la pregunta tal cual al prompt
    }
    | prompt
    | llm
    | StrOutputParser()
)

# invoke() ejecuta toda la tubería: recupera contexto + genera respuesta.
query = "¿Qué paso el 14 de mayo de 2061?"
result = qa.invoke(query)

print(result)