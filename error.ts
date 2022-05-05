import { Express } from "express";

export function catchError(res:Express.Response){
    return (error :any) =>res.status(500).json({error:String(error)})
}