const sectionHome = document.getElementById('section-home');
const sectionMembers = document.getElementById('section-members');
const urlBase = "http://localhost:8080/api";

// obtener valores del form
let idInput = document.getElementById('id');
let nombreInput = document.getElementById('nombre');
let apellidoInput = document.getElementById('apellido');
let celularInput = document.getElementById('celular');
let masculinoRadio = document.getElementById('masculino');
let femeninoRadio = document.getElementById('femenino');
let siRadio = document.getElementById('si');
let noRadio = document.getElementById('no');
let tutorInput = document.getElementById('tutor');
// TESOROS DE LA BIBLIA
let presidenteCheckbox = document.getElementById('presidente');
let oracionCheckbox = document.getElementById('oracion');
let tesorosCheckbox = document.getElementById('tesoros');
let perlasCheckbox = document.getElementById('perlas');
let lecturaCheckbox = document.getElementById('lectura');
// SEAMOS MEJORES MAESTROS
let conversacionCheckbox = document.getElementById('conversacion');
let revisitasCheckbox = document.getElementById('revisitas');
let discipulosCheckbox = document.getElementById('discipulos');
let creenciasCheckbox = document.getElementById('creencias');
let ayudanteCheckbox = document.getElementById('ayudante');
let discursoCheckbox = document.getElementById('discurso');
// NUESTRA VIDA CRISTIANA
let intervencionesCheckbox = document.getElementById('intervenciones');
let estudioCheckbox = document.getElementById('estudio');
let lectorCheckbox = document.getElementById('lector');
// TAREAS
let acomodadorCheckbox = document.getElementById('acomodador');
let microfonistaCheckbox = document.getElementById('microfonista');
let audioCheckbox = document.getElementById('audio');
let videoCheckbox = document.getElementById('video');
let plataformaCheckbox = document.getElementById('plataforma');
let tasksCheckbox = document.querySelectorAll('[data-id_task]');
let idsMembers = [];
let nombresMembers = [];
let apellidosMembers = [];
let allMembers = [];

//mostrar u ocultar section principal
const mostrarHome = () => {
    if(sectionHome.style.display === 'none'){
        sectionHome.style.display = 'flex';
        sectionMembers.style.display = 'none';
    }else{
        sectionHome.style.display = 'none';
    }
}

//mostrar u ocultar section members
const mostrarMembers = () => {
    if(sectionMembers.style.display === 'none'){
        sectionMembers.style.display = 'flex';
        sectionHome.style.display = 'none';
    }else{
        sectionMembers.style.display = 'none';
    }
}


document.addEventListener('DOMContentLoaded', function() {
    cargarMembers();
    const nombreBuscador = document.getElementById('buscador-nombre');
    const tableBody = document.getElementById('tabla-members-datos');
    
    // funcion para busqueda de members
    function buscarMembers() {
        const nombre = nombreBuscador.value.toLowerCase();
        const membersFiltrados = allMembers.filter(member => {
            return member.nombre.toLowerCase().startsWith(nombre) || member.apellido.toLowerCase().startsWith(nombre);
        });

        tableBody.innerHTML = "";
        if (membersFiltrados.length === 0) {
            tableBody.innerHTML = "";
        } else {
            membersFiltrados.forEach(member => {
                const newRow = document.createElement('tr');
                newRow.addEventListener('click', () => rellenarFormulario(member)); 
                const tdID = document.createElement('td');
                tdID.textContent = `${member.id_member}`;
                newRow.appendChild(tdID);
                const tdNombre = document.createElement('td');
                tdNombre.textContent = `${member.nombre}`;
                newRow.appendChild(tdNombre);
                const tdApellido = document.createElement('td');
                tdApellido.textContent = `${member.apellido}`;
                newRow.appendChild(tdApellido);
                tableBody.appendChild(newRow);
            });
        }

    }
    nombreBuscador.addEventListener('input', buscarMembers);

});

const cargarTaskDetail = (idMember) => {
    axios.get(`${urlBase}/tasksdetail/member/${idMember}`).then(response => {
        const dataTasksDetail = response.data;
        dataTasksDetail.forEach(taskByMember => {
            cargarTasks(taskByMember.id_task);
        })
    }).catch(error => console.error("No se pudo obtener las tareas del hermano. ",error));
}

const cargarTasksByMember = (idMember) => {
    estadoInicialTasks = [];
    axios.get(`${urlBase}/tasksdetail/member/${idMember}`).then(response => {
        const dataTasksDetail = response.data;
        dataTasksDetail.forEach(taskByMember => {
            estadoInicialTasks.push(taskByMember);
        })
    }).catch(error => console.error("No se pudo obtener las tareas del hermano. ",error));
}

