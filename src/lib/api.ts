import { Student, AttendanceRecord, AttendanceStats, RecognitionResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Student Management
  async createStudent(studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> {
    // Mock implementation - replace with actual API call
    const mockStudent: Student = {
      id: Date.now().toString(),
      ...studentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Store in localStorage for demo
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    students.push(mockStudent);
    localStorage.setItem('students', JSON.stringify(students));
    
    return mockStudent;
  }

  async getStudents(): Promise<Student[]> {
    // Mock implementation - replace with actual API call
    return JSON.parse(localStorage.getItem('students') || '[]');
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    // Mock implementation - replace with actual API call
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const index = students.findIndex((s: Student) => s.id === id);
    
    if (index !== -1) {
      students[index] = { ...students[index], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem('students', JSON.stringify(students));
      return students[index];
    }
    
    throw new Error('Student not found');
  }

  async deleteStudent(id: string): Promise<void> {
    // Mock implementation - replace with actual API call
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const filtered = students.filter((s: Student) => s.id !== id);
    localStorage.setItem('students', JSON.stringify(filtered));
  }

  // Face Recognition
  async uploadPhoto(file: File, studentId: string): Promise<{ photo_url: string; face_embedding: number[] }> {
    // Mock implementation - in production, this would upload to your backend
    const mockEmbedding = Array.from({ length: 128 }, () => Math.random());
    
    return {
      photo_url: URL.createObjectURL(file),
      face_embedding: mockEmbedding,
    };
  }

  async recognizeFace(imageData: string): Promise<RecognitionResult> {
    // Mock implementation - replace with actual face recognition API
    const mockResult: RecognitionResult = {
      student_id: 'STU001',
      student_name: 'John Doe',
      confidence: 0.95,
      is_live: true,
    };
    
    return mockResult;
  }

  // Attendance Management
  async markAttendance(studentId: string, confidence: number): Promise<AttendanceRecord> {
    // Mock implementation - replace with actual API call
    const mockRecord: AttendanceRecord = {
      id: Date.now().toString(),
      student_id: studentId,
      student_name: 'John Doe',
      date: new Date().toISOString().split('T')[0],
      time_in: new Date().toTimeString().split(' ')[0],
      status: 'present',
      confidence_score: confidence,
      created_at: new Date().toISOString(),
    };
    
    // Store in localStorage for demo
    const records = JSON.parse(localStorage.getItem('attendance_records') || '[]');
    records.push(mockRecord);
    localStorage.setItem('attendance_records', JSON.stringify(records));
    
    return mockRecord;
  }

  async getAttendanceRecords(filters?: {
    date?: string;
    student_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<AttendanceRecord[]> {
    // Mock implementation - replace with actual API call
    return JSON.parse(localStorage.getItem('attendance_records') || '[]');
  }

  async getAttendanceStats(date?: string): Promise<AttendanceStats> {
    // Mock implementation - replace with actual API call
    return {
      total_students: 150,
      present_today: 120,
      absent_today: 25,
      late_today: 5,
      attendance_rate: 80.0,
    };
  }

  // Reports
  async exportAttendanceCSV(filters?: {
    start_date?: string;
    end_date?: string;
    student_id?: string;
  }): Promise<Blob> {
    // Mock implementation - replace with actual API call
    const records = JSON.parse(localStorage.getItem('attendance_records') || '[]');
    const csvContent = [
      ['Student Name', 'Student ID', 'Date', 'Time In', 'Status', 'Confidence'],
      ...records.map((record: AttendanceRecord) => [
        record.student_name,
        record.student_id,
        record.date,
        record.time_in,
        record.status,
        record.confidence_score ? (record.confidence_score * 100).toFixed(1) + '%' : 'N/A',
      ]),
    ].map(row => row.join(',')).join('\n');
    
    return new Blob([csvContent], { type: 'text/csv' });
  }
}

export const api = new ApiClient();