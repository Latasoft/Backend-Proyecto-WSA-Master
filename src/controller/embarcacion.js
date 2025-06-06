import { EmbarcacionService } from "../service/embarcacion.js";
import { EmbarcacionDto } from "../dtos/embarcaciones/embarcacion.js";
import { response } from "express";
//AGREGO NUEVA FUNCION PARA ESTADO Y COMENTARIO
import { Embarcacion } from "../model/embarcacion.js";
import { EstadoEmbarcacionDto } from "../dtos/embarcaciones/estadoEmbarcacion.js"; 


const embarcacionService= new EmbarcacionService();


export async function crearEmbarcacion(req,res){
    try{
        const dataParse= EmbarcacionDto.parse(req.body)
        

        const response = await embarcacionService.crearEmbarcacion(dataParse)

        res.status(200).json(response)
    }catch(error){
        res.status(error.status || 500).json({ message: error.message  });
    }
    
}


export async function getEmbarcacionById(req,res){
    try{
        const {_id}= req.params;

        const response= await embarcacionService.getEmbarcacionById(_id)

        res.status(200).json(response)
    }catch(error){
        res.status(error.status || 500).json({ message: error.message  });
    }
}

export async function getEmbarcacionesByTrabajadorId(req,res) {
    try{
        const {_id}= req.params;
        

    const response = await embarcacionService.getEmbarcacionesByTrabajadorId(_id);

    res.status(200).json(response)

    }catch(error){
        res.status(error.status || 500).json({ message: error.message  });
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
        res.status(error.status || 500).json({ message: error.message  });
    }    
}


export async function getAllEmbarcaciones(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const response = await embarcacionService.getAllEmbarcaciones(
      Number(page),
      Number(limit)
    );

    res.status(200).json(response);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}




export async function updateEmbarcacion(req,res){
    try{
        const {_id}= req.params;
  

    const response= await embarcacionService.actualizarEmbarcacion(_id,req.body)

    res.status(200).json(response)
    }catch(error){
        console.error("Error en crearEmbarcacion:", error);
        res.status(error.status || 500).json({ message: error.message  });
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
        const { embarcacionId, userId } = req.params;
        

        const response = await embarcacionService.getEmbarcacionByIdAndUsuario(embarcacionId,userId)

        res.status(200).json(response)

    }catch(error){
        console.error("Error en getEmbarcacionesByIdAndClienteId:", error);
        res.status(error.status || 500).json({ message: error.message  });
    }
}

export async function deleteEmbarcacionById(req,res){
    try{
        const { _id } = req.params;

        const response = await embarcacionService.deleteEmbarcacionById(_id)

        res.status(200).json(response)

    }catch(error){
        console.error("Error en deleteEmbarcacionById:", error);
        res.status(error.status || 500).json({ message: error.message  });
    }
}

//FUNCION



export const actualizarEstadoYComentario = async (req, res) => {
  const { _id } = req.params;

  try {
    // ✅ Validar y parsear datos de entrada
    const data = EstadoEmbarcacionDto.parse(req.body);
    console.log('📦 Data recibida en backend:', JSON.stringify(data, null, 2));

    // ✅ Construir campos a actualizar
    const updateFields = {
      estado_actual: data.estado_actual,
      comentario_general: data.comentario_general,
      servicio: data.servicio,
      subservicio: data.subservicio,
      servicio_relacionado: data.servicio_relacionado,
      fecha_servicio_relacionado: data.fecha_servicio_relacionado,
      nota_servicio_relacionado: data.nota_servicio_relacionado,
      fecha_estimada_zarpe: data.fecha_estimada_zarpe,

      // 🔵 Añadir los nuevos campos para ETA, ETB, ETD
      fecha_arribo: data.eta,
      fecha_estimada_zarpe: data.etb, // puedes cambiar esto si ya usas fecha_estimada_zarpe arriba
      fecha_zarpe: data.etd
    };

    // ✅ Solo actualizar si viene en el body
    if (Array.isArray(data.servicios_relacionados)) {
      console.log('✅ Servicios relacionados incluidos en updateFields');
      updateFields.servicios_relacionados = data.servicios_relacionados;
    }

    console.log('🔧 Campos que se van a guardar (updateFields):', JSON.stringify(updateFields, null, 2));

    const embarcacion = await Embarcacion.findByIdAndUpdate(
      _id,
      updateFields,
      { new: true }
    );

    if (!embarcacion) {
      return res.status(404).json({ message: 'Embarcación no encontrada' });
    }

    res.json(embarcacion);
  } catch (error) {
    console.error('Error al actualizar estado/comentario:', error);
    res.status(500).json({ message: error.message });
  }
};


