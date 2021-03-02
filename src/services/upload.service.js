const streamifier = require('streamifier')
var cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'api-fakebook',
    api_key: '492541787796645',
    api_secret: '5GtH9r9-DMPUvf9RLP1WN8kMY6U'
});
let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        console.log(req)
        streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
};
const streamMultiUpload = async file => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (err, res) => {
            if (err) return res.json("loi upload")
            console.log(res.secure_url)
            resolve(res.secure_url)
        }
        )
    })
}

module.exports = {
    streamUpload,
    streamMultiUpload
}