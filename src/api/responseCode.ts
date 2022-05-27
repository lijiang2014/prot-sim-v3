
export enum errorEode {
    codeStart = 20000, //错误码起始编号

    CODE_DB_ERROR,    //数据库错误
    CODE_NOT_TIMEOUT,      //沿用之前的验证码
    CODE_IS_TIMEOUT,//验证码过期
    EMAIL_REGISTER_CODE_SEND_FAILED, //错误码发送
    CODE_ERR_AUTH //认证失败
}