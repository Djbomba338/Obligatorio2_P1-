window.addEventListener("load", inicio);
let sistema = new Sistema();
let corredor = new Corredor();
let patrocinador = new Patrocinador();
function inicio() {
	document.getElementById("idDatos").addEventListener("click", mostrar);
	document.getElementById("idEstadisticas").addEventListener("click", mostrar);

	document
		.getElementById("carreras_form")
		.addEventListener("submit", sacarDatosCarrera);
	document
		.getElementById("patrocinadores_form")
		.addEventListener("submit", sacarDatosPatrocinador);
	document
		.getElementById("corredores_form")
		.addEventListener("submit", sacarDatosCorredores);
	document
		.getElementById("inscripciones_form")
		.addEventListener("submit", sacarDatosInscripcion);
	document
		.getElementById("ci_ordenarpor_nombre")
		.addEventListener("submit", consultarInscriptos);
	document
		.getElementById("visualizar_mapa_carreras")
		.addEventListener("click", iniciarMapa);
	document
		.getElementById("visualizar_mapa_inscripciones")
		.addEventListener("click", iniciarMapa);
}

// ------------------Intefaz-------------------

function mostrar(evento) {
	if (evento.target == document.getElementById("idDatos")) {
		document.getElementById("datos").style.display = "block";
		document.getElementById("estadisticas").style.display = "none";
	} else {
		document.getElementById("datos").style.display = "none";
		document.getElementById("estadisticas").style.display = "block";
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

function sacarDatosCarrera(evento) {
	evento.preventDefault();
	let newNombre = document.getElementById("carreras_nombre").value;
	let newDepartamento = document.getElementById("carreras_departamento").value;
	let newFecha = new Date(
		document.getElementById("agregar_carrera_fecha").value
	);
	let newCupos = document.getElementById("agregar_carrera_cupo").value;

	if (!sistema.existeCarrera(newNombre)) {
		let newArray = new Carrera(newNombre, newDepartamento, newFecha, newCupos);
		sistema.agregarCarrera(newArray);
		let select = document.getElementById("patrocinadores_carreras");
		let option = document.createElement("option");
		option.value = newNombre;
		option.textContent = newNombre;
		select.appendChild(option);
		document.getElementById("carreras_nombre").value = "";
		document.getElementById("carreras_departamento").selectedIndex = 0;
		document.getElementById("agregar_carrera_fecha").value = "";
		document.getElementById("agregar_carrera_cupo").value = "30";
		sistema.ordenarCarrerasPorNombre();
		actualizarSelectCarreras("inscripciones_carreras");
		actualizarSelectCarrerasInscripcion("consulta_inscriptos_carrera");
	}
}

function actualizarSelectCarrerasInscripcion(selectId) {
	let select = document.getElementById(selectId);
	select.innerHTML = "";
	for (let carrera of sistema.listaCarreras) {
		let option = document.createElement("option");
		option.value = carrera.nombre;
		option.textContent = carrera.nombre;
		select.appendChild(option);
	}
}

// -------------------------
//-------------------------- Corredores ----------------------

function sacarDatosCorredores(evento) {
	evento.preventDefault();
	let newNombre = document.getElementById("corredores_nombreCorredor").value;
	let cedula = document.getElementById("corredores_cedula").value;
	let edad = document.getElementById("corredores_edad").value;
	let fecha = new Date(
		document.getElementById("corredores_fecha_vencimiento").value
	);
	let tipoCorredor = "";
	if (document.getElementById("corredores_tipo_corredor_elite").checked) {
		tipoCorredor = "Deportista de élite";
	} else {
		tipoCorredor = "Deportista Común";
	}
	if (sistema.cedulaEsUnica(cedula)) {
		let newArray = new Corredor(newNombre, edad, cedula, fecha, tipoCorredor);
		sistema.agregarCorredor(newArray);
		document.getElementById("corredores_nombreCorredor").value = "";
		document.getElementById("corredores_cedula").value = "";
		document.getElementById("corredores_edad").value = "";
		document.getElementById("corredores_fecha_vencimiento").value = "";
		sistema.ordenarCorredoresPorNombre();
		actualizarSelectCorredor("inscripciones_corredores");
	} else {
		alert(
			"Ingrese datos nuevos, ya existe un corredor con esa cédula o ficha médica"
		);
	}
}

function actualizarSelectCorredor(selectId) {
	let select = document.getElementById(selectId);
	select.innerHTML = "";
	for (let corredor of sistema.listaCorredores) {
		let option = document.createElement("option");
		option.value = corredor.cedula;
		option.textContent = corredor.nombre + " - " + corredor.cedula;
		select.appendChild(option);
	}
}

//----------------------------------------

//-------------------------------- Patrocinadores -------------------

function sacarDatosPatrocinador(evento) {
	evento.preventDefault();
	let newNombre = document.getElementById("patrocinadores_nombre").value;
	let newRubro = document.getElementById("patrocinadores_rubro").value;
	let select = document.getElementById("patrocinadores_carreras");
	let carreraEncontrada = [];
	for (let i = 0; i < select.options.length; i++) {
		if (select.options[i].selected) {
			carreraEncontrada.push(select.options[i].value);
		}
	}
	if (sistema.existePatrocinador(newNombre)) {
		sistema.actualizarRubroPatrocinador(newNombre, newRubro);
	} else {
		let newArray = new Patrocinador(newNombre, newRubro, carreraEncontrada);
		sistema.agregarPatrocinador(newArray);
	}

	document.getElementById("patrocinadores_nombre").value = "";
	document.getElementById("patrocinadores_rubro").selectedIndex = 0;
	document.getElementById("patrocinadores_carreras").selectedIndex = 0;
}

// ---------------------------------------

// -------------------- Inscripciones ---------------------------

function sacarDatosInscripcion(evento) {
	evento.preventDefault();
	let selectCorredor = document.getElementById("inscripciones_corredores");
	let selectCarrera = document.getElementById("inscripciones_carreras");
	let selectPatrocinador = document.getElementById("patrocinadores_carreras");

	let corredorEncontrado = sistema.encontrarCorredor(selectCorredor.value);
	let carreraEncontrada = sistema.encontrarCarrera(selectCarrera.value);

	let patrocinadoresEncontrados = sistema.encontrarPatrocinadoresDeCarrera(
		carreraEncontrada.nombre
	);

	let nombresPatrocinadores = [];
	let rubrosPatrocinadores = [];

	if (patrocinadoresEncontrados.length > 0) {
		for (let i = 0; i < patrocinadoresEncontrados.length; i++) {
			nombresPatrocinadores.push(patrocinadoresEncontrados[i].nombre);
			rubrosPatrocinadores.push(patrocinadoresEncontrados[i].rubro);
		}
	}

	let numeroIns = carreraEncontrada.cuposUsados + 1;
	let inscripcion = new Inscripcion(
		corredorEncontrado,
		carreraEncontrada,
		numeroIns
	);
	sistema.procesarInscripcion(inscripcion);

	let info =
		"corredor:" +
		corredorEncontrado.nombre +
		"\nedad:" +
		corredorEncontrado.edad +
		"\ncedula:" +
		corredorEncontrado.cedula +
		"\nficha medica:" +
		corredorEncontrado.fichaMedica +
		"\nTipo de corredor: " +
		corredorEncontrado.tipo +
		"\ncarrera:" +
		carreraEncontrada.nombre +
		"\nDepartamento:" +
		carreraEncontrada.departamento +
		"\nfecha:" +
		carreraEncontrada.fecha +
		"\ncupos usados:" +
		carreraEncontrada.cuposUsados +
		"\nNombre/es de patrocinador/es: " +
		nombresPatrocinadores +
		"\nRubro/s de patrocinador/es: " +
		rubrosPatrocinadores;
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
	actualizarPromedioInscriptos();
	actualizarCarrerasMasInscriptos();
	actualizarCarrerasSinInscriptos();
	consultarInscriptos();
}

function actualizarPromedioInscriptos() {
	let output_promedio_inscriptos = document.getElementById(
		"output_promedio_inscriptos"
	);
	output_promedio_inscriptos.innerText = sistema.promedioInscriptosPorCarrera();
}

function actualizarCarrerasMasInscriptos() {
	let lista = document.getElementById("lista_carreras_mas_inscriptos");
	let html = "";
	for (let carrera of sistema.carrerasConMasInscriptos()) {
		html += `<li>${carrera.nombre}</li>`;
	}
	lista.innerHTML = html;
}

function actualizarCarrerasSinInscriptos() {
	let lista = document.getElementById("lista_carreras_sin_inscriptos");
	let html = "";
	for (let carrera of sistema.carrerasSinInscriptos()) {
		html += `<li>${carrera.nombre}</li>`;
	}
	lista.innerHTML = html;
}

function actualizarPorcentajeElite() {
	let output_porcentaje_elite = document.getElementById(
		"output_porcentaje_elite"
	);

	output_porcentaje_elite.innerHTML = sistema.porcentajeCorredoresElite();
}

//----------------------------------------------------------------
//------------------consulta de inscriptos -----------------------
function consultarInscriptos() {
	let select = document.getElementById("tabla_inscriptos");

	let tabla = document.getElementById("tabla_inscriptos");
	// Borra todas las filas menos la primera (encabezado)
	while (tabla.rows.length > 1) {
		tabla.deleteRow(1);
	}
	for (let inscriptos of sistema.listaInscripciones) {
		if (
			inscriptos.carrera.nombre ==
			document.getElementById("inscripciones_carreras").value
		) {
			let fila = select.insertRow();
			if (inscriptos.corredor.tipo == "Deportista de élite") {
				fila.style.backgroundColor = "red";
			}
			let celda1 = fila.insertCell(0);
			let celda2 = fila.insertCell(1);
			let celda3 = fila.insertCell(2);
			let celda4 = fila.insertCell(3);
			let celda5 = fila.insertCell(4);

			celda1.innerHTML = inscriptos.corredor.nombre;
			celda2.innerHTML = inscriptos.corredor.edad;
			celda3.innerHTML = inscriptos.corredor.cedula;
			celda4.innerHTML = inscriptos.corredor.fichaMedica;
			celda5.innerHTML = inscriptos.numeroInscripcion;
		}
	}
	if (document.getElementById("ci_ordenarpor_nombre").checked) {
		ordernarInscriptosPorNombre();
	} else {
		ordenarInscriptosPorNumeroCreciente();
	}
}
function ordernarInscriptosPorNombre() {
	for (let inscripcion of sistema.listaInscripciones) {
		sistema.listaInscripciones.sort((a, b) =>
			a.corredor.nombre.localeCompare(b.corredor.nombre)
		);
	}
}
function ordenarInscriptosPorNumeroCreciente() {
	for (let inscripcion of sistema.listaInscripciones) {
		sistema.listaInscripciones.sort(
			(a, b) => a.numeroInscripcion - b.numeroInscripcion
		);
	}
}

// ----------- Mapa Uruguay con GeoChart -----------

google.charts.load("current", {
	packages: ["geochart"],
	language: "es",
});

google.charts.setOnLoadCallback(iniciarMapa);

function iniciarMapa(e) {
	let modo;
	if (e) {
		modo = e.target.value;
	} else {
		modo = "carreras";
	}
	let datos = obtenerDatosMapa(modo);

	dibujarMapa(datos);
}

const codigoDepartamentoPorNum = [
	"UY-TA", // tacuarembo
	"UY-MO", // Montevideo
	"UY-CA", // Canelones
	"UY-MA", // Maldonado
	"UY-RO", // Rocha
	"UY-TT", // Treinta y Tres
	"UY-CL", // Cerro Largo
	"UY-RV", // Rivera
	"UY-AR", // Artigas
	"UY-SA", // Salto
	"UY-PA", // Paysandú
	"UY-RN", // Río Negro
	"UY-SO", // Soriano
	"UY-CO", // Colonia
	"UY-SJ", // San José
	"UY-FS", // Flores
	"UY-FD", // Florida
	"UY-LA", // Lavalleja
	"UY-DU", // Durazno
];

function obtenerDatosMapa(modo) {
	let datos = [];
	const carreras = sistema.listaCarreras;

	//inicializar todos los datos con 0 y codigos
	for (let i = 0; i < codigoDepartamentoPorNum.length; i++) {
		datos.push([codigoDepartamentoPorNum[i], 0]);
	}

	if (modo == "carreras") {
		for (let i = 0; i < carreras.length; i++) {
			datos[carreras[i].departamento][1]++;
		}
	} else if (modo == "inscripciones") {
		for (let i = 0; i < carreras.length; i++) {
			datos[carreras[i].departamento][1] += carreras[i].cuposUsados;
		}
	}

	return datos;
}

function dibujarMapa(datosDepartamentos) {
	const data = google.visualization.arrayToDataTable([
		["Departamento", "Valor"],
		...datosDepartamentos,
	]);

	const options = {
		region: "UY",
		displayMode: "regions",
		resolution: "provinces",
		colorAxis: { colors: ["#c7e9c0", "#00441b"] },
		tooltip: { isHtml: true },
	};

	const chart = new google.visualization.GeoChart(
		document.getElementById("mapa_uruguay")
	);

	chart.draw(data, options);
}
