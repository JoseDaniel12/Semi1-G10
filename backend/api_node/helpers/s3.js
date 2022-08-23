const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCES_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey 
});

const bucket = 'archivos-g10-p1';


const getBueckets = () => {
    return s3.listBuckets().promise();
};


const uploadToBucket = (userId, file, fileName) => {
    const stream = fs.createReadStream(file.tempFilePath);
    const extension = file.name.split(".")[1];
    const key = userId + "/" + fileName + "." + extension;
    const params = {
        Bucket: bucket,
        Key: key,
        Body: stream
    };
    return s3.upload(params).promise();
};


const removeFromBucket =  async (userId, fileName) => {
    const key = userId + "/" + fileName;
    const params = {
        Bucket: bucket,
        Key: key,
    };
    
    await s3.deleteObject(params).promise();
};

module.exports = {
    getBueckets,
    uploadToBucket,
    removeFromBucket
};