const cargarTasks = (idTask) => {
    axios.get(`${urlBase}/tasks/${idTask}`).then(response => {
        const dataTask = response.data;
        tasksCheckbox.forEach(task => {
            const taskId = parseInt(task.dataset.id_task);
            if(taskId === dataTask.id_task){
                task.checked = true;
            }
        });
    }).catch(error => console.error("No se pudo obtener las tareas del hermano. ",error));
}

const cargarMembers = () => {
    allMembers = [];
    idsMembers = [];
    nombresMembers = [];
    apellidosMembers = [];

    axios.get(`${urlBase}/members`)
    .then(response => {
        const data = response.data;
        const tableBody = document.getElementById('tabla-members-datos');
        tableBody.innerHTML = "";
        data.sort((a, b) => {
            if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) return -1;
            if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) return 1;
            return 0;
        });
        data.forEach(member => {
            const row = document.createElement('tr');
            row.addEventListener('click', () => rellenarFormulario(member)); 
            const cellId = document.createElement('td');
            cellId.textContent = member.id_member;
            row.appendChild(cellId);
            const cellName = document.createElement('td');
            cellName.textContent = member.nombre;
            row.appendChild(cellName);
            const cellSubname = document.createElement('td');
            cellSubname.textContent = member.apellido;
            row.appendChild(cellSubname);
            tableBody.appendChild(row);
            allMembers.push(member);
            idsMembers.push(member.id_member);
            nombresMembers.push(member.nombre);
            apellidosMembers.push(member.apellido); 
        });
    })
    .catch(error => console.error('Error fetching data:', error));
}

const mostrarTutor = () => {
    tutorInput.style.visibility = 'visible';
}

const ocultarTutor = () => {
    tutorInput.style.visibility = 'hidden';
    tutorInput.value = "";
}

// funcion para rellenar formulario al clickear una fila de un member
const rellenarFormulario = (member) => {
    deshabilitarFormulario();
    limpiarFormulario();
    document.getElementById('boton-crear').style.visibility = 'hidden';
    document.getElementById('boton-guardar-cambios').style.visibility = 'hidden';
    document.getElementById('boton-editar').style.visibility = 'visible';
    idInput.value = member.id_member;
    nombreInput.value = member.nombre;
    apellidoInput.value = member.apellido;
    celularInput.value = member.celular;
    if(member.genero === 'masculino') masculinoRadio.checked = true;
    else femeninoRadio.checked = true;
    if(member.tutor === null){
        noRadio.checked = true;
        tutorInput.style.visibility = 'hidden';
    }    
    else {
        siRadio.checked = true;
        tutorInput.style.visibility = 'visible';
        tutorInput.value = member.tutor;
    }
    cargarTasksDetail(idInput.value);
}

const habilitarFormulario = () => {
    nombreInput.disabled = false;
    apellidoInput.disabled = false;
    celularInput.disabled = false;
    masculinoRadio.disabled = false;
    femeninoRadio.disabled = false;
    siRadio.disabled = false;
    noRadio.disabled = false;
    tutorInput.disabled = false;
    presidenteCheckbox.disabled = false;
    oracionCheckbox.disabled = false;
    tesorosCheckbox.disabled = false;
    perlasCheckbox.disabled = false;
    lecturaCheckbox.disabled = false;
    conversacionCheckbox.disabled = false;
    revisitasCheckbox.disabled = false;
    discipulosCheckbox.disabled = false;
    creenciasCheckbox.disabled = false;
    ayudanteCheckbox.disabled = false;
    discursoCheckbox.disabled = false;
    intervencionesCheckbox.disabled = false;
    estudioCheckbox.disabled = false;
    lectorCheckbox.disabled = false;
    acomodadorCheckbox.disabled = false;
    microfonistaCheckbox.disabled = false;
    audioCheckbox.disabled = false;
    videoCheckbox.disabled = false;
    plataformaCheckbox.disabled = false;
}

const deshabilitarFormulario = () => {
    nombreInput.disabled = true;
    apellidoInput.disabled = true;
    celularInput.disabled = true;
    masculinoRadio.disabled = true;
    femeninoRadio.disabled = true;
    siRadio.disabled = true;
    noRadio.disabled = true;
    tutorInput.disabled = true;
    presidenteCheckbox.disabled = true;
    oracionCheckbox.disabled = true;
    tesorosCheckbox.disabled = true;
    perlasCheckbox.disabled = true;
    lecturaCheckbox.disabled = true;
    conversacionCheckbox.disabled = true;
    revisitasCheckbox.disabled = true;
    discipulosCheckbox.disabled = true;
    creenciasCheckbox.disabled = true;
    ayudanteCheckbox.disabled = true;
    discursoCheckbox.disabled = true;
    intervencionesCheckbox.disabled = true;
    estudioCheckbox.disabled = true;
    lectorCheckbox.disabled = true;
    acomodadorCheckbox.disabled = true;
    microfonistaCheckbox.disabled = true;
    audioCheckbox.disabled = true;
    videoCheckbox.disabled = true;
    plataformaCheckbox.disabled = true;
}

