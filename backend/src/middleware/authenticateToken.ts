import  jwt from 'jsonwebtoken';
import { NextFunction, Request as TRequest, Response as TResponse } from "express";
import { privateKey } from './handleJWT';

export function authenticateToken(req:TRequest, res:TResponse, next:NextFunction){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) 
    return res.status(401).json({
        status:401,
        message:"Login é necessario"
    });

    jwt.verify(token, privateKey, (err, user) => {
        console.log(token,err)

        if (err)
        return res.status(403).json({
            status:403,
            redirectTo:"login",
            message:"Acesso Negado Token invalido"
        });

        (req as any).user = user;

        next();
    });
}