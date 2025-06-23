window.addEventListener("load",inicio)
let sistema = new Sistema()
function inicio(){
    document.getElementById("idDatos").addEventListener("click", mostrar)
    document.getElementById("idEstadisticas").addEventListener("click", mostrar)
    document.getElementById("agregar_carrera").addEventListener("click", sacarDatosCarrera)
    document.getElementById("agregar_patrocinador").addEventListener("click", sacarDatosPatrocinador)
    document.getElementById("agregar_corredor").addEventListener("click", sacarDatosCorredores)
    document.getElementById("agregar_inscripcion").addEventListener("click", sacarDatosInscripcion)
}


function mostrar(evento){
    if(evento.target == document.getElementById("idDatos")){
        document.getElementById("datos").style.display = "block"
        document.getElementById("estadisticas").style.display = "none"
    } else {
        document.getElementById("datos").style.display = "none"
        document.getElementById("estadisticas").style.display = "block"   
    }
}


function sacarDatosCarrera (evento){
    evento.preventDefault()
    let newNombre = document.getElementById("carreras_nombre").value
    let newDepartamento = document.getElementById("carreras_departamento").value
    let newFecha = document.getElementById("agregar_carrera_fecha").value
    let newCupos = document.getElementById("agregar_carrera_cupo").value
    if(!sistema.validarNom(newNombre)) {
        let newArray =  new Carrera(newNombre , newDepartamento , newFecha , newCupos )
        sistema.nuevaCarrera(newArray)
        let select = document.getElementById("patrocinadores_carreras");
        let option = document.createElement("option");
        option.value = newNombre;
        option.textContent = newNombre;
        select.appendChild(option);
        document.getElementById("carreras_nombre").value = ""
        document.getElementById("carreras_departamento").selectedIndex = 0
        document.getElementById("agregar_carrera_fecha").value = ""
        document.getElementById("agregar_carrera_cupo").value = "30"
        actualizarSelectCarreras("inscripciones_carreras");
    }
}


function actualizarSelectCarreras(selectId) {
    let select = document.getElementById(selectId);
    select.innerHTML = "";
    for (let carrera of sistema.listaCarrera) {
        let option = document.createElement("option");
        option.value = carrera.nombre;
        option.textContent = carrera.nombre;
        select.appendChild(option);
    }
}


function actualizarSelectCorredor(selectId) {
    let select = document.getElementById(selectId);
    select.innerHTML = "";
    for (let corredor of sistema.listaCorredor) {
        let option = document.createElement("option");
        option.value = corredor.nombre ;
        option.textContent = corredor.nombre + " - " + corredor.cedula;
        select.appendChild(option);
    }
}


function sacarDatosPatrocinador(evento){
    evento.preventDefault()
    let newNombre = document.getElementById("patrocinadores_nombre").value
    let newRubro = document.getElementById("patrocinadores_rubro").value
    let select = document.getElementById("patrocinadores_carreras");
    let carreraSeleccionada = []
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].selected) {
            carreraSeleccionada.push(select.options[i].value);
        }
    }
    if(!sistema.validarNomRub(newNombre, newRubro) && !sistema.actualizarRubro(newNombre, newRubro)) {
        let newArray =  new Patrocinador(newNombre , newRubro, carreraSeleccionada)
        sistema.nuevoPatrocinador(newArray)
        document.getElementById("patrocinadores_nombre").value = ""
        document.getElementById("patrocinadores_rubro").selectedIndex = 0
        document.getElementById("patrocinadores_carreras").selectedIndex = 0
    } else {
        document.getElementById("patrocinadores_nombre").value = ""
        document.getElementById("patrocinadores_rubro").selectedIndex = 0
        document.getElementById("patrocinadores_carreras").selectedIndex = 0
    }
}


function sacarDatosCorredores(evento){
    evento.preventDefault()
    let newNombre = document.getElementById("corredores_nombreCorredor").value
    let cedula = document.getElementById("corredores_cedula").value
    let edad = document.getElementById("corredores_edad").value
    let fecha = document.getElementById("corredores_fecha_vencimiento").value
    let tipoCorredor = ""
    if(document.getElementById("corredores_tipo_corredor_elite").checked){
        tipoCorredor = "Deportista de élite"
    } else {
        tipoCorredor = "Deportista Común"
    }
    if(!sistema.validarCedula(cedula)) {
        let newArray =  new Corredor(newNombre , edad , cedula , fecha, tipoCorredor)
        sistema.nuevoCorredor(newArray)
        document.getElementById("corredores_nombreCorredor").value = ""
        document.getElementById("corredores_cedula").value = ""
        document.getElementById("corredores_edad").value = ""
        document.getElementById("corredores_fecha_vencimiento").value = ""
        actualizarSelectCorredor("inscripciones_corredores");
    } else {
        alert("Ingrese datos nuevos, ya existe un corredor con esa cédula o ficha médica")
    }
}


function sacarDatosInscripcion(evento){
    evento.preventDefault()
    let selectCorredor = document.getElementById("inscripciones_corredores");
    let corredorSeleccionado = selectCorredor.value;
    let selectCarrera = document.getElementById("inscripciones_carreras");
    let carreraSeleccionadaNombre = selectCarrera.value;
    let carreraSeleccionada ;
    for (let i = 0; i < sistema.listaCarrera.length; i++) {
        if (sistema.listaCarrera[i].nombre === carreraSeleccionadaNombre) {
            carreraSeleccionada = sistema.listaCarrera[i];
            break;
        }
    }
    let corredorEncontrado = sistema.encontrarCorredor(corredorSeleccionado)
    

    if(sistema.valdiarNuevaInscripcion(carreraSeleccionada) && !sistema.validarFichaMedica(corredorEncontrado)) {   
        let newArray =  new Inscripcion(corredorSeleccionado , carreraSeleccionada)
        sistema.nuevaInscripcion(newArray)
    } else {
        alert("No hay cupos disponibles para esta carrera")
    }
}
