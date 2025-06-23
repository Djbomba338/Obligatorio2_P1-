class Sistema {
    constructor (){
        this.listaCarrera = []
        this.listaCorredor = []
        this.listaPatrocinador = []
        this.listaInscripcion = []
    }
    validarNom(nombreNuevo){
        let validar = false
        for (let i = 0; i < this.listaCarrera.length ; i++){
            if(this.listaCarrera[i].nombre == nombreNuevo){
                validar = true
                break
            } 
        }
        return validar
    }


    nuevaCarrera(nCarrera){
        this.listaCarrera.push(nCarrera)
    } 


    validarNomRub(nom , rubro){
        let validar = false
        for (let i = 0; i < this.listaPatrocinador.length ; i++){
            if(this.listaPatrocinador[i].nombre == nom && this.listaPatrocinador[i].rubro == rubro){
                validar = true
                break
            } 
        }
        return validar
    }


    actualizarRubro(nom, rubro){
        for (let i = 0; i < this.listaPatrocinador.length ; i++){
                if (this.listaPatrocinador[i].nombre == nom && this.listaPatrocinador[i].rubro != rubro){
                    this.listaPatrocinador[i].rubro = rubro;
                    return true
                }
        } 
        return false
    }


    nuevoPatrocinador(nPatrocinador){
        this.listaPatrocinador.push(nPatrocinador)
    }
    

    validarCedula(cedula){
        let validar = false
        for (let i = 0; i < this.listaCorredor.length ; i++){
            if(this.listaCorredor[i].cedula == cedula){
                validar = true
                break
            } 
        }
        return validar
    }

    validarFichaMedica(fichaMedica){
        let validar = false
        for (let i = 0; i < this.listaCarrera.length ; i++){
            if(this.listaCarrera[i].fecha > fichaMedica){
                validar = true
                break
            } 
        }
        return validar
    }




    nuevoCorredor(nCorredor){
        this.listaCorredor.push(nCorredor)
    }

    encontrarCorredor(cedula){
        for (let i = 0; i < this.listaCorredor.length ; i++){
            if(this.listaCorredor[i].cedula == cedula){ 
                return this.listaCorredor[i]
            }
        }
    }

    nuevaInscripcion(nInscripcion){
        let carrera = nInscripcion.carrera
        if(carrera.cuposUsados < carrera.cupos){
            this.listaInscripcion.push(nInscripcion)
            carrera.cuposUsados += 1
            carrera.cupos -= 1
        } else {
            alert("No hay cupos disponibles para esta carrera")
        }
    }


    valdiarNuevaInscripcion(carrera){
        if(carrera.cuposUsados < carrera.cupos){
            return true
        }
    }
}



class Carrera {
    constructor (nombre, departamento, fecha, cupos){
        this.nombre = nombre;
        this.departamento = departamento
        this.fecha = fecha
        this.cupos = cupos 
        this.cuposUsados = 0
    }
}


class Corredor {
    constructor (nombre, edad, cedula, fichaMedica,tipo){
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
    constructor (corredor, carrera){
        this.corredor = corredor 
        this.carrera = carrera 
    }
    toString(){
        return this.corredor + this.carrera
    }
}


class Patrocinador {
    constructor(nombre,rubro,carrera = []){
        this.nombre = nombre 
        this.rubro = rubro 
        this.carrera = carrera
    }
    agregarCarrera(carrera){
        this.carrera.push(carrera)
    }
}


