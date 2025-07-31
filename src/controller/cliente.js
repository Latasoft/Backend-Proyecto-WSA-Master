import { ClienteService } from "../service/cliente.js";
const clienteService= new ClienteService();



export async function actualizarCliente(req, res) {
    try {
      // El id del cliente que viene por la URL: /clientes/:id
      const { _id } = req.params;

      
      // req.body contiene la data (rut_cliente, nombre_cliente, etc.).
      // req.files contiene los archivos subidos.
      const resultado = await clienteService.actualizarCliente(_id, req.body, req.file);
  
      return res.status(200).json(resultado);
    } catch (error) {
      // Ante cualquier error
      console.error("Error al actualizar cliente:", error);
      return res.status(500).json({ message: error.message });
    }
  }

export async function buscarById(req,res){
    try{
      const {_id}= req.params;

      const response = await clienteService.buscarById(_id)

      res.status(200).json(response)
    }catch(error){
      res.status(error.status || 500).json({ message: error.message || 'Error al buscar cliente por id' });
    }
}

export async function traerTodosClientesPaginados(req,res){
    try{
      const { page = 1, limit = 10 } = req.query;
    
      // Llamar al método del servicio para obtener los usuarios paginados
      const result = await clienteService.traerCLientesPaginados(page, limit);
      res.status(200).json(result)
    }catch(error){
      res.status(error.status || 500).json({ message: error.message || 'Error al traer clientes' });
    }
    
}