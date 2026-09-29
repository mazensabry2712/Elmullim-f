export type AppLanguage = "ar" | "en";

const localeFor = (language: AppLanguage) =>
  language === "ar" ? "ar-EG" : "en-EG";

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
