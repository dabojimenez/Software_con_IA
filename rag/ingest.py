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
from pathlib import Path

CHROMA_DIR = "./chroma_db"

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
# chunk_size=500 : máx. caracteres por chunk (menor = más lento pero más preciso por chunk).
# chunk_overlap=50: solapa los últimos 50 chars del chunk anterior para no cortar
# ideas a la mitad y conservar el contexto entre pedazos consecutivos.
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
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
    persist_directory=CHROMA_DIR # Le colocamos la direccion de persistencia
)

print(f"Ingestion completada. {len(splits)} chunks guardados en '{CHROMA_DIR}'")