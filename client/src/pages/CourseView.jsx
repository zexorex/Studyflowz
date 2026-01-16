import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { classroomService } from '../services/api';
import { FileText, Calendar, Loader2 } from 'lucide-react';

const CourseView = () => {
  const { courseId } = useParams();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments', courseId],
    queryFn: async () => {
      const res = await classroomService.getAssignments(courseId);
      return res.data.data;
    }
  });

  if (isLoading) return <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-8 text-sm text-slate-500">
        <Link to="/dashboard" className="hover:text-primary">Dashboard</Link> 
        <span>/</span>
        <span>Assignments</span>
      </div>

      <h2 className="text-3xl font-bold text-slate-800 mb-6">Pending Work</h2>

      <div className="space-y-4">
        {assignments?.map((work) => (
          <Link 
            key={work.id} 
            to={`/work/${courseId}/${work.id}`}
            className="flex items-center justify-between p-5 bg-white rounded-lg border border-slate-200 hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-primary">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{work.title}</h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-1">
                  {work.description ? work.description : "No description provided"}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 text-sm text-slate-500">
              {work.dueDate && (
                <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  <Calendar size={14} />
                  <span>Due: {work.dueDate.month}/{work.dueDate.day}</span>
                </div>
              )}
              <span className="text-primary font-medium">Solve &rarr;</span>
            </div>
          </Link>
        ))}

        {assignments?.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">No pending assignments found! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseView;
