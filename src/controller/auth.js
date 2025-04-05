import { AuthService } from "../service/auth.js";

export async function login(req,res){
    try{

        const authService= new AuthService();

        const response= await authService.login(req.body)

        res.status(201).json(response);

    }catch(error){
        const status = error?.status || 500;
        const message = error?.message || 'Error interno del servidor';

        res.status(status).json({ message });

    }
}
