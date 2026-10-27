import type { Report, ReportReason } from '../types';
import { delay, generateId, mockReports, MOCK_CURRENT_USER_ID } from './mockDb';

export interface CreateReportData {
  petId: string;
  reason: ReportReason;
  details?: string;
}

export async function createReport(data: CreateReportData): Promise<Report> {
  const report: Report = {
    id: generateId('report'),
    petId: data.petId,
    reporterUserId: MOCK_CURRENT_USER_ID,
    reason: data.reason,
    details: data.details,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  mockReports.push(report);
  return delay(report);
}
