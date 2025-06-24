window.addEventListener("load",inicio)
let sistema = new Sistema()
let corredor = new Corredor()
let patrocinador = new Patrocinador()
function inicio(){
    document.getElementById("idDatos").addEventListener("click", mostrar)
    document.getElementById("idEstadisticas").addEventListener("click", mostrar)
    document.getElementById("agregar_carrera").addEventListener("click", sacarDatosCarrera)
    document.getElementById("agregar_patrocinador").addEventListener("click", sacarDatosPatrocinador)
    document.getElementById("agregar_corredor").addEventListener("click", sacarDatosCorredores)
    document.getElementById("agregar_inscripcion").addEventListener("click", sacarDatosInscripcion)
}


// ------------------Intefaz-------------------

function mostrar(evento){
    if(evento.target == document.getElementById("idDatos")){
        document.getElementById("datos").style.display = "block"
        document.getElementById("estadisticas").style.display = "none"
    } else {
        document.getElementById("datos").style.display = "none"
        document.getElementById("estadisticas").style.display = "block"   
    }
}

function actualizarSelectCarreras(selectId) {
    let select = document.getElementById(selectId);
    select.innerHTML = "";
    for (let carrera of sistema.listaCarreras) {
        let option = document.createElement("option");
        option.value = carrera.nombre;
        option.textContent = carrera.nombre;
        select.appendChild(option);
    }
}

//------------------------------------------


// ------------------------------ Carreras ---------------------------

function extraerDatosCarrera() {
    let inputCarreraNombre = document.getElementById("carreras_nombre");
    let inputCarreraDepartamento = document.getElementById("carreras_departamento");
    let inputCarreraFecha = document.getElementById("agregar_carrera_fecha");
    let inputCarreraCupos = document.getElementById("agregar_carrera_cupo");
    
    let carreraNombre = inputCarreraNombre.value
    let carreraDepartamento = inputCarreraDepartamento.value
    let carreraFecha = inputCarreraFecha.value
    let carreraCupos = inputCarreraCupos.value

    return new Carrera(carreraNombre, carreraDepartamento, carreraFecha, carreraCupos)
}


function sacarDatosCarrera (evento){
    evento.preventDefault()
    let newNombre = document.getElementById("carreras_nombre").value
    let newDepartamento = document.getElementById("carreras_departamento").value
    let newFecha = document.getElementById("agregar_carrera_fecha").value
    let newCupos = document.getElementById("agregar_carrera_cupo").value
    
    if(!sistema.existeCarrera(newNombre)) {
        let newArray =  new Carrera(newNombre , newDepartamento , newFecha , newCupos )
        sistema.agregarCarrera(newArray)
        let select = document.getElementById("patrocinadores_carreras");
        let option = document.createElement("option");
        option.value = newNombre;
        option.textContent = newNombre;
        select.appendChild(option);
        document.getElementById("carreras_nombre").value = ""
        document.getElementById("carreras_departamento").selectedIndex = 0
        document.getElementById("agregar_carrera_fecha").value = ""
        document.getElementById("agregar_carrera_cupo").value = "30"
        sistema.ordenarCarrerasPorNombre();
        actualizarSelectCarreras("inscripciones_carreras");
    }
}


// -------------------------
//-------------------------- Corredores ----------------------

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
        sistema.agregarCorredor(newArray)
        document.getElementById("corredores_nombreCorredor").value = ""
        document.getElementById("corredores_cedula").value = ""
        document.getElementById("corredores_edad").value = ""
        document.getElementById("corredores_fecha_vencimiento").value = ""
        sistema.ordenarCorredoresPorNombre();
        actualizarSelectCorredor("inscripciones_corredores");
    } else {
        alert("Ingrese datos nuevos, ya existe un corredor con esa cédula o ficha médica")
    }
}

function actualizarSelectCorredor(selectId) {
    let select = document.getElementById(selectId);
    select.innerHTML = "";
    for (let corredor of sistema.listaCorredores) {
        let option = document.createElement("option");
        option.value = corredor.cedula ;
        option.textContent = corredor.nombre + " - " + corredor.cedula;
        select.appendChild(option);
    }
}


//----------------------------------------

//-------------------------------- Patrocinadores -------------------

