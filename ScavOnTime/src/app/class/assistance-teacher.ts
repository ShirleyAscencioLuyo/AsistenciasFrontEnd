export interface AssistanceTeacher {
  id: number | null;
  teacherId: number;
  attendanceStatus: string;
  shift: string;
  attendanceDate: string;
  entryTime: string;
  exitTime: string;
  observations: string;
}
