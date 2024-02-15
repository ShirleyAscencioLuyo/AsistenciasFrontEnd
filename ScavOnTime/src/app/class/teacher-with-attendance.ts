export interface TeacherWithAttendance {
  id: number | null;
  teacherId: number;
  documentNumber: string;
  lastname: string;
  name: string;
  typeCharge: string;
  attendanceStatus: string | null;
  entryTime: string | null;
  exitTime: string | null;
  observations: string | null;
}
