export interface User {
  id: string;
  email: string;
  role: 'admin' | 'student';
  created_at: string;
}

export interface Student {
  id: string;
  student_id: string;
  name: string;
  email?: string;
  department?: string;
  photo_url?: string;
  face_embedding?: number[];
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name: string;
  date: string;
  time_in: string;
  time_out?: string;
  status: 'present' | 'absent' | 'late';
  confidence_score?: number;
  created_at: string;
}

export interface AttendanceStats {
  total_students: number;
  present_today: number;
  absent_today: number;
  late_today: number;
  attendance_rate: number;
}

export interface CameraState {
  isActive: boolean;
  stream?: MediaStream;
  error?: string;
}

export interface RecognitionResult {
  student_id: string;
  student_name: string;
  confidence: number;
  is_live: boolean;
}