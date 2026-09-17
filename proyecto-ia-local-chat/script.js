document.addEventListener('DOMContentLoaded', () => {
    const txtPrompt = document.getElementById('txtPrompt');
    const btnSend = document.getElementById('btnSend');
    const responseDiv = document.getElementById('response');

    btnSend.addEventListener('click', async () => {
        const texto = txtPrompt.value.trim();
        if(!texto) return;

        btnSend.disabled = true;
        responseDiv.textContent = 'Pensando...';

        // Solicitud fetch a tu servidor local (ollama), del tipo POST
        try {
            const respuesta = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // model: "gemma4:e2b",
                    model: "qwen2.5:0.5b",
                    prompt: texto,
                    stream: false,
                }),
            });

            if(!respuesta.ok){
                throw new Error('Error HTTP en la solicitud');
            }
            
            const datos = await respuesta.json();
            responseDiv.textContent = datos.response ?? '(Sin respuesta)';

            txtPrompt.value = '';
        } catch (error) {
            responseDiv.textContent = 'Error al comunicarse con el servidor.';
        }finally {
            btnSend.disabled = false;
        }

    });
});