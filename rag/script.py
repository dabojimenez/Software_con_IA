# ============================================================================
# PIPELINE RAG (Retrieval-Augmented Generation)
# Proceso: Cargar -> Dividir -> Vectorizar -> Almacenar -> Recuperar -> Generar
# Requisito previo: Ollama corriendo en local (ollama serve) y modelos descargados:
#   ollama pull nomic-embed-text   (embeddings)
#   ollama pull qwen2.5:0.5b       (LLM de generación)
# ============================================================================

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# ============================================================================
# PARTE 1 - INGESTA DE DATOS (construcción de la base de conocimiento)
# ============================================================================

# 1.- Cargar documento
# TextLoader convierte el archivo .txt en objetos Document (con page_content y metadata).
# Nota: langchain-community está en "sunset"; para texto plano podrías usar
# Path("document.txt").read_text() y evitar la dependencia.
loader = TextLoader(BASE_DIR / "asimov.txt", encoding="utf-8")
docs = loader.load()  # docs = lista de Document (uno por línea/párrafo)

# 2.- Dividir en chunks
# Los LLM tienen límite de contexto fijo; dividir evita mandar el texto completo.
# chunk_size=1000 : máx. caracteres por chunk (mayor = conserva frases/ideas completas).
# chunk_overlap=150: solapa los últimos 150 chars del chunk anterior para no cortar
# ideas a la mitad y conservar el contexto entre pedazos consecutivos.
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=150,
)
splits = text_splitter.split_documents(docs)  # lista de chunks más pequeños

# 3.- Embeddings
# Convierte cada chunk en un vector numérico que captura su "significado".
# El modelo DEBE ser de tipo embedding (nomic-embed-text).
embeddings = OllamaEmbeddings(
    model="nomic-embed-text"
)

# 4.- Vector DB (Chroma)
# Guarda chunk + su vector en una base vectorial. Es el "índice" que permite
# buscar por similitud semántica (no por palabra exacta).
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embeddings,
)

# ============================================================================
# PARTE 2 - CONSULTA (uso del RAG para responder preguntas)
# ============================================================================

# 5.- LLM de generación
# ChatOllama es el modelo de chat (qwen2.5:0.5b = pequeño/rápido, ideal para pruebas).
llm = ChatOllama(
    # model="qwen2.5:0.5b"
    model="gemma4:e2b"
)

# 6.- Cadena RAG (LCEL - LangChain Expression Language)
# Plantilla que le dice al LLM qué hacer con el contexto recuperado.
# {context} se llena con los chunks más relevantes; {question} con la pregunta del usuario.
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
        "context": vectorstore.as_retriever(search_kwargs={"k": 6}) | format_docs,
        "question": RunnablePassthrough(),  # pasa la pregunta tal cual al prompt
    }
    | prompt
    | llm
    | StrOutputParser()
)

# 7.- Pregunta (uso del RAG)
# invoke() ejecuta toda la tubería: recupera contexto + genera respuesta.
query = "¿Qué paso el 14 de mayo de 2061?"
result = qa.invoke(query)

print(result)