//variables creadas para ver si se cambia el nombre o apellido a editar antes de clickear para guardar cambios
let estadoInicialTasks = [];
let nombreAntesDeEditar = "";
let apellidoAntesDeEditar = "";
const editarMember = () => {
    nombreAntesDeEditar = "";
    apellidoAntesDeEditar = "";
    cargarTasksByMember(idInput.value);
    habilitarFormulario();
    document.getElementById('boton-guardar-cambios').style.visibility = 'visible';
    document.getElementById('boton-crear').style.visibility = 'hidden';
    nombreAntesDeEditar = nombreInput.value;
    apellidoAntesDeEditar = apellidoInput.value;
}

const putMember = () => {
    let validacion = validarFormulario(false);
    if(validacion){
    let estadoFinalTasks = [];
    tasksCheckbox.forEach(task => {
        if(task.checked === true){
            estadoFinalTasks.push(task.dataset.id_task);
        }
    });
    let idMember = idInput.value;
    let member = cargarDatosFormulario();
    const tasksAAgregar = estadoFinalTasks.filter(idTask => !estadoInicialTasks.some(t => t.id_task === parseInt(idTask)));
    let ban = false;
    for(let i = 0; i<estadoInicialTasks.length;i++){
        for(let j=0;j<estadoFinalTasks.length;j++){
        ban = false;
            if(parseInt(estadoInicialTasks[i].id_task) === parseInt(estadoFinalTasks[j])){
                ban = true;
            }
        }
        if(ban === false){
            axios.delete(`${urlBase}/tasksdetail/${estadoInicialTasks[i].id_detalle_task}`).then(response => {
                console.log(`TAREA ELIMINADA`);
            })
            .catch(error => console.error("No se pudo eliminar la tarea ", error));
        }
    }

    axios.put(`${urlBase}/members/${idMember}`, member).then(response => {
        tasksAAgregar.forEach(taskAdd => {
            const taskDetail = {
                id_member: idMember,
                id_task: parseInt(taskAdd),
            }
            axios.post(`${urlBase}/tasksdetail`, taskDetail).then(response => {
                console.log(`TAREA AGREGADA`);
            })
            .catch(error => console.error("No se pudo agregar la tarea ", error));;
        });

        alert("Hermano modificado exitosamente");
        updateMember();
    }).catch(error => console.error('Error al modificar el hermano: ', error));
    }
}

const limpiarFormulario = () => {
    nombreInput.value = "";
    apellidoInput.value = "";
    celularInput.value = "";
    masculinoRadio.checked = false;
    femeninoRadio.checked = false;
    siRadio.checked = false;
    noRadio.checked = false;
    tutorInput.value = "";
    presidenteCheckbox.checked = false;
    oracionCheckbox.checked = false;
    tesorosCheckbox.checked = false;
    perlasCheckbox.checked = false;
    lecturaCheckbox.checked = false;
    conversacionCheckbox.checked = false;
    revisitasCheckbox.checked = false;
    discipulosCheckbox.checked = false;
    creenciasCheckbox.checked = false;
    ayudanteCheckbox.checked = false;
    discursoCheckbox.disabled = false;
    intervencionesCheckbox.checked = false;
    estudioCheckbox.checked = false;
    lectorCheckbox.checked = false;
    acomodadorCheckbox.checked = false;
    microfonistaCheckbox.checked = false;
    audioCheckbox.checked = false;
    videoCheckbox.checked = false;
    plataformaCheckbox.checked = false;
    tasksMember = [];
    document.getElementById('boton-editar').style.visibility = 'hidden';
    document.getElementById('boton-guardar-cambios').style.visibility = 'hidden';
}


const crearMember = () => {
    limpiarFormulario();
    habilitarFormulario();
    cleanId();
    document.getElementById('boton-crear').style.visibility = 'visible';
    document.getElementById('boton-guardar-cambios').style.visibility = 'hidden';
    document.getElementById('boton-editar').style.visibility = 'hidden';
}

const saveMember = () => {
    let validacion = validarFormulario(true);
    if(validacion){
        let member = cargarDatosFormulario();
        axios.post(`${urlBase}/members`, member).then(response => {
            tasksCheckbox.forEach(task => {
                if(task.checked === true){
                    const taskDetail = {
                        id_member: response.data.id_member,
                        id_task: parseInt(task.dataset.id_task),
                    }
                    axios.post(`${urlBase}/tasksdetail`, taskDetail);
                }
            });
            alert("Hermano registrado exitosamente");
            updateMember();
        }).catch(error => console.error('No se pudo crear al hermano: ',error))
    }
}

