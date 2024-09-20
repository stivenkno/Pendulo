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
const graphHeight = canvas.height-100 ; // Espacio para el gráfico de la función seno

function startPendulum() {
  length = parseFloat(document.getElementById('length').value);
  gravity = parseFloat(document.getElementById('gravity').value);
  angle = parseFloat(document.getElementById('angle').value);
  angleRad = (Math.PI / 180) * angle;
  angleVelocity = 0;
  angleAcceleration = 0;
  path = [];
  graph = []; // Reiniciar el gráfico

  // Iniciar la animación
  requestAnimationFrame(updatePendulum);
}

function updatePendulum() {
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

  // Continuar la animación
  requestAnimationFrame(updatePendulum);
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  path = [];
  graph = [];
}
