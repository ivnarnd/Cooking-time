import passport from "passport";
//Funcion para el retorno de errores en las estrategias de passport
export const passportError = (strategy) => {
    return async(req,res,next)=>{
        passport.authenticate(strategy,(error,user,info)=>{
            if(error){
                return next(error)
            }
            if(!user){
                return res.status(401).send({error: info.messages?info.messages:info.toString()})
            }
            req.user = user
            next()
        })(req,res,next)//esto es porque me llamara un midleware a nivel de ruta
    }
}
//recibo un rol y establezco su capacidad
export const authorization =(rol)=>{
    return async(req,res,next)=>{
        if(!req.user){
            res.status(401).send({Error:'Usuario no autorizado'})
        }
        if(req.user.user.rol!=rol){
            res.status(403).send({Error:'Usuario no tiene los permisos necesarios'})
        }
        next()
    }
}