// Juan Pablo Canedo(349963) y Franco Cardozo(456912)
class Sistema {
	constructor() {
		this.listaCarreras = [];
		this.listaCorredores = [];
		this.listaPatrocinadores = [];
		this.listaInscripciones = [];
	}

	// ------------------- Carrera ----------------------

	existeCarrera(nombre) {
		let existe = false;
		for (let i = 0; i < this.listaCarreras.length && !existe; i++) {
			if (this.listaCarreras[i].nombre == nombre) {
				existe = true;
			}
		}
		return existe;
	}

	agregarCarrera(carrera) {
		this.listaCarreras.push(carrera);
	}

	ordenarCarrerasPorNombre() {
		this.listaCarreras.sort((a, b) => a.nombre.localeCompare(b.nombre));
	}

	encontrarCarrera(nombreCarrera) {
		for (let carrera of this.listaCarreras) {
			if (carrera.nombre == nombreCarrera) {
				return carrera;
			}
		}
	}

	promedioInscriptosPorCarrera() {
		let totalInscriptosEnCarreras = 0;
		for (let carrera of this.listaCarreras) {
			totalInscriptosEnCarreras += carrera.cuposUsados;
		}
		return (totalInscriptosEnCarreras / this.listaCarreras.length).toFixed(2);
	}

	carrerasConMasInscriptos() {
		let carrerasMasCuposUsados = [];
		let maxCuposUsados = 0;
		for (let carrera of this.listaCarreras) {
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

	carrerasSinInscriptos() {
		let carrerasSinInscriptos = [];
		for (let carrera of this.listaCarreras) {
			if (carrera.cuposUsados === 0) {
				carrerasSinInscriptos.push(carrera);
			}
		}
		carrerasSinInscriptos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
		return carrerasSinInscriptos;
	}

	//----------------------------------

	//---------------------Corredor--------------------------

	agregarCorredor(corredor) {
		this.listaCorredores.push(corredor);
	}

	encontrarCorredor(cedula) {
		for (let i = 0; i < this.listaCorredores.length; i++) {
			if (this.listaCorredores[i].cedula == cedula) {
				return this.listaCorredores[i];
			}
		}
	}

	cedulaEsUnica(cedula) {
		let esValida = true;
		for (let i = 0; i < this.listaCorredores.length && esValida; i++) {
			if (this.listaCorredores[i].cedula == cedula) {
				esValida = false;
			}
		}
		return esValida;
	}

	ordenarCorredoresPorNombre() {
		this.listaCorredores.sort((a, b) => a.nombre.localeCompare(b.nombre));
	}

	porcentajeCorredoresElite() {
		let totalCorredoresElite = 0;
		let totalCorredores = this.listaCorredores.length;
		for (let corredor of this.listaCorredores) {
			if (corredor.tipo === "Deportista de élite") {
				totalCorredoresElite += 1;
			}
		}
		return (totalCorredoresElite / totalCorredores) * 100;
	}
	//-------------------------------------

	//-------------------Patrocinador-----------------
	existePatrocinador(nombre) {
		let existe = false;
		for (let i = 0; i < this.listaPatrocinadores.length && !existe; i++) {
			if (this.listaPatrocinadores[i].nombre == nombre) {
				existe = true;
			}
		}
		return existe;
	}

	actualizarDatosPatrocinador(nombre, rubro, carreras) {
		let patrocinador = this.encontrarPatrocinador(nombre);
		if (patrocinador) {
			patrocinador.rubro = rubro;
			patrocinador.carreras = carreras;
		}
	}

	agregarPatrocinador(patrocinador) {
		this.listaPatrocinadores.push(patrocinador);
	}

	encontrarPatrocinador(nombre) {
		for (let patrocinador of this.listaPatrocinadores) {
			if (patrocinador.nombre == nombre) {
				return patrocinador;
			}
		}
	}

	// ------------------------------------
	//------------------------------Inscripciones------------------------

	agregarInscripcion(inscripcion) {
		this.listaInscripciones.push(inscripcion);
	}

	corredorYaEstaInscripto(nombreCorredor, nombreCarrera) {
		let yaEstaInscripto = false;
		for (let inscripcion of this.listaInscripciones) {
			if (
				inscripcion.corredor.nombre == nombreCorredor &&
				inscripcion.carrera.nombre == nombreCarrera
			) {
				yaEstaInscripto = true;
			}
		}
		return yaEstaInscripto;
	}

	ordenarInscriptosPorNombre() {
		this.listaInscripciones.sort((a, b) =>
			a.corredor.nombre.localeCompare(b.corredor.nombre)
		);
	}
	ordenarInscriptosPorNumeroCreciente() {
		this.listaInscripciones.sort(
			(a, b) => a.numeroInscripcion - b.numeroInscripcion
		);
	}

	//----------------------------

	//-------------------otros--------------------------

	encontrarPatrocinadoresDeCarrera(nombreCarrera) {
		let patrocinadoresEncontrados = [];
		for (let i = 0; i < this.listaPatrocinadores.length; i++) {
			if (this.listaPatrocinadores[i].carreras.includes(nombreCarrera)) {
				patrocinadoresEncontrados.push(this.listaPatrocinadores[i]);
			}
		}
		return patrocinadoresEncontrados;
	}

	obtenerNombreDepartamento(codigo) {
		let departamentos = [
			null,
			"Montevideo",
			"Canelones",
			"Maldonado",
			"Rocha",
			"Treinta y Tres",
			"Cerro Largo",
			"Rivera",
			"Artigas",
			"Salto",
			"Paysandú",
			"Río Negro",
			"Soriano",
			"Colonia",
			"San José",
			"Flores",
			"Florida",
			"Lavalleja",
			"Durazno",
			"Tacuarembó",
		];
		return departamentos[codigo];
	}
}

class Carrera {
	constructor(nombre, departamento, fecha, cuposMaximos) {
		this.nombre = nombre;
		this.departamento = departamento;
		this.fecha = fecha;
		this.cuposMaximos = cuposMaximos;
		this.cuposUsados = 0;
	}

	hayCuposDisponibles() {
		return this.cuposUsados < this.cuposMaximos;
	}

	validarFichaMedica(fichaMedica) {
		let esValida = true;
		if (new Date(this.fecha) > new Date(fichaMedica)) {
			esValida = false;
		}
		return esValida;
	}
}

class Corredor {
	constructor(nombre, edad, cedula, fichaMedica, tipo) {
		this.nombre = nombre;
		this.edad = edad;
		this.cedula = cedula;
		this.fichaMedica = fichaMedica;
		this.tipo = tipo;
	}
	toString() {
		return (
			this.nombre +
			this.edad +
			"años CI:" +
			this.cedula +
			this.fichaMedica +
			this.tipo
		);
	}
}

class Patrocinador {
	constructor(nombre, rubro, carreras = []) {
		this.nombre = nombre;
		this.rubro = rubro;
		this.carreras = carreras;
	}
	agregarCarrera(carrera) {
		this.carreras.push(carrera);
	}
}

class Inscripcion {
	constructor(corredor, carrera, numeroInscripcion) {
		this.corredor = corredor;
		this.carrera = carrera;
		this.numeroInscripcion = numeroInscripcion;
	}
	toString() {
		return this.corredor + this.carrera + this.numeroInscripcion;
	}
}
