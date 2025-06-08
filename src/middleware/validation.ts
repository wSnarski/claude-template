import { Request, Response, NextFunction } from 'express';
import { createError } from './error-handler';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'email';
  min?: number;
  max?: number;
  enum?: any[];
  custom?: (value: any) => boolean | string;
}

export function validate(rules: ValidationRule[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      // Check required
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} is required`);
        continue;
      }

      // Skip further validation if field is not present and not required
      if (value === undefined || value === null) {
        continue;
      }

      // Type validation
      if (rule.type) {
        switch (rule.type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push(`${rule.field} must be a string`);
            }
            break;
          case 'number':
            if (typeof value !== 'number' || isNaN(value)) {
              errors.push(`${rule.field} must be a number`);
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push(`${rule.field} must be a boolean`);
            }
            break;
          case 'date':
            if (isNaN(Date.parse(value))) {
              errors.push(`${rule.field} must be a valid date`);
            }
            break;
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              errors.push(`${rule.field} must be a valid email`);
            }
            break;
        }
      }

      // Min/Max validation
      if (rule.min !== undefined) {
        if (typeof value === 'string' && value.length < rule.min) {
          errors.push(`${rule.field} must be at least ${rule.min} characters`);
        } else if (typeof value === 'number' && value < rule.min) {
          errors.push(`${rule.field} must be at least ${rule.min}`);
        }
      }

      if (rule.max !== undefined) {
        if (typeof value === 'string' && value.length > rule.max) {
          errors.push(`${rule.field} must be at most ${rule.max} characters`);
        } else if (typeof value === 'number' && value > rule.max) {
          errors.push(`${rule.field} must be at most ${rule.max}`);
        }
      }

      // Enum validation
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`${rule.field} must be one of: ${rule.enum.join(', ')}`);
      }

      // Custom validation
      if (rule.custom) {
        const result = rule.custom(value);
        if (result !== true) {
          errors.push(typeof result === 'string' ? result : `${rule.field} is invalid`);
        }
      }
    }

    if (errors.length > 0) {
      next(createError(errors.join(', '), 400));
    } else {
      next();
    }
  };
}