function sacarDatosPatrocinador(evento){
    evento.preventDefault()
    let newNombre = document.getElementById("patrocinadores_nombre").value
    let newRubro = document.getElementById("patrocinadores_rubro").value
    let select = document.getElementById("patrocinadores_carreras");
    let carreraEncontrada = []
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].selected) {
            carreraEncontrada.push(select.options[i].value);
        }
    }
    if (sistema.existePatrocinador(newNombre)) {
        sistema.actualizarRubroPatrocinador(newNombre, newRubro)
    } else {
        let newArray =  new Patrocinador(newNombre , newRubro, carreraEncontrada)
        sistema.agregarPatrocinador(newArray) 
    }

    document.getElementById("patrocinadores_nombre").value = ""
    document.getElementById("patrocinadores_rubro").selectedIndex = 0
    document.getElementById("patrocinadores_carreras").selectedIndex = 0
}


// ---------------------------------------


// -------------------- Inscripciones ---------------------------

function sacarDatosInscripcion(evento){
    evento.preventDefault()
    let selectCorredor = document.getElementById("inscripciones_corredores");
    let selectCarrera = document.getElementById("inscripciones_carreras");
    let selectPatrocinador = document.getElementById("patrocinadores_carreras");

    let corredorEncontrado = sistema.encontrarCorredor(selectCorredor.value)
    let carreraEncontrada = sistema.encontrarCarrera(selectCarrera.value);

    console.log(carreraEncontrada)
    console.log(corredorEncontrado)

    let patrocinadoresEncontrados = []
    
    for (let i = 0; i < sistema.listaPatrocinadores.length; i++) {
        if (sistema.listaPatrocinadores[i].carreras.includes(carreraEncontrada.nombre)){
            patrocinadoresEncontrados.push(sistema.listaPatrocinadores[i]);
        }
    }

    let nombrePatro = ""
    let rubroPatro = ""
    if(patrocinadorEncontrado) {
        nombrePatro = patrocinadorEncontrado.nombre;
        rubroPatro = patrocinadorEncontrado.rubro;
    }


    if(sistema.manejadorNuevaInscripcion(carreraEncontrada) && !sistema.validarFichaMedica(corredorEncontrado.fichaMedica)) {   
        let numeroIns = carreraEncontrada.cuposUsados + 1
        corredor.agregarInscripcion(numeroIns)
        let newArray =  new Inscripcion(corredorSeleccionado , carreraEncontrada , numeroIns)
        sistema.manejadorNuevaInscripcion(newArray)
        let info = "corredor:" + corredorEncontrado.nombre + "\nedad:" + corredorEncontrado.edad + "\ncedula:" + corredorEncontrado.cedula + "\nficha medica:" + corredorEncontrado.fichaMedica + "\nTipo de corredor: "+ corredorEncontrado.tipo+ "\ncarrera:" + carreraEncontrada.nombre + "\nDepartamento:" + carreraEncontrada.departamento+"\nfecha:" + carreraEncontrada.fecha + "\ncupos usados:" + carreraEncontrada.cuposUsados + "\nNombre de patrocinador: " + nombrePatro + "\nRubro de patrocinador: " + rubroPatro
        alert(info);

        descargarInscripcionPDF(info);
    } else {
        alert("No hay cupos disponibles para esta carrera, o la ficha médica está vencida para la fecha de la carrera.")
    }
}
 
// ---------------------------------------------


//------------------------- Manejo de pdf-------------------------

function descargarInscripcionPDF(info) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text(info, 10, 20);
        doc.save("inscripcion.pdf");
}

// ------------------------------------------------------------------
//-------------------------Estadisticas-------------------------
//------------------------Promedio de inscriptos por carrera-------------------------
function promedioInscriptosPorCarrera() {
    let totalInscriptosEnCarreras = 0;
    for (let carrera of sistema.listaCarreras) {
        totalInscriptosEnCarreras += carrera.cuposUsados;
    }
    totalInscriptosEnCarreras = totalInscriptosEnCarreras / sistema.listaCarreras.length;
    return totalInscriptosEnCarreras.toFixed(2);
}
//------------------------Carreras con más inscriptos-------------------------
function carrerasConMasInscriptos() {
    let carreraMasCuposUsados = ""
    let maxCuposUsados = 0;
    for (let carrera of sistema.listaCarreras) {
        if (carrera.cuposUsados > maxCuposUsados) {
            maxCuposUsados = carrera.cuposUsados;
            carreraMasCuposUsados = carrera.nombre;
        }
    }
    return carreraMasCuposUsados;
}

//----------------------------------------------------------------