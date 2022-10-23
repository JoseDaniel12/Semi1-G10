const {exec_proc, exec_query} = require('../database/db_exec_v2');
const {uploadToBucket, removeFromBucket, copyObject} = require('../aws/s3');


const prueba = async (req, res) => {
    const { file_name} = req.body;
    const { file } = req.files;

    //const result = await uploadToBucket( file, file_name, 'prueba');
    //const result = await removeFromBucket('prueba/petronilo.jpg');
    const result = await copyObject('prueba/petronilo.jpg', 'prueba');
    //const result = await copyObject('/prueba/petronilo.jpg', '/vecino');
    res.status(200).json(result);
};


module.exports = {
    prueba,
};
