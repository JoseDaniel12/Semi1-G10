const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCES_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;


const storage = new S3({
    region,
    accessKeyId,
    secretAccessKey 
});


const getBueckets = () => {
    return storage.listBuckets().promise();
};


const uploadToBucket = (file) => {
    const stream = fs.createReadStream(file.tempFilePath);
    const params = {
        Bucket: 'archivos-g10-p1',
        Key: file.name,
        Body: stream
    };
    return storage.upload(params).promise();
};


module.exports = {
    getBueckets,
    uploadToBucket
};