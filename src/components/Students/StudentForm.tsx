import React, { useState } from 'react';
import { User, Upload } from 'lucide-react';
import { Button } from '../UI/Button';
import { Student } from '../../types';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

interface StudentFormProps {
  onSubmit: (student: Student) => void;
  onCancel: () => void;
  initialData?: Partial<Student>;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    student_id: initialData?.student_id || '',
    name: initialData?.name || '',
    email: initialData?.email || '',
    department: initialData?.department || '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.photo_url || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let photoUrl = initialData?.photo_url;
      let faceEmbedding = initialData?.face_embedding;

      // Create student first
      const studentData = {
        ...formData,
        photo_url: photoUrl,
        face_embedding: faceEmbedding,
      };

      const student = initialData?.id
        ? await api.updateStudent(initialData.id, studentData)
        : await api.createStudent(studentData);

      // Upload photo if provided
      if (photo) {
        try {
          const uploadResult = await api.uploadPhoto(photo, student.id);
          student.photo_url = uploadResult.photo_url;
          student.face_embedding = uploadResult.face_embedding;
          
          // Update student with photo data
          await api.updateStudent(student.id, {
            photo_url: uploadResult.photo_url,
            face_embedding: uploadResult.face_embedding,
          });
        } catch (error) {
          toast.error('Failed to process photo. Student created but photo upload failed.');
          console.error('Photo upload error:', error);
        }
      }

      toast.success(`Student ${initialData?.id ? 'updated' : 'created'} successfully!`);
      onSubmit(student);
    } catch (error) {
      toast.error(`Failed to ${initialData?.id ? 'update' : 'create'} student`);
      console.error('Student form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Chemical',
    'Other',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Student Photo
        </label>
        <div className="flex items-center space-x-4">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Student preview"
              className="h-24 w-24 object-cover rounded-lg border-2 border-gray-200"
            />
          ) : (
            <div className="h-24 w-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <User className="h-8 w-8 text-gray-400" />
            </div>
          )}
          
          <div>
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Required for face recognition
            </p>
          </div>
        </div>
      </div>

      {/* Student ID */}
      <div>
        <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-1">
          Student ID
        </label>
        <input
          type="text"
          id="student_id"
          name="student_id"
          value={formData.student_id}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="STU001"
        />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="John Doe"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="john.doe@example.com"
        />
      </div>

      {/* Department */}
      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
          Department
        </label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
        >
          {initialData?.id ? 'Update Student' : 'Create Student'}
        </Button>
      </div>
    </form>
  );
};