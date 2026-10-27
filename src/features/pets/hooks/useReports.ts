import { useMutation } from '@tanstack/react-query';
import { createReport } from '../services/reportsService';
import type { CreateReportData } from '../services/reportsService';

/** No query/key factory — nothing in the app reads reports back (no review UI in scope). */
export function useCreateReport() {
  return useMutation({
    mutationFn: (data: CreateReportData) => createReport(data),
  });
}
