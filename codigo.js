const canvas = document.getElementById('pendulumCanvas');
const ctx = canvas.getContext('2d');
let length, gravity, angle, angleRad;
let angleVelocity = 0;
let angleAcceleration = 0;
const originX = 200; // Posición horizontal del péndulo
const originY = 50;
let bobX, bobY;
let path = [];
let graph = []; // Almacenará la trayectoria angular en el tiempo
const graphHeight = canvas.height - 100; // Espacio para el gráfico de la función seno
let animationId = null; // ID para controlar la animación
let time = 0; // Variable para el tiempo

function startPendulum() {
    // Detener cualquier animación previa si existe
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    // Obtener los valores de los inputs
    length = parseFloat(document.getElementById('length').value);
    gravity = parseFloat(document.getElementById('gravity').value);
    angle = parseFloat(document.getElementById('angle').value);

    // Convertir el ángulo inicial a radianes
    angleRad = (Math.PI / 180) * angle;

    // Reiniciar variables de movimiento angular
    angleVelocity = 0;
    angleAcceleration = 0;
    time = 0; // Reiniciar el tiempo

    // Reiniciar la trayectoria y la gráfica
    path = [];
    graph = [];

    // Calcular ecuaciones del péndulo simple
    const frequencyNatural = Math.sqrt(gravity / length); // Frecuencia natural (rad/s)
    const period = 2 * Math.PI * Math.sqrt(length / gravity); // Período (s)
    const frequencyAngular = 1 / period; // Frecuencia angular (Hz)

    // Mostrar los resultados en el HTML
    document.getElementById('results').innerHTML = ` 
        <p><strong>Ecuaciones del sistema:</strong></p>
        <p>Frecuencia Natural: ${frequencyNatural.toFixed(2)} rad/s</p>
        <p>Período: ${period.toFixed(2)} s</p>
        <p>Frecuencia Angular: ${frequencyAngular.toFixed(2)} Hz</p>
    `;

    // Iniciar la animación
    animationId = requestAnimationFrame(updatePendulum);
}

function updatePendulum() {
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el péndulo
    drawPendulum();

    // Dibujar la trayectoria
    drawPath();

    // Dibujar la gráfica de la trayectoria angular de forma vertical
    drawVerticalGraph();

    // Calcular la aceleración angular usando la ecuación del péndulo
    angleAcceleration = (-gravity / length) * Math.sin(angleRad);

    // Actualizar la velocidad y el ángulo
    angleVelocity += angleAcceleration;
    angleVelocity *= 0.99; // Factor de amortiguamiento
    angleRad += angleVelocity;

    // Calcular la posición de la masa
    bobX = originX + length * Math.sin(angleRad);
    bobY = originY + length * Math.cos(angleRad);

    // Guardar la posición del péndulo para la trayectoria
    path.push({ x: bobX, y: bobY });

    // Guardar el ángulo para el gráfico
    graph.push(angleRad);

    // Limitar el tamaño del gráfico para no sobrecargar la memoria
    if (graph.length > graphHeight) {
        graph.shift(); // Eliminar el punto más antiguo
    }

    // Actualizar el tiempo
    time += 0.02; // Incrementar el tiempo (ajusta este valor según sea necesario)

    // Calcular las ecuaciones de movimiento
    const frequencyNatural = Math.sqrt(gravity / length); // Frecuencia natural (rad/s)
    const position = angleRad * (180 / Math.PI); // Convertir a grados para mostrar
    const velocity = -angle * frequencyNatural * Math.sin(frequencyNatural * time); // Velocidad
    const acceleration = -angle * frequencyNatural ** 2 * Math.cos(frequencyNatural * time); // Aceleración

    // Mostrar las ecuaciones de movimiento en el HTML solo la primera vez
    if (time <= 0.02) {
        document.getElementById('results').innerHTML += ` 
            <p><strong>Ecuaciones de Movimiento:</strong></p>
            <p>Posición (θ): ${position.toFixed(2)}°</p>
            <p>Velocidad (v): ${velocity.toFixed(2)} rad/s</p>
            <p>Aceleración (a): ${acceleration.toFixed(2)} rad/s²</p>
        `;
    }

    // Dibujar las ecuaciones en notación matemática
    drawEquations();

    // Continuar la animación
    animationId = requestAnimationFrame(updatePendulum);
}

function drawEquations() {
    ctx.fillStyle = 'white'; // Color del texto
    ctx.font = '16px Arial'; // Estilo de fuente

    ctx.fillText(`θ = θ₀ * cos(ωt)`, 20, 120);
    ctx.fillText(`v = -ωθ₀ * sin(ωt)`, 20, 140);
    ctx.fillText(`a = -ω²θ₀ * cos(ωt)`, 20, 160);

    // Ecuaciones adicionales
    ctx.fillText(`ω = √(g / L)`, 20, 50); // Frecuencia angular
    ctx.fillText(`T = 2π√(L / g)`, 20, 70); // Período
    ctx.fillText(`f = 1 / T`, 20, 90); // Frecuencia natural
}

function drawPendulum() {
    // Dibujar la cuerda del péndulo
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Dibujar la masa del péndulo
    ctx.beginPath();
    ctx.arc(bobX, bobY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();
}

// Función para dibujar la trayectoria
function drawPath() {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < path.length - 1; i++) {
        ctx.moveTo(path[i].x, path[i].y);
        ctx.lineTo(path[i + 1].x, path[i + 1].y);
    }
    ctx.stroke();
}

// Función para dibujar la gráfica de la trayectoria angular de forma vertical
function drawVerticalGraph() {
    const centerX = 450; // Posición de la gráfica en el lado derecho
    const graphWidth = 100; // Ancho de la gráfica (para escalar los ángulos)

    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    // Dibujar la gráfica en función del tiempo de manera vertical
    for (let i = 0; i < graph.length; i++) {
        const x = centerX + graph[i] * graphWidth / 2; // Escalar el ángulo
        const y = originY + i; // Desplazamiento vertical

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
}

// Función para reiniciar la simulación
function resetCanvas() {
    // Detener la animación si está en curso
    cancelAnimationFrame(animationId);

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reiniciar las variables
    path = [];
    graph = [];
    angleVelocity = 0;
    angleAcceleration = 0;

    // Reiniciar el tiempo
    time = 0;

    // Reiniciar los valores de los inputs a sus valores por defecto
    document.getElementById('length').value = 200;
    document.getElementById('gravity').value = 9.81;
    document.getElementById('angle').value = 45;

    // Reiniciar la animación
    animationId = null;
}