import { AuthService } from "../service/auth.js";

const authService= new AuthService();

export async function login(req,res){
    try{

        const response= await authService.login(req.body)

        res.status(201).json(response);

    }catch(error){
        const status = error?.status || 500;
        const message = error?.message || 'Error interno del servidor';

        res.status(status).json({ message });

    }
}


export const resetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      console.log("Email en controller:", email);
      const result = await authService.resetPassword(email);
      res.status(201).json(result);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message || 'Error al enviar correo de recuperación' });
    }
  };
  
  export const changePassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      const result = await authService.changePassword(token, newPassword);
      res.status(201).json(result);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message || 'Error al cambiar contraseña' });
    }
  };