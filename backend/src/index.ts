import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express, { NextFunction, Request, Response } from "express";
import cors  from 'cors';
import apiRouter from './routers/api.router';

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();


app.use(cors({
  origin: '*',
  credentials:true
}));

app.use(express.static('public'));
app.use(express.urlencoded({extended:true,limit:'50mb'}));
app.use(express.json({limit: '50mb'}));
app.use((err:any, req:Request, res:Response, next:NextFunction) => {
    // This check makes sure this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser:

    if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).json(
            {
                status:400,
                message:"Dados Submetidos invalido"
            }
        )
    }

    next();
});

app.use("/pigsa-api",apiRouter);


const server = app.listen(port,()=>console.log(`servidor rodando na porta ${port}`));
server.setTimeout(480000);