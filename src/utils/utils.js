import bcrypt from 'bcrypt';
//funcion para hashear la contraseña pasada como parametro
export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(parseInt(process.env.SALT)));
//funcion para validar password
export const validatePassword = (user,password) => bcrypt.compareSync(password,user.password);

