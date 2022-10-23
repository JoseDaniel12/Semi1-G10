const conn = require('./conexion');


const exec_query = async (query) => {
    try {
        const [result] = await conn.promise().execute(query);
        return result;
    } catch (err) {
        return {err};
    }
}
  
  
const exec_proc = async (name, params) => {
    try {
        let proc;
        if (params.length > 0) {
            const formated_params = params.join(`', '`);
            proc = `CALL ${name}('${formated_params}');`;
        } else {
            proc = `CALL ${name}();`;
        }
        const [result] = await conn.promise().execute(proc);
        return result[0];
    } catch (err) {
        return {err};
    }
}
  
  
module.exports = {
    exec_query,
    exec_proc
}
  