import { IErrorFeedback } from "./IErrorFeedback";
import { IPaginationInfo } from "./IPaginationInfo";


export interface IHttpRequestResponse<T>{
    status:number,
    message:string,
    redirectTo?:string,
    jwt?:string
    errorFeedback?:IErrorFeedback[]
    type?:string,
    paginationInfo?:IPaginationInfo
    result?:T[],
    error?:Object,
    lastIDInserted?:number,
    lastNameInserted?:string,
    newKey?:string,
    accessLevel?:number

}