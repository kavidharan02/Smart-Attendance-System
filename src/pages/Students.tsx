import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { StudentForm } from '../components/Students/StudentForm';
import { Student } from '../types';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await api.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      // Mock data for demo
      setStudents([
        {
          id: '1',
          student_id: 'STU001',
          name: 'John Doe',
          email: 'john.doe@example.com',
          department: 'Computer Science',
          photo_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          student_id: 'STU002',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          department: 'Information Technology',
          photo_url: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
          created_at: '2023-01-02T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`Are you sure you want to delete ${student.name}?`)) {
      return;
    }

    try {
      await api.deleteStudent(student.id);
      setStudents(students.filter(s => s.id !== student.id));
      toast.success('Student deleted successfully');
    } catch (error) {
      toast.error('Failed to delete student');
      console.error('Delete error:', error);
    }
  };

  const handleFormSubmit = (student: Student) => {
    if (editingStudent) {
      setStudents(students.map(s => s.id === student.id ? student : s));
    } else {
      setStudents([...students, student]);
    }
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleFormCancel = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage student profiles and face recognition data</p>
        </div>
        <Button onClick={handleAddStudent} icon={Plus}>
          Add Student
        </Button>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-3 aspect-h-2">
              {student.photo_url ? (
                <img
                  src={student.photo_url}
                  alt={student.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                <span className="text-sm text-gray-500">{student.student_id}</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-1">{student.email}</p>
              <p className="text-sm text-gray-600 mb-4">{student.department}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <div className={`h-3 w-3 rounded-full ${
                    student.face_embedding ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <span className="text-xs text-gray-600">
                    {student.face_embedding ? 'Face Registered' : 'No Face Data'}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditStudent(student)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStudent(student)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {students.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first student</p>
          <Button onClick={handleAddStudent} icon={Plus}>
            Add Student
          </Button>
        </div>
      )}

      {/* Student Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleFormCancel}
        title={editingStudent ? 'Edit Student' : 'Add Student'}
        size="lg"
      >
        <StudentForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={editingStudent || undefined}
        />
      </Modal>
    </div>
  );
};