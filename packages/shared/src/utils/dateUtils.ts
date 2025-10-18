import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};
