interface requestError {
    status?: number;
    message?:string,
    statusCode?:number
}

interface Error {
    message?: string
    statusCode?: number
}

export {
    requestError,
    Error
}