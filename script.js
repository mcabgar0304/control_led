let port;
let writer;

const connectBtn = document.getElementById('connect');
const onBtn = document.getElementById('on');
const offBtn = document.getElementById('off');
const alertBox = document.getElementById('alert-box');

// 1. Conectar al puerto Serial al hacer clic
connectBtn.addEventListener('click', async () => {
    // Solicitar al navegador el puerto USB del Arduino
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    // Obtener el escritor para enviar datos
    writer = port.writable.getWriter();

    connectBtn.disabled = true;
    connectBtn.innerText = "Conectado";
    onBtn.disabled = false;
    offBtn.disabled = false;

    readSerialData();
});

// 2. Enviar '1' para encender el LED
onBtn.addEventListener('click', async () => {
    if (writer) {
        const data = new Uint8Array([49]); // Código ASCII para '1'
        await writer.write(data);
    }
});

// 3. Enviar '0' para apagar el LED
offBtn.addEventListener('click', async () => {
    if (writer) {
        const data = new Uint8Array([48]); // Código ASCII para '0'
        await writer.write(data);
    }
});

// 3. Función para leer continuamente los mensajes del Arduino (Sensor)
async function readSerialData() {
    const textDecoder = new TextDecoderStream();
    port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    let buffer = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            buffer += value;
            let lines = buffer.split("\n");
            buffer = lines.pop(); // Guarda fragmentos incompletos para el siguiente ciclo

            for (let line of lines) {
                let cleanLine = line.trim();

                // Evaluamos el texto enviado por el Arduino
                if (cleanLine === "OBJETO_CERCA") {
                    alertBox.classList.remove('hidden'); // Muestra el aviso rojo
                } else if (cleanLine === "OBJETO_LEJOS") {
                    alertBox.classList.add('hidden');    // Oculta el aviso
                }
            }
        }
}