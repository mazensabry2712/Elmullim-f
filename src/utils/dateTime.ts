export type AppLanguage = "ar" | "en";

const localeFor = (language: AppLanguage) =>
  language === "ar" ? "ar-EG" : "en-EG";

const parseDate = (value: string | Date) => {
  if (value instanceof Date) return value;

  const dateOnlyMatch = /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (dateOnlyMatch) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
};

export const formatDate = (
  value: string | Date,
  language: AppLanguage = "en"
) => {
  const date = parseDate(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(localeFor(language), {
    dateStyle: "medium",
  }).format(date);
};

export const formatWeekday = (
  value: string | Date,
  language: AppLanguage = "en"
) => {
  const date = parseDate(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(localeFor(language), {
    weekday: "short",
  }).format(date);
};

export const formatDateTime = (
  value: string | Date,
  language: AppLanguage = "en"
) => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(localeFor(language), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const formatTime = (
  value: string | Date,
  language: AppLanguage = "en"
) => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(localeFor(language), {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatDateTimeLocalInput = (date: Date = new Date()) => {
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join(
      "-"
    ) +
    "T" +
    [pad(date.getHours()), pad(date.getMinutes())].join(":")
  );
};

export const dateTimeLocalToIso = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
};
