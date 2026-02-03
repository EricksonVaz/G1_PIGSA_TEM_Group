import formidable,{ Fields, Files} from "formidable";
import { Request as TRequest, Response as TResponse } from "express";

export function handleForm(req:TRequest){
    return new Promise<{fields: Fields,files:Files}>((resolve,reject)=>{
        var form = new formidable.IncomingForm();
        (form as any).multiples = true;
        form.parse(req, function (err, fields, files) {
            if(err){
                let objResponse = {
                    status:500,
                    message:err
                }
                reject({status:500,objResponse})
            }
            resolve({fields,files})
        });
    });
}