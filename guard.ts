import {Request, Response,NextFunction} from 'express'

 export let adminGuard = (req: Request,res:Response,next:NextFunction)=>{
    if (req.session?.user){
        next()
    }else{
        res.status(401).json({error:'only accessible by users'})
    }
}