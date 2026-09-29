export const MAX_IMAGE_SIZE = 5000000; // 5MB
export const MAX_CV_SIZE = 10000000; // 10MB

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ACCEPTED_CV_TYPES = [
  "application/pdf", // pdf
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

export const isValidFileType = (file: File, acceptedTypes: string[]): boolean =>
  acceptedTypes.includes(file?.type);
