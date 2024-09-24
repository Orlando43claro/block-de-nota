document.addEventListener('DOMContentLoaded', function() {
    const listaNotas = document.getElementById('listaNotas');
    const agregarNotaBtn = document.getElementById('agregarNotaBtn');
    const notaModal = document.getElementById('notaModal');
    const cerrarModalBtn = document.querySelector('.close');
    const guardarBtn = document.getElementById('guardarBtn');
    const limpiarBtn = document.getElementById('limpiarBtn');
    const compartirBtn = document.getElementById('compartirBtn');
    const notaTextarea = document.getElementById('nota');
    const tituloInput = document.getElementById('tituloNota');
    const archivoInput = document.getElementById('archivoNota');
    const toggleThemeBtn = document.getElementById('toggleThemeBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    let notasGuardadas = JSON.parse(localStorage.getItem('notas')) || [];
    let notaActualIndex = null;

    // Persistencia de tema oscuro
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    cargarNotas();

    agregarNotaBtn.addEventListener('click', function() {
        notaActualIndex = null;
        notaTextarea.value = '';
        tituloInput.value = '';
        archivoInput.value = '';
        notaModal.style.display = 'flex';
    });

    cerrarModalBtn.addEventListener('click', function() {
        notaModal.style.display = 'none';
    });

    guardarBtn.addEventListener('click', function() {
        const titulo = tituloInput.value;
        const nota = notaTextarea.value;
        const archivo = archivoInput.files[0];

        // Validación del archivo: límite de tamaño 2MB
        if (archivo && archivo.size > 2097152) {
            alert('El archivo es demasiado grande (máximo 2MB).');
            return;
        }

        if (titulo && nota) {
            if (notaActualIndex === null) {
                guardarNota(titulo, nota, archivo);
            } else {
                editarNota(notaActualIndex, titulo, nota, archivo);
            }
            notaTextarea.value = '';
            tituloInput.value = '';
            archivoInput.value = '';
            notaModal.style.display = 'none';
            cargarNotas();
        } else {
            alert('Debes completar el título y la nota.');
        }
    });

    limpiarBtn.addEventListener('click', function() {
        notaTextarea.value = '';
        tituloInput.value = '';
        archivoInput.value = '';
    });

    compartirBtn.addEventListener('click', function() {
        const titulo = tituloInput.value;
        const nota = notaTextarea.value;
        if (titulo && nota && navigator.share) {
            navigator.share({
                title: titulo,
                text: nota,
            }).catch(err => alert('Error al compartir: ' + err));
        } else {
            alert('Esta funcionalidad no es compatible con tu navegador.');
        }
    });

    function borrarNota(index) {
        if (confirm('¿Estás seguro de que deseas borrar esta nota?')) {
            notasGuardadas.splice(index, 1); 
            localStorage.setItem('notas', JSON.stringify(notasGuardadas));
            cargarNotas(); 
        }
    }

    function guardarNota(titulo, nota, archivo) {
        const notaObj = { 
            titulo: titulo, 
            contenido: nota, 
            fecha: new Date(),
            archivo: archivo ? URL.createObjectURL(archivo) : null 
        };
        notasGuardadas.unshift(notaObj);
        localStorage.setItem('notas', JSON.stringify(notasGuardadas));
    }

    function editarNota(index, titulo, nota, archivo) {
        notasGuardadas[index].titulo = titulo;
        notasGuardadas[index].contenido = nota;
        if (archivo) {
            notasGuardadas[index].archivo = URL.createObjectURL(archivo); 
        }
        localStorage.setItem('notas', JSON.stringify(notasGuardadas));
    }

    function cargarNotas() {
        listaNotas.innerHTML = '';
        notasGuardadas.forEach((notaObj, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${notaObj.titulo}</strong>: ${notaObj.contenido.substring(0, 20)}...`;

            if (notaObj.archivo) {
                const enlaceArchivo = document.createElement('a');
                enlaceArchivo.href = notaObj.archivo;
                enlaceArchivo.target = '_blank';
                enlaceArchivo.innerText = 'Ver Archivo';
                enlaceArchivo.style.display = 'block'; 
                li.appendChild(enlaceArchivo);
            }

            const borrarBtn = document.createElement('button');
            borrarBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'; 
            borrarBtn.classList.add('borrar-btn');
            borrarBtn.addEventListener('click', function(event) {
                event.stopPropagation(); 
                borrarNota(index); 
            });

            li.addEventListener('click', function() {
                notaActualIndex = index;
                tituloInput.value = notaObj.titulo;
                notaTextarea.value = notaObj.contenido;
                notaModal.style.display = 'flex';
            });

            li.appendChild(borrarBtn); 
            listaNotas.appendChild(li);
        });
    }

    window.ajustarAltura = function(textarea) {
        textarea.style.height = 'auto'; 
        textarea.style.height = (textarea.scrollHeight) + 'px'; 
    };

    // Cambiar entre modo claro y oscuro
    toggleThemeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    });

    fullscreenBtn.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error al activar el modo de pantalla completa: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });
});
