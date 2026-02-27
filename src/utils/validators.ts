import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "@/utils/HttpStatus";

// =====================================
//          String Validation
// =====================================

/**
 * Entire helper to validate string, created to avoid code smell
 * @param field 
 * @param req 
 * @param res 
 * @returns 
 */
export const validateStringField = (
    field: string,
    req: Request,
    res: Response
): string | null => {
    const value = req.body[field];

    if (typeof value !== "string" || value.trim().length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({
            error: `${field.toUpperCase()}_IS_REQUIRED`
        });
        return null;
    }

    return value.trim();
};

// =====================================
//            Enum Validation
// =====================================

/**
 * Entire helper to validate enum
 * @param field from request
 * @param enumObj Enum object
 * @param req to get value from request
 * @param res to send error response
 * @returns enum value or null
 */
export const validateEnumField = <T extends object>(
    field: string,
    enumObj: T,
    req: Request,
    res: Response
): T[keyof T] | null => {
    const value = req.body[field];

    // Validate as string
    if (typeof value !== "string") {
        res.status(HttpStatus.BAD_REQUEST).json({
            error: `${field.toUpperCase()}_IS_REQUIRED`
        });
        return null;
    }

    const sanitized = value.trim();

    // Validate if value is present on the generic object
    if (!Object.values(enumObj).includes(sanitized)) {
        res.status(HttpStatus.BAD_REQUEST).json({
            error: `INVALID_${field.toUpperCase()}`
        });
        return null;
    }

    return sanitized as T[keyof T];
};

/**
 * Validate a date field on the request
 * @param field from request
 * @param req to get value from request
 * @param res to send error response
 * @returns value or null
 */
export const validateDateField = (
    field: string,
    req: Request,
    res: Response
): Date | null => {
    // Validate as string
    const value = req.body[field];

    if (!value || typeof value !== "string") {
        res.status(HttpStatus.BAD_REQUEST).json({
            error: `${field.toUpperCase()}_IS_REQUIRED`
        });
        return null;
    }

    // Validate if is a valid date
    const date = new Date(value);

    // try accesing to Time, if is not a valid date is NaN
    if (isNaN(date.getTime())) {
        res.status(HttpStatus.BAD_REQUEST).json({
            error: `INVALID_${field.toUpperCase()}`
        });
        return null;
    }

    return date;
}