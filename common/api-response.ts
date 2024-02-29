import {Response} from 'express';

export const sendErrorResponse = (response:Response, status:number, errorMessage: string, error:unknown) => response.status(status).send({
    status: 'error',
    message: errorMessage,
    error: error
});

export const sendSuccessResponse = (response:Response, status:number, message: string, data: any) => response.status(status).send({
    status: 'success',
    message: message,
    data: data
});