import { Express } from "express";

export function catchError(res:any){
    return (error :any) =>res.status(500).json({error:String(error)})
}