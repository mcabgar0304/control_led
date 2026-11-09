let port;
let writer;

let countRojo = 0;
let countVerde = 0;

const connectBtn = document.getElementById('connect');
const ledRojoBtn = document.getElementById('ledRojo');
const ledVerdeBtn = document.getElementById('ledVerde');
const ledsAmbosBtn = document.getElementById('ledsAmbos');
const parpadeoBtn = document.getElementById('parpadeo');
const ventiladorBtn = document.getElementById('ventilador');

const contadorRojo = document.getElementById('contadorRojo');
const contadorVerde = document.getElementById('contadorVerde');

// --- NUEVO: Elementos del slider PWM ---
const pwmSlider = document.getElementById('pwmSlider');
const pwmValue = document.getElementById('pwmValue');

// 1. Conectar al puerto Serial al hacer clic
connectBtn.addEventListener('click', async () => {

    // Solicitar al navegador el puerto USB del Arduino
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    // Obtener el escritor para enviar datos de texto
    writer = port.writable.getWriter();

    connectBtn.disabled = true;
    connectBtn.innerText = "Conectado";

    await sleep(1500);
    ledRojoBtn.disabled = false;
    ledVerdeBtn.disabled = false;
    ledsAmbosBtn.disabled = false;
    parpadeoBtn.disabled = false;
    ventiladorBtn.disabled = false;

    // --- NUEVO: Habilitar el slider al conectar ---
    if (pwmSlider) pwmSlider.disabled = false;
});

// Función general para enviar comandos de texto al Arduino
async function enviarComando(comando) {
    if (writer) {
        // Creamos un codificador para convertir texto en bytes e incluimos un salto de línea (\n)
        const encoder = new TextEncoder();
        await writer.write(encoder.encode(comando + "\n"));
        console.log("Comando enviado: " + comando);
    } else {
        alert("Primero debes conectar el Arduino.");
    }
}

// Botón Encender LED ROJO
ledRojoBtn.addEventListener('click', async () => {
    await enviarComando("ledrojo");
    if (ledRojoBtn.classList.contains('on')) {
        // Si estaba encendido, lo pasamos a apagado
        ledRojoBtn.classList.remove('on');
        ledRojoBtn.classList.add('off');
        ledRojoBtn.innerText = "Apagar LED Rojo";

        countRojo++; // Sumamos 1 al contador
        contadorRojo.innerText = `Contador LED Rojo: ${countRojo}`;
    } else {
        // Si estaba apagado, lo pasamos a encendido
        ledRojoBtn.classList.remove('off');
        ledRojoBtn.classList.add('on');
        ledRojoBtn.innerText = "Encender LED Rojo";
    }
});

// Botón Encender LED VERDE
ledVerdeBtn.addEventListener('click', async () => {
    await enviarComando("ledverde");
    if (ledVerdeBtn.classList.contains('on')) {
        // Si estaba encendido, lo pasamos a apagado
        ledVerdeBtn.classList.remove('on');
        ledVerdeBtn.classList.add('off');
        ledVerdeBtn.innerText = "Apagar LED Verde";

        countVerde++; // Sumamos 1 al contador
        contadorVerde.innerText = `Contador LED Verde: ${countVerde}`;
    } else {
        // Si estaba apagado, lo pasamos a encendido
        ledVerdeBtn.classList.remove('off');
        ledVerdeBtn.classList.add('on');
        ledVerdeBtn.innerText = "Encender LED Verde";
    }
});

ledsAmbosBtn.addEventListener('click', async () => {
    await enviarComando("ambos");
    
    if (ledsAmbosBtn.classList.contains('on')) {
        ledsAmbosBtn.classList.remove('on');
        ledsAmbosBtn.classList.add('off');
        ledsAmbosBtn.innerText = "Apagar ambos LEDs";
    } else {
        ledsAmbosBtn.classList.remove('off');
        ledsAmbosBtn.classList.add('on');
        ledsAmbosBtn.innerText = "Encender ambos LEDs";
    }
});

parpadeoBtn.addEventListener('click', async () => {
    await enviarComando("parpadear");
    if (parpadeoBtn.classList.contains('on')) {
        // Si estaba encendido, lo pasamos a apagado
        parpadeoBtn.classList.remove('on');
        parpadeoBtn.classList.add('off');
        parpadeoBtn.innerText = "Apagar parpadeo";
    } else {
        // Si estaba apagado, lo pasamos a encendido
        parpadeoBtn.classList.remove('off');
        parpadeoBtn.classList.add('on');
        parpadeoBtn.innerText = "Encender parpadeo";
    }
});

ventiladorBtn.addEventListener('click', async () => {
    await enviarComando("ventilador");
    if (ventiladorBtn.classList.contains('on')) {
        // Si estaba encendido, lo pasamos a apagado
        ventiladorBtn.classList.remove('on');
        ventiladorBtn.classList.add('off');
        ventiladorBtn.innerText = "Apagar ventilador";
    } else {
        // Si estaba apagado, lo pasamos a encendido
        ventiladorBtn.classList.remove('off');
        ventiladorBtn.classList.add('on');
        ventiladorBtn.innerText = "Encender ventilador";
    }
});

if (pwmSlider) {
    pwmSlider.addEventListener('input', async () => {
        let valor = pwmSlider.value;
        if (pwmValue) pwmValue.innerText = valor; // Actualiza el número en pantalla

        // Envía el comando con formato "pwm:VALOR" (ej: pwm:150)
        await enviarComando("pwm:" + valor);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}