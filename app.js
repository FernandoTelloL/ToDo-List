const d = document;
const formulario = d.getElementById('formulario');
const input = d.getElementById('input');
const listaTarea = d.getElementById('lista-tareas');
const template = d.getElementById('template').content;
const fragment = d.createDocumentFragment();
let tareas = {};

d.addEventListener('DOMContentLoaded', () => {
  //revisa si hay tareas en el local storage para pintar al cargar la página
  if (localStorage.getItem('tareas')) {
    tareas = JSON.parse(localStorage.getItem('tareas'));
  }
  pintarTareas();
});

//selecciono todas las tareas y realizamos algo de acuerdo al icono que hacemos click
listaTarea.addEventListener('click', e => {
  btnAccion(e);
});

//configuro el comportamiento del formulario al mandar la información en este caso es de un solo input
formulario.addEventListener('submit', e => {
  e.preventDefault();
  setTarea(e);
});

const setTarea = e => {
  //verifico si el campo esta vacío, le puse console pero para mejorarlo le puede poner una notificacion que salga en medio de la pantalla
  if (input.value.trim() === '') {
    console.log('esta vacio');
    return;
  }

  //creo el objeto que sera mi tarea con todos los datos que necesito, para que el id no se repita utilizo Date.now()
  const tarea = {
    id: Date.now(),
    texto: input.value,
    estado: false,
  };

  /* 
  Agrego el objeto con la nueva tarea a mi variable tareas, le agregue como id identificador de mi llave tambien Date.now, es una estructura parecida a como se usa en firebase, mas o menos queda asi:

  1638452300528 {
    id: 1638452300528
    texto: "tarea #1"
    estado: false
  }
  
  */
  tareas[tarea.id] = tarea;

  //quito lo que escribí en el input
  formulario.reset();

  //vuelvo el foco al input para ingresar otra tarea
  input.focus();

  //pinto las tareas que tengo dento de mi web
  pintarTareas();
};

const pintarTareas = () => {
  //agrego las tareas al local storage para tenerlas disponibles cuando recargue, aunque seria mejor llamaras desde firebase por ejemplo, puede ser implementado despues tu diras Ricardo
  localStorage.setItem('tareas', JSON.stringify(tareas));

  //si no existe ningua tarea en la variable tareas pinto el mensaje de no hay tareas, ten en cuenta que utilizo para este proyecto bootstrap, los colores se configuran con las clases que puse, IMPORTANTE, si se entra en este if si o si al final del if se saldrá de la funcion porque hay un return lo que provoca que no se tome en cuenta todo el resto de la función
  if (Object.values(tareas).length === 0) {
    listaTarea.innerHTML = `
      <div class='alert alert-dark text-center'>
        No hay tareas pendientes 😍
      </div>
    `;
    return;
  }

  //en el caso que no este vacia la variable tareas se limpia el div donde van a ir dibujadas las tareas para evitar que se dupliquen los datos
  listaTarea.innerHTML = '';

  // esta funcion recorre un objeto
  Object.values(tareas).forEach(tarea => {
    //para usar template primero se hace el clon del template
    const clone = template.cloneNode(true);
    //modificamos el clone del template agregandole el texto de nuestras tareas
    clone.querySelector('p').textContent = tarea.texto;

    // en este caso pregunto el estado para poder cambiar el icono,depende si esta en true o false
    if (tarea.estado) {
      clone
        .querySelector('.alert')
        .classList.replace('alert-warning', 'alert-primary');

      clone
        .querySelectorAll('.fas')[0]
        .classList.replace('fa-check-circle', 'fa-undo-alt');

      clone.querySelector('p').style.textDecoration = 'line-through';
    }

    // como tengo dos iconos que comparten la clase fas, les agrego el atributo data-id con el id de la tarea para poder diferenciarlos
    clone.querySelectorAll('.fas')[0].dataset.id = tarea.id;
    clone.querySelectorAll('.fas')[1].dataset.id = tarea.id;

    // agregamos al fragment todo lo que hemos clonado
    fragment.appendChild(clone);
  });
  //pinto el fragment en el DOM, es importante hacerlo fuera del forEach
  listaTarea.appendChild(fragment);
};

/* esta funcion trabaja con los iconos de los elementos de la lista, dependiendo del icono se ejecuta algo, se esta seleccionando segun la clase que tienen */
const btnAccion = e => {
  if (e.target.classList.contains('fa-check-circle')) {
    tareas[e.target.dataset.id].estado = true;
    pintarTareas();
  }

  if (e.target.classList.contains('fa-minus-circle')) {
    delete tareas[e.target.dataset.id];
    pintarTareas();
  }

  if (e.target.classList.contains('fa-undo-alt')) {
    tareas[e.target.dataset.id].estado = false;
    pintarTareas();
  }

  e.stopPropagation();
};
