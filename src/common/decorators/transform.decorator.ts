import { Transform } from 'class-transformer';
import { isString } from 'class-validator';

export function Default<T>(
  defaultValue: T,
): (target: any, key: string) => void {
  return Transform(({ value }: { value: string }) => {
    if (
      value !== null &&
      value !== undefined &&
      value !== 'undefined' &&
      ((isString(value) && value.trim() !== '') ||
        (Array.isArray(value) && value.length > 0))
    ) {
      return value;
    } else if (typeof value === 'boolean') {
      return value;
    }
    return defaultValue;
  });
}
