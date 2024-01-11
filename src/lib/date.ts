import { format } from 'date-fns/format';

export function formatPrettier(value: Date) { 
  return value && format(new Date(value), "'le' dd/MM/yyyy 'à' HH:mm")
}

export function formatPrettierAndWeek(value: Date) { 
  return value && format(new Date(value), "'le' dd/MM/yyyy 'à' HH:mm 'Semaine' w")}

export function formatForServer(value: Date) { 
  return value && format(new Date(value), 'yyyy-MM-dd HH:mm:ss')}
