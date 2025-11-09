const inputFiltro = document.getElementById('input-filtro');
const listaArchivos = document.getElementById('lista-archivos');
const visorPdf = document.getElementById('visor-pdf');
const mensajeVisor = document.getElementById('mensaje-visor');

// Usamos la lista global LISTA_REPORTES cargada desde listado_reportes.js
let archivosCargados = LISTA_REPORTES; 

/**
 * Filtra los archivos por texto de búsqueda y renderiza la lista.
 */
function renderizarListaArchivos() {
    // Normalizamos el texto de búsqueda (Ej: quita acentos)
    const filtroTexto = inputFiltro.value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // 1. Aplicar filtro a la lista global
    const archivosFiltrados = archivosCargados.filter(archivo => {
        // Creamos una cadena de búsqueda que incluye nombre, tipo, mes y año
        const busquedaTotal = `${archivo.name} ${archivo.type} ${archivo.month} ${archivo.year}`
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        return busquedaTotal.includes(filtroTexto);
    });

    // 2. Generar HTML de la lista
    let htmlContent = '';
    
    if (archivosFiltrados.length === 0) {
        htmlContent = '<p style="color: #666;">No se encontraron reportes que coincidan con la búsqueda.</p>';
    } else {
        archivosFiltrados.forEach((archivo) => {
            // Usamos el 'type' para distinguirlos visualmente 
            const claseTipo = (archivo.type === 'Balance') ? 'tipo-balance' : 'tipo-estancia';
            
            htmlContent += `
                <div class="archivo-item ${claseTipo}" data-path="${archivo.path}" data-name="${archivo.name}">
                    <span style="font-weight: bold;">[${archivo.type}]</span> ${archivo.name}
                </div>
            `;
        });
    }
    
    listaArchivos.innerHTML = htmlContent;
    
    // 3. Conectar eventos click
    conectarEventosLista();
}

/**
 * Conecta el evento click para visualizar el PDF.
 */
function conectarEventosLista() {
    document.querySelectorAll('.archivo-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Usamos el 'data-path' para cargar la ruta del archivo en el repositorio
            const path = e.currentTarget.dataset.path;
            const name = e.currentTarget.dataset.name;
            
            visorPdf.src = path; 
            mensajeVisor.textContent = `Visualizando: ${name}`;

            document.querySelectorAll('.archivo-item').forEach(el => el.classList.remove('activo'));
            e.currentTarget.classList.add('activo');
        });
    });
}


// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa el reporte al cargar
    renderizarListaArchivos(); 

    // 2. Listener para el filtrado en tiempo real
    inputFiltro.addEventListener('input', renderizarListaArchivos);
});