const aws_keys = {
    s3: {},

    cognito: {
        region: 'us-east-2',
        grupoID: 'us-east-2_Q1XrrlULs',
        grupoARN: 'arn:aws:cognito-idp:us-east-2:116324869474:userpool/us-east-2_Q1XrrlULs',
        gclientID: '5hai39kdiaffbcrtt1rji7pgsj',
        identityPoolId: 'us-east-2:cc29c303-4801-4484-96b3-0e08f0dfda66'
    },

    cognito2: {
        region: 'us-east-2',
        grupoID: 'us-east-2_ORSx3ONyJ',
        gclientID: '3ocg406fgm44v4q8a5he9m5v4i'
    },

    rekognition: {
        region: '',
        accessKeyId: '',
        secretAccessKey: ''
    }
}

module.exports = aws_keys;