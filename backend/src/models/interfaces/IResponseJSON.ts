export interface IResponseJSON {
    status: number;
    message: string;
    result?:any[]|any,
    error?:any;
    errorFeedback?: {
        formControll: string;
        feedbackMSG: string;
    }[];
}