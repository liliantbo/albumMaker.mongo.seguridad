const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'ASIATIFAYCUFZG3F3MH3',
    secretAccessKey: 'mag3DSrw6BJ6aIVy1bcddDQxPuAoro3BoQEgjOgo',
    region: 'us-east-1',
    sessionToken: 'FwoGZXIvYXdzEEsaDB5V5DJaa6WGVnMl+iLBAS1LWjmVjIcD+BiqxUY8uRyyY0ZBnsSuldp4fgknpiVCsDmOZfdo2sWQBKkl7QJB/G4fSXXU1nj3h/6op19buDKJHQpx14jlQ1M3L8rHnWmnoD+1xwbRq5yQNl5aYrAMoICloA1NImDBrpCEtC0ISARBi1fCJMxyfAB5voHeM99S3eXSWHwulreA6mlXrg9xRn9IUk4jYENPPPeUyZFVYwYhJgcAqB7/jOZ6QdkanTJ/8EiijdIwAIydnPQOtjg51cco5O2ypQYyLaTPY4FCenpFcCdD+qikdduMyp+IblveDP+ynL1wd4T+BzUOW5Apc0/quGOF5Q=='
});

const s3 = new AWS.S3();

const uploadToS3 = async ({ imageListNew, imageUrlList }, cb) => {
    console.log("Models :: Images :: uploadToS3 :: imageListNew: ",
        imageListNew && imageListNew.length,
        "imageUrlList: ", imageUrlList && imageUrlList.length);
    if (!imageListNew || imageListNew.length == 0) {
        return cb("Models :: Images :: uploadToS3 :: Error al ejecutar el uploadToS3");
    }

    for (const image of imageListNew) {
        const { file, index } = image;
        const base64Data = file.item;
        const newFile = new Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ""), 'base64');
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