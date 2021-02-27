const createResponse = (code, message, description) => ({
    code,
    message,
    description
})

const statusResponse={
    OK: createResponse(1000,"OK","request success"),
    PARAMS_MISS: createResponse(4000,'PARAMS_MISS',"missing field or params"),
    UNKNOWN: createResponse(4001,'UNKNOWN',"unknown error"),
    NOT_VALIDATED: createResponse(4002,'NOT_VALIDATED',"email or password is wrong"),
    USER_EXISTED: createResponse(4003,"USER_EXISTED","user is existed in the system"),
    NOT_FOUND: createResponse(4004, "NOT_FOUND", "not found or is blocked"),
    NOT_ACCEPT: createResponse(4005, 'NOT_ACCEPT', "is blocked or you block" ),
    SUCCEED: createResponse(4006, "SUCCEED", "this request has succeed or is spam")
}
module.exports= statusResponse