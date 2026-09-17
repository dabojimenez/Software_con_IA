from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough





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
    "Responde usando SOLO el contexto. Si no encuentras la respuesta, di que no la sabes.\n\n"
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
        "context": vectorstore.as_retriever() | format_docs,
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