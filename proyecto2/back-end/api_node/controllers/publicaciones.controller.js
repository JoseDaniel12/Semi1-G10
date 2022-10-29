var AWS = require('aws-sdk');

let aws_keys = {
    translate: {
        region: process.env.AWS_REGION_TRANSLATE,
        accessKeyId: process.env.AWS_ACCES_KEY_TRANSLATE,
        secretAccessKey: process.env.AWS_SECRET_KEY_TRANSLATE
    }
}

const translate = new AWS.Translate(aws_keys.translate);

const traducir = async (req, res) => {
    const { text, target } = req.body;

    let params = {
        SourceLanguageCode: 'auto',
        TargetLanguageCode: target,
        Text: text || 'Hello there'
    };
    translate.translateText(params, function (err, data) {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(data);
        }
    });
};


module.exports = {
    traducir,
};
