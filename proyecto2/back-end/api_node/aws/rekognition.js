const AWS = require('aws-sdk')
const aws_keys = require('./keys')

function getParamsFotos(webcam, url_foto) {
    return {
        SourceImage: {
            Bytes: Buffer.from(webcam, 'base64')
        },
        TargetImage: {
            S3Object: {
                Bucket: process.env.BUCKET,
                Name: `fotos/${url_foto}`
            },
        },
        SimilarityThreshold: 70
    }
}
 
function compararFotos(params) {
    return new Promise(resolve => {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCES_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: process.env.AWS_REGION
        });

        const client = new AWS.Rekognition();

        client.compareFaces(params, function(err, response) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            } else {
                response.FaceMatches.forEach(data => {
                    resolve(data.Similarity);
                })
            } 
        });
    });
}

function obtenerEtiquetas(params) {
    return new Promise(resolve => {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCES_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: process.env.AWS_REGION
        });

        const client = new AWS.Rekognition();

        client.detectLabels(params, function(err, response) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            } else {
                resolve(response)
            }
        });
    });
}

module.exports = {
    compararFotos,
    obtenerEtiquetas,
    getParamsFotos,
}
