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
            li.addEventListener('click', function() {
                notaActualIndex = index;
                tituloInput.value = notaObj.titulo;
                notaTextarea.value = notaObj.contenido;
                notaModal.style.display = 'flex';
            });
            listaNotas.appendChild(li);
        });
    }

    window.ajustarAltura = function(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    }

    toggleThemeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        toggleThemeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Tema Claro' : 'Tema Oscuro';
    });
});