window.addEventListener("load",inicio)
let sistema = new Sistema()
let corredor = new Corredor()
let patrocinador = new Patrocinador()
function inicio(){
    document.getElementById("idDatos").addEventListener("click", mostrar)
    document.getElementById("idEstadisticas").addEventListener("click", mostrar)

    document.getElementById("carreras_form").addEventListener("submit", sacarDatosCarrera)
    document.getElementById("patrocinadores_form").addEventListener("submit", sacarDatosPatrocinador)
    document.getElementById("corredores_form").addEventListener("submit", sacarDatosCorredores)
    document.getElementById("inscripciones_form").addEventListener("submit", sacarDatosInscripcion)
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


function sacarDatosCarrera (evento){
    evento.preventDefault()
    let newNombre = document.getElementById("carreras_nombre").value
    let newDepartamento = document.getElementById("carreras_departamento").value
    let newFecha = new Date(document.getElementById("agregar_carrera_fecha").value)
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
    let fecha = new Date(document.getElementById("corredores_fecha_vencimiento").value)
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

    let patrocinadoresEncontrados = []

    for (let i = 0; i < sistema.listaPatrocinadores.length; i++) {
        if (sistema.listaPatrocinadores[i].carreras.includes(carreraEncontrada.nombre)){
            patrocinadoresEncontrados.push(sistema.listaPatrocinadores[i]);
        }
    }

    let nombresPatrocinadores = []
    let rubrosPatrocinadores = []

    if(patrocinadoresEncontrados.length > 0) {
        for(let i =0; i < patrocinadoresEncontrados.length; i++) {
            nombresPatrocinadores.push(patrocinadoresEncontrados[i].nombre)
            rubrosPatrocinadores.push(patrocinadoresEncontrados[i].rubro)
        }
    }


    let numeroIns = carreraEncontrada.cuposUsados + 1
    let inscripcion = new Inscripcion(corredorEncontrado, carreraEncontrada, numeroIns)
    sistema.manejadorNuevaInscripcion(inscripcion);
    

let info = "corredor:" + corredorEncontrado.nombre + "\nedad:" + corredorEncontrado.edad + "\ncedula:" + corredorEncontrado.cedula + "\nficha medica:" + corredorEncontrado.fichaMedica + "\nTipo de corredor: "+ corredorEncontrado.tipo+ "\ncarrera:" + carreraEncontrada.nombre + "\nDepartamento:" + carreraEncontrada.departamento+"\nfecha:" + carreraEncontrada.fecha + "\ncupos usados:" + carreraEncontrada.cuposUsados + "\nNombre/es de patrocinador/es: " + nombresPatrocinadores + "\nRubro/s de patrocinador/es: " + rubrosPatrocinadores
alert(info);
descargarInscripcionPDF(info);
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

//-----------------Interfaz-----------------------------

function actualizar() {
    actualizarPromedioInscriptos()
    actualizarCarrerasMasInscriptos()
    actualizarCarrerasSinInscriptos()
}


function actualizarPromedioInscriptos() {
    let output_promedio_inscriptos = document.getElementById("output_promedio_inscriptos")
    output_promedio_inscriptos.innerText = promedioInscriptosPorCarrera()
}

function actualizarCarrerasMasInscriptos() {
    let lista = document.getElementById("lista_carreras_mas_inscriptos")
    let html = "" 
    for (let carrera of carrerasConMasInscriptos()) {
        html += `<li>${carrera.nombre}</li>`
    }
    lista.innerHTML = html
}

function actualizarCarrerasSinInscriptos() {
    let lista = document.getElementById("lista_carreras_sin_inscriptos")
    let html = "" 
    for (let carrera of carrerasSinInscriptos()) {
        html += `<li>${carrera.nombre}</li>`
    }
    lista.innerHTML = html
}

function actualizarPorcentajeElite() {
    let output_porcentaje_elite = document.getElementById("output_porcentaje_elite")

    output_porcentaje_elite.innerHTML = porcentajeCorredoresElite()
}



//------------------------Funciones de Carreras-------------------------
function promedioInscriptosPorCarrera() {
    let totalInscriptosEnCarreras = 0;
    for (let carrera of sistema.listaCarreras) {
        totalInscriptosEnCarreras += carrera.cuposUsados;
    }
    totalInscriptosEnCarreras = totalInscriptosEnCarreras / sistema.listaCarreras.length;
    return totalInscriptosEnCarreras.toFixed(2);
}

function carrerasConMasInscriptos() {
    let carrerasMasCuposUsados = []
    let maxCuposUsados = 0;
    for (let carrera of sistema.listaCarreras) {
        if (carrera.cuposUsados > maxCuposUsados) {
            maxCuposUsados = carrera.cuposUsados;
            carrerasMasCuposUsados = [];
            carrerasMasCuposUsados.push(carrera);
        } else if (carrera.cuposUsados == maxCuposUsados) {
            carrerasMasCuposUsados.push(carrera);
        }
    }
    return carrerasMasCuposUsados;
}

function carrerasSinInscriptos() {
    let carrerasSinInscriptos = [];
    for (let carrera of sistema.listaCarreras) {
        if (carrera.cuposUsados === 0) {
            carrerasSinInscriptos.push(carrera);
        }
    }
    carrerasSinInscriptos.sort((a, b) => a.fecha - b.fecha)
    return carrerasSinInscriptos;
}
//------------------------Funciones de Corredores-------------------------
function porcentajeCorredoresElite(){
    let totalCorredoresElite = 0
    let totalCorredores = sistema.listaCorredores.length;
    for (let corredor of listaCorredores){
        if(corredor.tipo === "Deportista de élite") {
            totalCorredoresElite += 1;
        }
    }
    return ((totalCorredoresElite / totalCorredores) * 100)
}

//----------------------------------------------------------------
//------------------consulta de inscriptos -----------------------
3
// ----------- Mapa Uruguay con GeoChart -----------
function dibujarMapaUruguay(datosDepartamentos) {
    google.charts.load('current', {
        'packages':['geochart'],
        // Solo Uruguay
        'mapsApiKey': 'TU_API_KEY_SI_LA_PEDÍS' // Opcional, para más detalles
    });
    google.charts.setOnLoadCallback(function() {
        var data = google.visualization.arrayToDataTable([
            ['Region', 'Valor'],
            // Ejemplo: ['UY-CA', 10], // Canelones
            // Llená esto con tus datos reales
            ...datosDepartamentos
        ]);

        var options = {
            region: 'UY', // Uruguay
            displayMode: 'regions',
            resolution: 'provinces',
            colorAxis: {colors: ['#e0f3db', '#43a2ca']}
        };

        var chart = new google.visualization.GeoChart(document.getElementById('mapa_uruguay'));
        chart.draw(data, options);
    });
}
let datos = [
    ['Region', 'Inscriptos'],
    ['UY-CA', 10], // Canelones
    ['UY-MO', 5],  // Montevideo
    ['UY-MA', 2],  // Maldonado
    ['UY-RO', 3],  // Rocha
    ['UY-PA', 4],  // Paysandú
    ['UY-SJ', 6],  // San José
    ['UY-TA', 1],  // Tacuarembó
    ['UY-FS', 8],  // Florida
    ['UY-CO', 7],  // Colonia
    ['UY-CA', 9],  // Canelones
    ['UY-AR', 2],  // Artigas
    ['UY-CA', 3],  // Cerro Largo
    ['UY-PA', 4],  // Paysandú
    ['UY-SO', 5],  // Soriano
    ['UY-TA', 6],  // Tacuarembó
    ['UY-RO', 7],  // Rivera
    ['UY-FS', 8],  // Flores
    ['UY-LA', 9],  // Lavalleja
    ['UY-MA', 10]  // Maldonado
    // ...otros departamentos
];
dibujarMapaUruguay(datos);