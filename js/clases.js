class Sistema {
    constructor (){

    }
}
class Carrera {
    constructor (nombre, edad, fecha, cupos){
        this.nombre = nombre;
        this.edad = edad
        this.fecha = fecha
        this.cupos = cupos 
    }
}
class Corredor {
    constructor (nombre, edad, cedula, nacimiento,tipo){
        this.nombre = nombre 
        this.edad = edad
        this.cedula =  cedula 
        this.nacimiento = nacimiento
        this.tipo =  tipo 
    }
}
class Inscripcion {
    constructor (corredor, carrera){
        this.corredor = corredor 
        this.carrera = carrera 

    }
}
class Patrocinador {
    constructor(nombre,rubro,carrera){
        this.nombre = nombre 
        this.rubro = rubro 
        this. carrera = carrera
    }
}