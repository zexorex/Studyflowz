import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { classroomService } from '../services/api';
import { BookOpen, ChevronRight, Loader2 } from 'lucide-react';

const Dashboard = () => {
  // Fetch courses using React Query
  const { data: courses, isLoading, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await classroomService.getCourses();
      return res.data.data; // Access the actual array of courses
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>Failed to load courses. Please try logging in again.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-8">My Classes</h2>
      
      {/* Grid Layout for Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link 
            key={course.id} 
            to={`/course/${course.id}`}
            className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 overflow-hidden"
          >
            {/* Colorful Header */}
            <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-400 p-6 flex justify-between items-start">
              <BookOpen className="text-white/80" />
            </div>
            
            {/* Course Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                {course.name}
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                {course.section || 'No section'}
              </p>
              
              <div className="flex items-center text-primary font-medium text-sm mt-4">
                View Assignments <ChevronRight size={16} className="ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {courses.length === 0 && (
        <p className="text-center text-slate-500 mt-10">
          No active courses found in your Google Classroom.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
        
