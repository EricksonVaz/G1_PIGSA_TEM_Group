import  jwt from 'jsonwebtoken';
import { Request as TRequest } from "express";

export const privateKey = "pZS6q6rWX7MDFOFBBElZ";

export function getToken(obj:any){
    //exp 30 segundos
    return (jwt as any).sign({data:obj}, privateKey, {algorithm:"HS256" ,expiresIn: ((60*60)*24)*7,header:{"typ":"JWT","site":"pigsa.cv"} });
}

export function verifyToken(token:string){
    try {
        return jwt.verify(token, privateKey);
    } catch(err) {
        return false;
    }
}

export function getInfoUserLogged<T>(req:TRequest){
    return (req as any).user?.data as T;
}
