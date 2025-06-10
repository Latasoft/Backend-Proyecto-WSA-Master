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
    // ✅ Validar el body con campos opcionales
    console.log('🛬 BODY RECIBIDO EN BACKEND:', JSON.stringify(req.body, null, 2));

    const data = EstadoEmbarcacionDto.parse(req.body);

    // 📦 Mostrar datos recibidos
    console.log('📦 Data recibida:', JSON.stringify(data, null, 2));

    // ✅ Construir updateFields dinámicamente con solo los campos definidos
    const updateFields = {};
    for (const key in data) {
            if (data[key] !== undefined) {
                
                if (key === 'servicios_relacionados' && Array.isArray(data[key])) {
                updateFields[key] = data[key].map(servicio => ({
                    ...servicio,
                    fecha_modificacion: new Date() // 💡 hora actual
                }));
                } else {
                updateFields[key] = data[key];
                }
            }
            }


    console.log('🔧 Campos a actualizar:', JSON.stringify(updateFields, null, 2));

    // 🛠️ Actualizar la embarcación en MongoDB
    const embarcacion = await Embarcacion.findByIdAndUpdate(_id, updateFields, { new: true });

    // ❌ Si no se encuentra la embarcación
    if (!embarcacion) {
      return res.status(404).json({ message: 'Embarcación no encontrada' });
    }

    // ✅ Respuesta exitosa
    res.json(embarcacion);

  } catch (error) {
    console.error('❌ Error al actualizar estado/comentario:', error);
    res.status(500).json({ message: error.message });
  }
};


