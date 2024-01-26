import winston from "winston";
//custom options
const customLevelsOptions = {
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5
    },
    colors:{
        fatal:'red',
        error:'orange',
        warning:'yellow',
        info:'blue',
        http:'green',
        debug:'white'
    }
};

//loggers

const devLogger = winston.createLogger({
    levels:customLevelsOptions.levels,
    transports: [
        new winston.transports.File({
            filename: './errors.log',
            level: 'fatal',
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './loggers.log',
            level: 'warning',
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './loggers.log',
            level: 'info',
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./loggers.log',
            level: 'http',
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.simple()
            )
        })
    ]
});

const prodLogger = winston.createLogger({
    levels:customLevelsOptions.levels,
    transports: [
        new winston.transports.File({
            filename: './errors.log',
            level: 'fatal',
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './loggers.log',
            level: 'warning',
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './loggers.log',
            level: 'info',
            format: winston.format.combine(
                winston.format.simple()
            )
        })
    ]
});






//middlewar de logger
export const addLogger = (req,res,next)=>{
    if(process.env.ENVIRONMENT === 'development'){
        req.logger = devLogger;
    }else{
        req.logger = prodLogger;
    }
    
    next();
}