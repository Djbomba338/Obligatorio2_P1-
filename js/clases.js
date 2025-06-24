class Sistema {
    constructor (){
        this.listaCarreras = []
        this.listaCorredores = []
        this.listaPatrocinadores = []
        this.listaInscripciones = []
    }

    // ------------------- Carrera ----------------------

    existeCarrera(nombre){
        let existe = false
        for (let i = 0; i < this.listaCarreras.length && !existe; i++){
            if(this.listaCarreras[i].nombre == nombre){
                existe = true
            } 
        }
        return existe
    }


    agregarCarrera(carrera){
        this.listaCarreras.push(carrera)
    }

    ordenarCarrerasPorNombre(){
        this.listaCarreras.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    encontrarCarrera(numbreCarrera) {
    for (let i = 0; i < sistema.listaCarreras.length; i++) {
        if (sistema.listaCarreras[i].nombre == numbreCarrera) {
            return sistema.listaCarreras[i]
            }
        }
    }
    //----------------------------------

    //---------------------Corredor--------------------------


    agregarCorredor(corredor){
        this.listaCorredores.push(corredor)
    }

    encontrarCorredor(cedula){
        for (let i = 0; i < this.listaCorredores.length ; i++){
            if(this.listaCorredores[i].cedula == cedula){ 
                return this.listaCorredores[i]
            }
        }
    }

    validarCedula(cedula){
        let esValida = false
        for (let i = 0; i < this.listaCorredores.length && !esValida; i++){
            if(this.listaCorredores[i].cedula == cedula){
                esValida = true
            } 
        }
        return esValida
    }

    ordenarCorredoresPorNombre() {
        this.listaCorredores.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    //-------------------------------------


    //-------------------Patrocinador-----------------
    existePatrocinador(nombre){
        let existe = false
        for (let i = 0; i < this.listaPatrocinadores.length  && !existe ; i++){
            if(this.listaPatrocinadores[i].nombre == nombre){
                existe = true
            }
        }
        return existe
    }


    actualizarRubroPatrocinador(nom, rubro){
        let patrocinador = this.encontrarPatrocinador(nom);
        if (patrocinador) {
            patrocinador.rubro = rubro
            return true
        }
        return false
    }


    agregarPatrocinador(patrocinador){
        this.listaPatrocinadores.push(patrocinador)
    }


    encontrarPatrocinador(nombre){
        for (let i = 0; i < this.listaPatrocinadores.length ; i++){
            if(this.listaPatrocinadores[i].nombre == nombre){
                return this.listaPatrocinadores[i]
            }
        }
    }

    // ------------------------------------
    //------------------------------Inscripciones------------------------

    manejadorNuevaInscripcion(inscripcion) {
        let carrera = inscripcion.carrera
        let corredor = inscripcion.corredor
        if(carrera.hayCuposDisponibles() && carrera.validarFichaMedica(corredor.fichaMedica) ){
            this.agregarInscripcion(inscripcion)
            carrera.cuposUsados += 1
        } else {
            alert("No es posible agregar Inscripcion")
        }
    }

    agregarInscripcion(inscripcion){
        this.listaInscripciones.push(inscripcion)
    }

    otorgarNumeroInscripcion() {
        corredor.numeroInscripcion = this.listaCarreras.cuposUsados
    }
    

    //----------------------------

    //-------------------otros--------------------------

    encontrarPatrocinadoresDeCarrera(carrera) {
        for (let i = 0; i < sistema.listaPatrocinadores.length; i++) {
        if (sistema.listaPatrocinadores[i].carrera.includes(carreraEncontrada.nombre)){
            patrocinadorEncontrado = sistema.listaPatrocinadores[i];
            break;
            }
        }
    }
}



class Carrera {
    constructor (nombre, departamento, fecha, cuposMaximos){
        this.nombre = nombre;
        this.departamento = departamento
        this.fecha = fecha
        this.cuposMaximos = cuposMaximos 
        this.cuposUsados = 0
        this.inscriptos = []
    }

    hayCuposDisponibles(){
        return this.cuposUsados < this.cuposMaximos
    }

    validarFichaMedica(fichaMedica){
        let esValida = true
            if(this.fecha > fichaMedica){
                esValida = false
            } 
        return esValida
    }
}


class Corredor {
    constructor (nombre, edad, cedula, fichaMedica,tipo, numeroInscripcion = []){
        this.nombre = nombre 
        this.edad = edad
        this.cedula =  cedula 
        this.fichaMedica = fichaMedica
        this.tipo =  tipo 
    }
    toString(){
        return this.nombre + this.edad + "años CI:" + this.cedula + this.fichaMedica + this.tipo
    }
}


class Inscripcion {
    constructor (corredor, carrera, numeroInscripcion){
        this.corredor = corredor
        this.carrera = carrera
        this.numeroInscripcion = numeroInscripcion
    }
    toString(){
        return this.corredor + this.carrera + this.numeroInscripcion
    }
}


class Patrocinador {
    constructor(nombre,rubro,carreras = []){
        this.nombre = nombre 
        this.rubro = rubro 
        this.carreras = carreras
    }
    agregarCarrera(carrera){
        this.carrera.push(carrera)
    }
}


