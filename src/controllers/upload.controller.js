const statusResponse = require("../commons/statusResponse")
const { streamMultiUpload } = require("../services/upload.service")

const uploadImages = async (req, res) => {
    const { files } = req
    try {
        var result = await Promise.all(files.map(file => streamMultiUpload(file.path)))
        res.json({
            ...statusResponse.OK,
            data: result
        })
    }
    catch (error) {
        res.json(error)
    }
}
module.exports = {
    uploadImages
}