const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
    sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN
});

const s3 = new AWS.S3();

const uploadToS3 = async ({ imageListNew, imageUrlList }, cb) => {
    console.log("Models :: Images :: uploadToS3 :: imageListNew: ", imageListNew?.length,
    "imageUrlList: ", imageUrlList?.length);
    
    if (!imageListNew || imageListNew.length == 0) {
        return cb("Models :: Images :: uploadToS3 :: Error al ejecutar el uploadToS3");
    }

    for (const image of imageListNew) {
        const { file, index } = image;
        const base64Data = file.item;
        const newFile = Buffer.alloc(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const type = base64Data.split(';')[0].split('/')[1];

        console.log("contenido de file: ", file)
        console.log("contenido de file.file : ", newFile)
        console.log("Models :: Images :: uploadToS3 :: Cargando a S3 index: ", index, "file: ", newFile);
        const params = {
            Bucket: 'albummaker',
            Key: `${Date.now()}.${newFile.name}`,
            Body: newFile,
            ContentEncoding: 'base64', 
            ContentType: `image/${type}`
        };
        try {
            const { Location } = await s3.upload(params).promise();
            console.log("Models :: Images :: uploadToS3 ::", index, "Url obtenida de s3", Location);
            if (imageUrlList && index < imageUrlList.length) {
                console.log("actualizando urlList")
                imageUrlList[index] = Location;
            } else {
                console.log("agregando nueva imagen");
                imageUrlList.push(Location);
                console.log("nueva imagen agregada");

            }
           
        } catch (error) {
            console.log("Models :: Images :: uploadToS3 :: Error al ejecutar", index, " el uploadToS3", error)
            return cb(error);
        }
    }
    return cb(null, imageUrlList);

};

module.exports = uploadToS3;