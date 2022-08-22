const {uploadToBucket} = require('../helpers/s3')

const subirArchivo = async (req, res) => {
    const result = await uploadToBucket(req.files.file);

    return res.json(result);
    
};

module.exports = {
    subirArchivo
};