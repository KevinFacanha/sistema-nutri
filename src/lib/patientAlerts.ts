const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const ALERT_MILESTONES = [7, 15, 30, 45, 60, 90, 120, 180, 360] as const;
export type AlertMilestone = typeof ALERT_MILESTONES[number];

const toStartOfDay = (date: Date): Date => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

const parseDateInput = (dateString: string): Date => {
  if (dateString.includes('T')) {
    return new Date(dateString);
  }

  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

export const calculateDaysSinceConsultation = (consultationDate: string): number => {
  const today = toStartOfDay(new Date());
  const consultation = toStartOfDay(parseDateInput(consultationDate));

  if (Number.isNaN(consultation.getTime())) return 0;

  const diffTime = today.getTime() - consultation.getTime();
  const elapsedDays = Math.floor(diffTime / DAY_IN_MS);

  // Contagem inclusiva para manter o mesmo comportamento já exibido na lista/cartão.
  return Math.max(elapsedDays + 1, 0);
};

export const isAlertMilestone = (days: number): days is AlertMilestone => {
  return ALERT_MILESTONES.includes(days as AlertMilestone);
};

interface ShouldShowAlertParams {
  consultationDate: string;
  lastContactedAt?: string | null;
  lastContactedMilestone?: number | null;
}

export const shouldShowPatientInAlerts = ({
  consultationDate,
  lastContactedAt,
  lastContactedMilestone
}: ShouldShowAlertParams): boolean => {
  const days = calculateDaysSinceConsultation(consultationDate);

  if (!isAlertMilestone(days)) return false;

  const contactedSameMilestone = Boolean(lastContactedAt) &&
    lastContactedMilestone === days &&
    new Date(lastContactedAt!).getTime() > parseDateInput(consultationDate).getTime();

  return !contactedSameMilestone;
};
