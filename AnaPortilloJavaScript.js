// =========================================================
// LÓGICA DE DATOS, BÚSQUEDA Y GRÁFICA — ANA PORTILLO
// =========================================================

// 1. Datos Base de Ejemplo
const datosVentas = [
    { mes: 'Enero', ventas: 1200 },
    { mes: 'Febrero', ventas: 1900 },
    { mes: 'Marzo', ventas: 1500 },
    { mes: 'Abril', ventas: 2200 },
    { mes: 'Mayo', ventas: 3100 },
    { mes: 'Junio', ventas: 2500 }
];

// 2. Variables del Sistema
let graficaBarras = null;

// 3. Inicialización
document.addEventListener('DOMContentLoaded', () => {
    calcularYMostrarMetricas();
    inicializarGrafica(datosVentas);

    // Eventos
    document.getElementById('btnBuscar').addEventListener('click', ejecutarBusqueda);
    document.getElementById('inputBusqueda').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') ejecutarBusqueda();
    });
    document.getElementById('btnRestaurar').addEventListener('click', () => {
        document.getElementById('inputBusqueda').value = '';
        document.getElementById('resultadoBusqueda').style.display = 'none';
        actualizarGrafica(datosVentas);
    });
});

// 4. Calcular Métricas e Insertar en KPIs
function calcularYMostrarMetricas() {
    const total = datosVentas.reduce((acc, c) => acc + c.ventas, 0);
    const promedio = total / datosVentas.length;
    const max = datosVentas.reduce((m, c) => c.ventas > m.ventas ? c : m, datosVentas[0]);
    const min = datosVentas.reduce((m, c) => c.ventas < m.ventas ? c : m, datosVentas[0]);

    document.getElementById('kpiTotal').textContent = `$${total.toLocaleString()}`;
    document.getElementById('kpiPromedio').textContent = `$${promedio.toFixed(0).toLocaleString()}`;
    document.getElementById('kpiMax').textContent = `${max.mes} ($${max.ventas.toLocaleString()})`;
    document.getElementById('kpiMin').textContent = `${min.mes} ($${min.ventas.toLocaleString()})`;
}

// 5. Crear Gráfica Futurista con Chart.js
function inicializarGrafica(datos) {
    const ctx = document.getElementById('graficaBarras').getContext('2d');

    // Gradiente Neón Morado a Dorado
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.85)'); // Morado Neón
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0.45)');   // Dorado Neón

    graficaBarras = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datos.map(d => d.mes),
            datasets: [{
                label: 'Ventas ($)',
                data: datos.map(d => d.ventas),
                backgroundColor: gradient,
                borderColor: '#ffd700',
                borderWidth: 1.5,
                borderRadius: 8,
                hoverBackgroundColor: '#ffd700'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#ffd700', font: { family: 'Orbitron' } }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#9ca3af', font: { family: 'Plus Jakarta Sans' } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: '#9ca3af', font: { family: 'Plus Jakarta Sans' } },
                    grid: { color: 'rgba(168, 85, 247, 0.15)' }
                }
            }
        }
    });
}

// 6. Motor de Búsqueda Interactiva
function ejecutarBusqueda() {
    const query = document.getElementById('inputBusqueda').value.toLowerCase().trim();
    const contenedorRespuesta = document.getElementById('resultadoBusqueda');

    if (!query) {
        contenedorRespuesta.style.display = 'none';
        actualizarGrafica(datosVentas);
        return;
    }

    const total = datosVentas.reduce((acc, c) => acc + c.ventas, 0);
    const promedio = total / datosVentas.length;
    const max = datosVentas.reduce((m, c) => c.ventas > m.ventas ? c : m, datosVentas[0]);
    const min = datosVentas.reduce((m, c) => c.ventas < m.ventas ? c : m, datosVentas[0]);

    let respuesta = "";
    let datosFiltrados = [...datosVentas];

    if (query.includes('total') || query.includes('suma')) {
        respuesta = `El total acumulado registrado por el sistema es de $${total.toLocaleString()}.`;
    } else if (query.includes('promedio')) {
        respuesta = `El promedio mensual proyectado es de $${promedio.toFixed(2)}.`;
    } else if (query.includes('alto') || query.includes('maximo') || query.includes('mayor')) {
        respuesta = `El pico más alto de rendimiento corresponde a ${max.mes} con $${max.ventas.toLocaleString()}.`;
    } else if (query.includes('bajo') || query.includes('minimo') || query.includes('menor')) {
        respuesta = `El punto mínimo de ventas se registró en ${min.mes} con $${min.ventas.toLocaleString()}.`;
    } else {
        const mesMatch = datosVentas.find(d => query.includes(d.mes.toLowerCase()));
        if (mesMatch) {
            respuesta = `Informe para ${mesMatch.mes}: Se registraron ventas por $${mesMatch.ventas.toLocaleString()}.`;
            datosFiltrados = [mesMatch];
        } else {
            respuesta = `No se encontraron coincidencias para "${query}". Prueba consultando por un mes (ej. "Mayo"), "total", "promedio" o "más alto".`;
        }
    }

    contenedorRespuesta.style.display = 'block';
    contenedorRespuesta.innerHTML = `🤖 <strong>Análisis IA:</strong> ${respuesta}`;

    actualizarGrafica(datosFiltrados);
}

// 7. Actualizar vista de gráfica
function actualizarGrafica(nuevosDatos) {
    graficaBarras.data.labels = nuevosDatos.map(d => d.mes);
    graficaBarras.data.datasets[0].data = nuevosDatos.map(d => d.ventas);
    graficaBarras.update();
}