const cargarDatosFormulario = () => {
    let generoMember;
    let tutorMember;
    if(masculinoRadio.checked) generoMember = "masculino";
    else generoMember = "femenino";
    if(noRadio.checked) tutorMember = ""; 
    else tutorMember = tutorInput.value;
    const member = {
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
        celular: celularInput.value,
        genero: generoMember,
        tutor:  tutorMember
    }
    return member;
}

const cleanId=()=>{
    idInput.value = "";
}

const borrarMember = () => {
    let idMember = idInput.value;
    let member = cargarDatosFormulario();
    if(idMember === ""){
        alert("Debe seleccionar un hermano");
    }else{
        let ban = confirm(`Desea eliminar al hermano ID ${idMember} - ${member.nombre} ${member.apellido}?`);
        if(ban){
            axios.delete(`${urlBase}/assignment/member/${idMember}`).then(response => {
                console.log(`Tarea eliminada`);
            })
            .catch(error => console.error("No se pudo eliminar la tarea ", error));
            axios.delete(`${urlBase}/members/${idMember}`).then(response =>{
                alert("Hermano eliminado");
                updateMember();
            }).catch(error => {
                alert("No se pudo eliminar al hermano. ", error);
            })
        }
    }
}

const updateMember = () => {
    cargarMembers();
    limpiarFormulario();
    deshabilitarFormulario();
    cleanId();
}

const validarFormulario = (vdCreate) => {
    let banValidacion = true;
    let alertaValidacion = "ERROR \n"
    let banId = false;
    let banTasks = false;
    let banNombre = false;
    let banNombreEdit = false;
    let banApellidoEdit = false;
    let vdCreateForm = vdCreate;
    //validacion nombre y apellido para crear hermano (que cumpla con la cantidad de caracteres)
    if(nombreInput.value.length < 2 || nombreInput.value.length > 15){
        alertaValidacion += "- Debe ingresar un nombre valido.\n";
    }
    if(apellidoInput.value.length < 2 || apellidoInput.value.length > 15){
        alertaValidacion += "- Debe ingresar un apellido valido.\n";
    }

    //validacion nombre y apellido para crear hermano (que no exista uno ya con el mismo nombre y apellido)
    if(vdCreateForm){
        allMembers.forEach(member => {
            if(member.nombre === nombreInput.value){
                if(member.apellido === apellidoInput.value){
                    banNombre = true;
                }
            }
        })
    }
    if(banNombre) alertaValidacion += "- Ya se encuentra registrado un hermano con ese nombre y apellido. \n";


    //validacion nombre y apellido para editar hermano (que no exista uno ya con el mismo nombre y apellido)

    if(nombreAntesDeEditar !== nombreInput.value){
        allMembers.forEach(member => {
            if(member.nombre === nombreInput.value){
                if(member.apellido === apellidoInput.value){
                    banNombreEdit = true;
                }
            }
        })
    }
    if(banNombreEdit) alertaValidacion += "- Ya se encuentra registrado un hermano con ese nombre y apellido.\n";


    if(apellidoAntesDeEditar !== apellidoInput.value){
        allMembers.forEach(member => {
            if(member.apellido === apellidoInput.value){
                if(member.nombre === nombreInput.value){
                    banApellidoEdit = true;
                }
            }
        })
    }
    if(banApellidoEdit) alertaValidacion += "- Ya se encuentra registrado un hermano con ese nombre y apellido. \n";



    if(celularInput.value.length > 0){
        if(celularInput.value.length < 8 || celularInput.value.length > 12){
            alertaValidacion += "- Debe ingresar un numero de celular valido.\n";
        }
    }
    if(masculinoRadio.checked === false && femeninoRadio.checked === false){
        alertaValidacion += "- Debe seleccionar un genero.\n";
    }
    if(siRadio.checked === false && noRadio.checked === false){
        alertaValidacion += "- Debe seleccionar si tiene o no un tutor.\n";
    }else if(siRadio.checked){
        if(tutorInput.value.length === 0){
        alertaValidacion += "- Debe escribir un ID de tutor.\n";
        }else{
            idsMembers.forEach(id => {
                if(parseInt(id) === parseInt(tutorInput.value)){
                    banId = true;
                }
            })
        if(banId === false ) alertaValidacion += "- Debe escribir un ID de tutor existente.\n";
        }
    }


    tasksCheckbox.forEach(task => {
        if(task.checked === true){
            banTasks = true;
        }
    })
    if(banTasks === false) alertaValidacion += "- Debe seleccionar al menos una tarea.\n";


    if(alertaValidacion.length > 7){
        alert(`${alertaValidacion}`);
        banValidacion = false;
    }else banValidacion = true;
    return banValidacion
}

