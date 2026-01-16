import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { aiService, classroomService } from '../services/api';
import { BrainCircuit, BookOpen, CheckCircle, Loader2, Sparkles } from 'lucide-react';

const AssignmentSolver = () => {
  const { courseId, assignmentId } = useParams();
  const [studyMode, setStudyMode] = useState(false);

  // 1. Fetch Assignment Details (Title, Description)
  const { data: assignment } = useQuery({
    queryKey: ['assignment', assignmentId],
    queryFn: async () => {
      const res = await classroomService.getAssignmentDetails(courseId, assignmentId);
      return res.data;
    }
  });

  // 2. Setup AI Mutation (The Action)
  const aiMutation = useMutation({
    mutationFn: (data) => aiService.solveAssignment(data),
  });

  const handleSolve = () => {
    aiMutation.mutate({
      courseId,
      assignmentId,
      studyMode
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
      
      {/* LEFT SIDE: Assignment Details */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          {assignment?.title || 'Loading Assignment...'}
        </h2>
        
        <div className="prose prose-slate max-w-none">
          <p className="whitespace-pre-wrap text-slate-600">
            {assignment?.description || 'No description available.'}
          </p>
        </div>

        {/* Controls */}
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${studyMode ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {studyMode ? <BookOpen size={24} /> : <CheckCircle size={24} />}
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {studyMode ? "Study Mode" : "Direct Answer Mode"}
                </p>
                <p className="text-xs text-slate-500">
                  {studyMode ? "Generate a guide to help me learn." : "Generate the direct solution."}
                </p>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <button 
              onClick={() => setStudyMode(!studyMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${studyMode ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${studyMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <button
            onClick={handleSolve}
            disabled={aiMutation.isPending}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2"
          >
            {aiMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Thinking (This takes ~15s)...
              </>
            ) : (
              <>
                <Sparkles />
                Generate Solution
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: AI Output */}
      <div className="bg-slate-900 text-slate-100 p-8 rounded-xl shadow-inner overflow-y-auto border border-slate-800">
        {!aiMutation.data ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
            <BrainCircuit size={64} className="mb-4" />
            <p>Ready to solve.</p>
          </div>
        ) : (
          <div className="prose prose-invert prose-blue max-w-none">
            <ReactMarkdown>
              {aiMutation.data.data.data}
            </ReactMarkdown>
          </div>
        )}
      </div>

    </div>
  );
};

export default AssignmentSolver;
                
