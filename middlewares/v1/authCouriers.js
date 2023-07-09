const auth = require('basic-auth');
const Couriers = require('../../models/v1/couriers');

const authCouriers = (req, res, next) => {
    console.log("Middlewares :: authCourier :: Validando credenciales");
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [user, pass] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (!user) {
        console.log("Middlewares :: authCourier :: Credenciales de autenticación no proporcionadas");
        return res.status(401).json({ code: 'NOT_AUTHORIZED', message: 'Autenticacion requerida' });
    }

    user && Couriers.getCourierByUserName(user, (error, courier) => {
        if (error) {
            return res.status(500).json({ code: 'UNKNOW_ERROR', message: 'Error inesperado. Intente mas tarde' })
        }
        console.log("Middleware :: authCourier :: Mongo: ", courier)
        if (pass && courier && courier.password == pass) {
            req.session.courier = courier.toJSON();
            return req.session.save(function (err) {
                if (err) {
                    console.log("Middlewares :: authCourier :: Acceso negado");
                    res.set('WWW-Authenticate', 'Basic realm="Ingrese sus credenciales"');
                    return res.status(401).json({ code: 'NOT_AUTHORIZED', message: 'Autenticacion requerida' });
                }
                console.log("Middlewares :: authCourier :: Acceso concedido");
                return next();
            });
        }
        return res.status(401).json({ code: 'NOT_AUTHORIZED', message: 'Autenticacion requerida' });
    });
};

module.exports = authCouriers;
