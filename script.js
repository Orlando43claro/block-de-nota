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
    const toggleThemeBtn = document.getElementById('toggleThemeBtn');

    let notasGuardadas = JSON.parse(localStorage.getItem('notas')) || [];
    let notaActualIndex = null;

    cargarNotas();

    agregarNotaBtn.addEventListener('click', function() {
        notaActualIndex = null;
        notaTextarea.value = '';
        tituloInput.value = '';
        notaModal.style.display = 'flex';
    });

    cerrarModalBtn.addEventListener('click', function() {
        notaModal.style.display = 'none';
    });

    guardarBtn.addEventListener('click', function() {
        const titulo = tituloInput.value;
        const nota = notaTextarea.value;
        if (titulo && nota) {
            if (notaActualIndex === null) {
                guardarNota(titulo, nota);
            } else {
                editarNota(notaActualIndex, titulo, nota);
            }
            notaTextarea.value = '';
            tituloInput.value = '';
            notaModal.style.display = 'none';
            cargarNotas();
        } else {
            alert('Debes completar el título y la nota.');
        }
    });

    limpiarBtn.addEventListener('click', function() {
        notaTextarea.value = '';
        tituloInput.value = '';
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

    // Función para borrar solo la nota seleccionada
    function borrarNota(index) {
        if (confirm('¿Estás seguro de que deseas borrar esta nota?')) {
            notasGuardadas.splice(index, 1); // Eliminar la nota del array
            localStorage.setItem('notas', JSON.stringify(notasGuardadas));
            cargarNotas(); // Recargar las notas
        }
    }

    function guardarNota(titulo, nota) {
        notasGuardadas.unshift({ titulo: titulo, contenido: nota, fecha: new Date() });
        localStorage.setItem('notas', JSON.stringify(notasGuardadas));
    }

    function editarNota(index, titulo, nota) {
        notasGuardadas[index].titulo = titulo;
        notasGuardadas[index].contenido = nota;
        localStorage.setItem('notas', JSON.stringify(notasGuardadas));
    }

    function cargarNotas() {
        listaNotas.innerHTML = '';
        notasGuardadas.forEach((notaObj, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${notaObj.titulo}</strong>: ${notaObj.contenido.substring(0, 20)}...`;

            // Botón de borrar
            const borrarBtn = document.createElement('button');
            borrarBtn.innerText = 'Borrar'; // Puedes reemplazar este texto con un icono
            borrarBtn.classList.add('borrar-btn');
            borrarBtn.addEventListener('click', function(event) {
                event.stopPropagation(); // Evitar que se dispare el click en el li
                borrarNota(index); // Llamar a la función de borrar
            });

            li.addEventListener('click', function() {
                notaActualIndex = index;
                tituloInput.value = notaObj.titulo;
                notaTextarea.value = notaObj.contenido;
                notaModal.style.display = 'flex';
            });

            li.appendChild(borrarBtn); // Agregar el botón de borrar a la lista
            listaNotas.appendChild(li);
        });
    }

    // Ajustar la altura del textarea
    window.ajustarAltura = function(textarea) {
        textarea.style.height = 'auto'; // Reseteamos la altura
        textarea.style.height = (textarea.scrollHeight) + 'px'; // Ajustamos a su contenido
    };

    // Cambiar entre modo claro y oscuro
    toggleThemeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });
});
