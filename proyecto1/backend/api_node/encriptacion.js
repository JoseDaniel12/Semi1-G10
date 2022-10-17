const bcrypt = require("bcryptjs");

function encriptar(contrasenia) {
    /*
    bcrypt.hash(contrasenia, 10, (err, contraseniaEncriptada) => {
        if (err) {
            console.log("Error hasheando:", err);
            return err;
        } else {
            console.log("Y hasheada es: " + contraseniaEncriptada);
            return contraseniaEncriptada;
        }
    });
    */
    return bcrypt.hashSync(contrasenia, 10);
}

function comparacion(enviada, guardada) {
    //contra = '$2a$10$Qi3hPzi0XpDKa1nQhRV4SeGAjEZO7atobheQD5QZoHdFZrAoikMGS'
    /*
    bcrypt.hash(contrasenia, 10, (err, contraseniaEncriptada) => {
        if (err) {
            console.log("Error hasheando:", err);
            return err;
        } else {
            console.log("Y hasheada es: " + contraseniaEncriptada);
            return contraseniaEncriptada;
        }
    });
    */
    return bcrypt.compareSync(enviada, guardada);
}

module.exports = {
    encriptar,
    comparacion
  };