document.addEventListener('DOMContentLoaded', () => {
    const txtPrompt = document.getElementById('txtPrompt');
    const btnSend = document.getElementById('btnSend');
    const chatDiv = document.getElementById('chat');

    // Array para almacenar los mensajes del chat, el cual se enviara al servidor para mantener el contexto de la conversación
    const messages = [];

    function showChat() {
        chatDiv.innerHTML = ''; // Limpiar el contenido del chat antes de mostrar los mensajes
        messages.forEach(({role, content}) => {
            const bubbleDiv = document.createElement('div');
            bubbleDiv.classList.add('bubble');
            bubbleDiv.classList.add(role === 'user' ? 'user-bubble' : 'assistant-bubble');
            bubbleDiv.textContent = content;
            chatDiv.appendChild(bubbleDiv);
        });
        chatDiv.scrollTop = chatDiv.scrollHeight;
    }

    btnSend.addEventListener('click', async () => {
        const texto = txtPrompt.value.trim();
        if(!texto) return;

        messages.push({ 
            // role: 'user': El role user, indica que el mensaje es del usuario, mientras que role: 'assistant' indica que el mensaje es de la IA.
            role: 'user', // Agrega el mensaje del usuario al array de mensajes
            content: texto 
        });

        showChat();
        btnSend.disabled = true;
        txtPrompt.value = '';

        const thinkingBubble = document.createElement('div');
        thinkingBubble.classList.add('bubble', 'bubble-thinking');
        thinkingBubble.textContent = 'Pensando...';
        chatDiv.appendChild(thinkingBubble);
        chatDiv.scrollTop = chatDiv.scrollHeight; // Desplaza el chat hacia abajo para mostrar el mensaje de "Pensando..."

        // Solicitud fetch a tu servidor local (ollama), del tipo POST
        try {
            const respuesta = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "gemma4:e2b",
                    // model: "qwen2.5:0.5b",
                    messages: messages,
                    stream: false,
                }),
            });

            if(!respuesta.ok){
                throw new Error('Error HTTP en la solicitud con ollama');
            }
            
            const datos = await respuesta.json();
            const reply = datos.message?.content || 'No se recibió respuesta.';

            messages.push({
                role: 'assistant',
                content: reply
            });
        } catch (error) {
            console.error('Error al comunicarse con el servidor:', error);
            messages.push({
                role: 'assistant', // Agrega un mensaje de error al array de mensajes
                content: 'Error al comunicarse con el servidor.'
            });
            // Aquí podrías actualizar la interfaz de usuario para mostrar el error
            // responseDiv.textContent = 'Error al comunicarse con el servidor.';
        }finally {
            thinkingBubble.remove(); // Elimina el mensaje de "Pensando..." después de recibir la respuesta
            showChat();
            btnSend.disabled = false;
        }

    });
});