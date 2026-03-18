import { SpecialPeriod } from '../types';

export function getSpecialPeriod(date: Date, specialPeriods: SpecialPeriod[]): SpecialPeriod | undefined {
  const dateTime = date.getTime();
  return specialPeriods.find((p) => {
    const startTime = new Date(p.start).getTime();
    const endTime = new Date(p.end).getTime();
    return dateTime >= startTime && dateTime <= endTime;
  });
}
