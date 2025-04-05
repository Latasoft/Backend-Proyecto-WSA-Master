import { EmbarcacionService } from "../service/embarcacion.js";
import { EmbarcacionDto } from "../dtos/embarcaciones/embarcacion.js";
import { response } from "express";
const embarcacionService= new EmbarcacionService();


export async function crearEmbarcacion(req,res){
    const dataParse= EmbarcacionDto.parse(req.body)

    const response = await embarcacionService.crearEmbarcacion(dataParse)

    res.status(200).json(response)
    
}


export async function getEmbarcacionById(req,res){
    const {_id}= req.params;

    
    const response= await embarcacionService.getEmbarcacionById(_id)

    res.status(200).json(response)
}

export async function getEmbarcacionesByTrabajadorId(req,res) {
    try{
        const {_id}= req.params;
        

    const response = await embarcacionService.getEmbarcacionesByTrabajadorId(_id);

    res.status(200).json(response)

    }catch(error){
        res.status(400).json(response)
    }    
}

export async function getEmbarcacionesByClienteId(req,res) {
    try{
        const {_id}= req.params;
         // Falta extraer page y limit si los recibes por query
    const { page = 1, limit = 10 } = req.query;

    const response = await embarcacionService.getEmbarcacionByIdCliente(
      _id,
      Number(page),
      Number(limit)
    );

    res.status(200).json(response)

    }catch(error){
        res.status(400).json(response)
    }    
}


export async function getAllEmbarcaciones(req,res){
    try{
        const response = await embarcacionService.getAllEmbarcaciones();

        res.status(200).json(response)
    }catch(error){
        res.status(400).json(response)
    }

}

export async function updateEmbarcacion(req,res){
    try{
        const {_id}= req.params;
  

    const response= await embarcacionService.actualizarEmbarcacion(_id,req.body)

    res.status(200).json(response)
    }catch(error){
        console.error("Error en crearEmbarcacion:", error);
        res.status(400).json({ message: "Error al crear embarcacion" });
    }
}

export async function updateServiceAccion(req,res){
    try{
        const { _id } = req.params;
        const { nombre_servicio, nombre_estado, acciones } = req.body;

        const response = await embarcacionService.actualizarServicioAccion(_id, nombre_servicio, nombre_estado, acciones);

        res.status(200).json(response);


    }catch(error){
        console.error("Error en updateServiceAccion:", error);
        res.status(400).json({ message: 'Error al actualizar accion del servicio'});
    }
    
}


export async function getEmbarcacionesByIdAndClienteId(req,res){
    try{
        const { embarcacionId, cliente_id } = req.params;
        console.log(cliente_id)
        console.log(embarcacionId)

        const response = await embarcacionService.getEmbarcacionByIdAndCliente(embarcacionId,cliente_id)

        res.status(200).json(response)

    }catch(error){
        console.error("Error en getEmbarcacionesByIdAndClienteId:", error);
        res.status(400).json({ message: 'Error al obtener embarcaciones por id y cliente'});
    }
}1