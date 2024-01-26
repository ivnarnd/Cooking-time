import dotenv from 'dotenv';
const setEnvironment = (environment)=>{
    //carga de las variables de entorno
    dotenv.config({
        path:environment==='development'?'./.env.development':'./.env.production'
    });
    return {
        ENVIRONMENT:process.env.ENVIRONMENT,
        URL_CODE :  process.env.URL_CODE,
        PASS_COOKIE:process.env.PASS_COOKIE,
        PASS_SESSION:process.env.PASS_SESSION,
        CLIENT_ID:process.env.CLIENT_ID,
        SECRET_CLIENT:process.env.SECRET_CLIENT,
        CALLBACK_URL: process.env.CALLBACK_URL,
        JWT_SECRET : process.env.JWT_SECRET,
        PORT : process.env.PORT
    }
};
export default setEnvironment;
