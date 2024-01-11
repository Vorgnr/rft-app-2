
export function capitalize(value: string) {
 if (typeof value !== 'string') return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export function pluralize(value: string, count: number) {
  if (count > 1) {
    return `${value}s`;
  }
  return value;
};
