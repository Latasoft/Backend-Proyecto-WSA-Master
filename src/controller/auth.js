import { AuthService } from "../service/auth.js";

export async function login(req,res){
    try{

        const authService= new AuthService();

        const response= await authService.login(req.body)

        res.status(201).json(response);

    }catch(error){
        console.log('Error al hacer login')
        throw new Error('Error al iniciar sesion')

    }
}
