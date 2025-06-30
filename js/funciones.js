// Juan Pablo Canedo(349963) y Franco Cardozo(345912)

window.addEventListener("load", inicio);
const sistema = new Sistema();

function inicio() {
	document.getElementById("idDatos").addEventListener("click", mostrar);
	document.getElementById("idEstadisticas").addEventListener("click", mostrar);
	document.getElementById("carreras_form").addEventListener("submit", sacarDatosCarrera);
	document.getElementById("patrocinadores_form").addEventListener("submit", sacarDatosPatrocinador);
	document.getElementById("corredores_form").addEventListener("submit", sacarDatosCorredores);
	document.getElementById("inscripciones_form").addEventListener("submit", sacarDatosInscripcion);
	document.getElementById("ci_ordenarpor_nombre").addEventListener("click", consultarInscriptos);
	document.getElementById("ci_ordenarpor_numero").addEventListener("click", consultarInscriptos);
	document.getElementById("consulta_inscriptos_carrera").addEventListener("change", consultarInscriptos);
	document.getElementById("visualizar_mapa_carreras").addEventListener("click", iniciarMapa);
	document.getElementById("visualizar_mapa_inscripciones").addEventListener("click", iniciarMapa);
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

function actualizarSelectConCarreras(selectId) {
	const select = document.getElementById(selectId);
	select.innerHTML = "";
	for (let carrera of sistema.listaCarreras) {
		let option = document.createElement("option");
		option.value = carrera.nombre;
		option.textContent = carrera.nombre;
		select.appendChild(option);
	}
}

function actualizarSelectConCorredores(selectId) {
	let select = document.getElementById(selectId);
	select.innerHTML = "";
	for (let corredor of sistema.listaCorredores) {
		let option = document.createElement("option");
		option.value = corredor.cedula;
		option.textContent = corredor.nombre + " - " + corredor.cedula;
		select.appendChild(option);
	}
}

//------------------------------------------

// ------------------------------ Carreras ---------------------------

function sacarDatosCarrera(evento) {
	evento.preventDefault();

	// obtenemos datos y elementos del formulario
	let carreraForm = document.getElementById("carreras_form");
	let newNombre = document.getElementById("carreras_nombre").value;
	let newDepartamento = document.getElementById("carreras_departamento").value;
	let newFecha = document.getElementById("agregar_carrera_fecha").value;
	let newCupos = document.getElementById("agregar_carrera_cupo").value;
	//--------------------------------
	if (!sistema.existeCarrera(newNombre)) {
		let NuevaCarrera = new Carrera(
			newNombre,
			newDepartamento,
			newFecha,
			newCupos
		);
		sistema.agregarCarrera(NuevaCarrera);
	} else {
		alert("Ya existe otra carrera con ese nombre");
	}
	carreraForm.reset();
	actualizar();
}

// -------------------------
//-------------------------- Corredores ----------------------

function sacarDatosCorredores(evento) {
	evento.preventDefault();
	// obtenemos datos y elementos del formulario
	let corredorForm = document.getElementById("corredores_form");
	let newNombre = document.getElementById("corredores_nombreCorredor").value;
	let cedula = document.getElementById("corredores_cedula").value;
	let edad = document.getElementById("corredores_edad").value;
	let fecha = document.getElementById("corredores_fecha_vencimiento").value;
	let tipoCorredor = "";
	if (document.getElementById("corredores_tipo_corredor_elite").checked) {
		tipoCorredor = "Deportista de élite";
	} else {
		tipoCorredor = "Deportista Común";
	}
	//--------------

	if (sistema.cedulaEsUnica(cedula)) {
		let nuevoCorredor = new Corredor(
			newNombre,
			edad,
			cedula,
			fecha,
			tipoCorredor
		);
		sistema.agregarCorredor(nuevoCorredor);
	} else {
		alert("Ingrese datos nuevos, ya existe un corredor con esa cédula");
	}
	corredorForm.reset();
	actualizar();
}

//----------------------------------------

//-------------------------------- Patrocinadores -------------------

function sacarDatosPatrocinador(evento) {
	evento.preventDefault();

	// obtenemos datos y elementos del formulario
	let form = document.getElementById("patrocinadores_form");
	let nombre = document.getElementById("patrocinadores_nombre").value;
	let rubro = document.getElementById("patrocinadores_rubro").value;
	let select = document.getElementById("patrocinadores_carreras");
	let carrerasQuePatrocina = [];
	for (option of select.options) {
		if (option.selected) {
			carrerasQuePatrocina.push(option.value);
		}
	}
	//----------
	if (sistema.existePatrocinador(nombre)) {
		sistema.actualizarDatosPatrocinador(nombre, rubro, carrerasQuePatrocina);
	} else {
		let nuevoPatrocinador = new Patrocinador(
			nombre,
			rubro,
			carrerasQuePatrocina
		);
		sistema.agregarPatrocinador(nuevoPatrocinador);
	}
	form.reset();
	actualizar(); // no es necesario tal vez ya que los patrocinadores no figuran en la ui, sin embargo lo dejaria
}

// ---------------------------------------

// -------------------- Inscripciones ---------------------------
function sacarDatosInscripcion(evento) {
	evento.preventDefault();

	// sacamos datos del form
	let selectCorredor = document.getElementById("inscripciones_corredores");
	let selectCarrera = document.getElementById("inscripciones_carreras");
	//--------

	// referencias a los objetos reales del corredor, carrerra y patrocinadores.
	let corredorEncontrado = sistema.encontrarCorredor(selectCorredor.value);
	let carreraEncontrada = sistema.encontrarCarrera(selectCarrera.value);
	let patrocinadoresEncontrados = sistema.encontrarPatrocinadoresDeCarrera(
		carreraEncontrada.nombre
	);
	//----------------
	if (
		carreraEncontrada.hayCuposDisponibles() &&
		carreraEncontrada.validarFichaMedica(corredorEncontrado.fichaMedica) &&
		!sistema.corredorYaEstaInscripto(
			corredorEncontrado.nombre,
			carreraEncontrada.nombre
		)
	) {
		const numeroIns = carreraEncontrada.cuposUsados + 1;
		const inscripcion = new Inscripcion(
			corredorEncontrado,
			carreraEncontrada,
			numeroIns
		);
		sistema.agregarInscripcion(inscripcion);
		carreraEncontrada.cuposUsados += 1;

		let info =
			"Número: " +
			numeroIns +
			"\nNombre: " +
			corredorEncontrado.nombre +
			", " +
			corredorEncontrado.edad +
			", " +
			"CI: " +
			corredorEncontrado.cedula +
			", " +
			"Ficha médica: " +
			corredorEncontrado.fichaMedica +
			"\n" +
			corredorEncontrado.tipo +
			"\nCarrera: " +
			carreraEncontrada.nombre +
			" en " +
			sistema.obtenerNombreDepartamento(carreraEncontrada.departamento) +
			" el " +
			carreraEncontrada.fecha +
			" Cupo: " +
			carreraEncontrada.cuposMaximos +
			"\n";

		for (let patrocinador of patrocinadoresEncontrados) {
			info += patrocinador.nombre + " (" + patrocinador.rubro + ")" + "\n";
		}

		alert(info);
		descargarInscripcionPDF(info);
		actualizar();
	} else {
		alert(
			"No es posible agregar Inscripcion (No hay cupos disponibles o La ficha medica vence antes de la fecha de la carrera o el corredor ya está inscripto)"
		);
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

//-----------------Interfaz-----------------------------

function actualizar() {
	// actualizar sistema
	sistema.ordenarCarrerasPorNombre();
	sistema.ordenarCorredoresPorNombre();

	// recalcular cosas y actualizar ui
	actualizarPromedioInscriptos();
	actualizarCarrerasMasInscriptos();
	actualizarCarrerasSinInscriptos();
	actualizarPorcentajeElite();
	consultarInscriptos();
	actualizarSelectConCarreras("patrocinadores_carreras");
	actualizarSelectConCarreras("inscripciones_carreras");
	actualizarSelectConCarreras("consulta_inscriptos_carrera");
	actualizarSelectConCorredores("inscripciones_corredores");
	iniciarMapa();
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
	let select = document.getElementById("consulta_inscriptos_carrera");
	let tabla = document.getElementById("tabla_inscriptos");
	// Borra todas las filas menos la primera (encabezado)
	while (tabla.rows.length > 1) {
		tabla.deleteRow(1);
	}

	// ordena a los inscriptos antes de buscarlos (deberia hacerse localmente pero fue)
	if (document.getElementById("ci_ordenarpor_nombre").checked) {
		sistema.ordenarInscriptosPorNombre();
	} else {
		sistema.ordenarInscriptosPorNumeroCreciente();
	}

	for (let inscriptos of sistema.listaInscripciones) {
		if (
			inscriptos.carrera.nombre == select.value
		) {
			let fila = tabla.insertRow();
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
	null,
	["UY-MO", "Montevideo"],
	["UY-CA", "Canelones"],
	["UY-MA", "Maldonado"],
	["UY-RO", "Rocha"],
	["UY-TT", "Treinta y Tres"],
	["UY-CL", "Cerro Largo"],
	["UY-RV", "Rivera"],
	["UY-AR", "Artigas"],
	["UY-SA", "Salto"],
	["UY-PA", "Paysandú"],
	["UY-RN", "Río Negro"],
	["UY-SO", "Soriano"],
	["UY-CO", "Colonia"],
	["UY-SJ", "San José"],
	["UY-FS", "Flores"],
	["UY-FD", "Florida"],
	["UY-LA", "Lavalleja"],
	["UY-DU", "Durazno"],
	["UY-TA", "Tacuarembo"],
];

function obtenerDatosMapa(modo) {
	let datos = [["Departamento", "Cantidad"]];

	//inicializar todos los datos con 0 y codigos
	for (let i = 1; i < codigoDepartamentoPorNum.length; i++) {
		datos.push([
			{
				v: codigoDepartamentoPorNum[i][0],
				f: codigoDepartamentoPorNum[i][1],
			},
			0,
		]);
	}
	if (modo == "carreras") {
		for (let carrera of sistema.listaCarreras) {
			datos[carrera.departamento][1]++;
		}
	} else if (modo == "inscripciones") {
		for (let carrera of sistema.listaCarreras) {
			datos[carrera.departamento][1] += carrera.cuposUsados;
		}
	}

	return datos;
}

function dibujarMapa(datosDepartamentos) {
	const data = google.visualization.arrayToDataTable([...datosDepartamentos]);

	const options = {
		region: "UY",
		displayMode: "regions",
		resolution: "provinces",
		colorAxis: { colors: ["#e8eefa", "#08306b"] },
		tooltip: { isHtml: true },
	};

	const chart = new google.visualization.GeoChart(
		document.getElementById("mapa_uruguay")
	);

	chart.draw(data, options);
}
