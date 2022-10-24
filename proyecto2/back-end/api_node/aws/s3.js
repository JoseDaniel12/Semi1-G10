const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

const bucket = process.env.BUCKET;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCES_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
});


const getBueckets = () => {
    return s3.listBuckets().promise();
};


const uploadToBucket = (file, short_file_name, directory) => {
    const stream = fs.createReadStream(file.tempFilePath);
    const extension = file.name.split(".")[1];
    const key = `${directory}/${short_file_name}.${extension}`;
   
    let content_type = 'image';
    if (extension === 'txt') {
        content_type = extension;
    } else if (extension === 'pdf') {
        content_type = 'application/pdf';
    } 

    const params = {
        Bucket: bucket,
        Key: key,
        Body: stream,
        ContentType: content_type
    };
    return s3.upload(params).promise();
};


const removeFromBucket = async (s3_key) => {
    const params = {
        Bucket: bucket,
        Key: s3_key,
    };
    await s3.deleteObject(params).promise();
};


const copyObject = async (source_s3_key, s3_destination_dir) => {
    const full_file_name = source_s3_key.split('/').slice(-1);
    const new_s3_key = `${s3_destination_dir}/${full_file_name}`;
    const params = {
        Bucket: bucket,
        CopySource: source_s3_key,
        Key: new_s3_key
    };
    await s3.copyObject(params).promise();
};


const renameObject = async (s3_key, new_short_file_name) => {
    const dir = s3_key.split('/').slice(-1).join('/');
    const extension = s3_key.split(".")[1];
    const new_s3_key = `${dir}/${new_short_file_name}.${extension}`;
    await copyObject(s3_key, new_s3_key);
    await removeFromBucket(s3_key);
};


module.exports = {
    getBueckets,
    uploadToBucket,
    copyObject,
    removeFromBucket,
    renameObject
};
