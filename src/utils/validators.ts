// Utility functions for validation and form handling

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateForm = {
  title: (title: string): boolean => title.trim().length >= 3,
  subject: (subjectId: string): boolean => subjectId.trim().length > 0,
  professor: (professorId: string): boolean => professorId.trim().length > 0,
  year: (year: string): boolean => {
    const yearNum = parseInt(year);
    return !isNaN(yearNum) && yearNum >= 2000 && yearNum <= 2100;
  },
  file: (file: File | null): boolean => file !== null,
  content: (content: string): boolean => content.trim().length >= 10
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isValidFileType = (file: File): boolean => {
  const validTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = getFileExtension(file.name);
  return validTypes.includes(extension);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
