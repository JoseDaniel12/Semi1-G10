const conn = require('./conexion');

const execute = async function consultar(query) {
  try {
    const [result] = await conn.promise().execute(query);
    return {query, result};
  } catch (err) {
    throw err;
  }
};


const execute_sp = async function execute_sp(proc_name, params) {
  try {
    const formated_params = Object.values(params).join(`', '`)
    const proc = `CALL ${proc_name}('${formated_params}');`
    const [result] = await conn.promise().execute(proc);
    return {proc, result};
  } catch (err) {
    throw err;
  }
};


module.exports = {
  execute,
  execute_sp
}
