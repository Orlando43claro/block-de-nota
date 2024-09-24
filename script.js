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
    const temaSelect = document.getElementById('temaSelect');

    let notasGuardadas = JSON.parse(localStorage.getItem('notas')) || [];
    let notaActualIndex = null;

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
            mostrarNotificacion(titulo); // Mostrar notificación
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

    // Función para mostrar notificación
    function mostrarNotificacion(titulo) {
        if (Notification.permission === 'granted') {
            new Notification('Nota guardada', {
                body: `Se ha guardado la nota: ${titulo}`,
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Nota guardada', {
                        body: `Se ha guardado la nota: ${titulo}`,
                    });
                }
            });
        }
    }

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
            borrarBtn.innerText = 'Borrar'; // Puedes reemplazar este texto con un icono
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

    toggleThemeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });

    temaSelect.addEventListener('change', function() {
        const tema = temaSelect.value;
        document.body.className = tema; // Cambiar la clase del cuerpo según la selección
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
