import { Request, Response, NextFunction } from "express";
import { validateIdParam } from "@/utils/validators";

/**
 * Validate id param
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const validateTaskIdParam = (req: Request, res: Response, next: NextFunction) => {
    const id = validateIdParam(req, res);
    if (!id) return;
    req.params.id = id;

    next();
}
