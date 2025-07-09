import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { TimeEntry, Level, FormDiscipline, Activity } from '../types';
import { SUB_ACTIVITY_MAP, LEVEL_OPTIONS, DISCIPLINE_OPTIONS, ACTIVITY_OPTIONS } from '../constants';
import PlusIcon from './icons/PlusIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import PencilIcon from './icons/PencilIcon';

interface TimeInputFormProps {
  user: User;
  onSave: (entry: Omit<TimeEntry, 'id' | 'date' | 'userId' | 'authorName'>, id: string | null) => void;
  editingEntry: TimeEntry | null;
  onCancelEdit: () => void;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed" />
    </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, children: React.ReactNode }> = ({ label, children, ...props }) => (
    <div className="relative">
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select {...props} className="appearance-none w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow text-gray-900">
            {children}
        </select>
        <ChevronDownIcon className="absolute right-3 top-9 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
);


const TimeInputForm: React.FC<TimeInputFormProps> = ({ user, onSave, editingEntry, onCancelEdit }) => {
  const [name, setName] = useState(user.displayName || '');
  const [level, setLevel] = useState<Level>(Level.JUNIOR);
  const [projectName, setProjectName] = useState('');
  const [discipline, setDiscipline] = useState<FormDiscipline>(FormDiscipline.ARCHITECTURE);
  const [activity, setActivity] = useState<Activity>(Activity.REVIEW_ANALYSIS);
  const [subActivity, setSubActivity] = useState<string>('');
  const [role, setRole] = useState('');
  const [hours, setHours] = useState<number | ''>('');
  const [subActivityOptions, setSubActivityOptions] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const isEditing = !!editingEntry;

  const clearForm = useCallback(() => {
    // Keep the name field populated with the logged-in user's name
    setLevel(Level.JUNIOR);
    setProjectName('');
    setDiscipline(FormDiscipline.ARCHITECTURE);
    setActivity(Activity.REVIEW_ANALYSIS);
    setRole('');
    setHours('');
    setError('');
  }, []);

  useEffect(() => {
    if (editingEntry) {
      setName(editingEntry.name); // Keep author name consistent on edit
      setLevel(editingEntry.level);
      setProjectName(editingEntry.projectName);
      setDiscipline(editingEntry.discipline);
      setActivity(editingEntry.activity);
      setSubActivity(editingEntry.subActivity);
      setRole(editingEntry.role);
      setHours(editingEntry.hours);
    } else {
      clearForm();
      setName(user.displayName || '');
    }
  }, [editingEntry, clearForm, user.displayName]);


  useEffect(() => {
    const options = SUB_ACTIVITY_MAP[activity] || [];
    setSubActivityOptions(options);
    if (options.length > 0) {
      if (!isEditing || !options.includes(subActivity)) {
         setSubActivity(options[0]);
      }
    } else {
      setSubActivity('');
    }
  }, [activity, isEditing, subActivity]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !projectName.trim() || !activity || !subActivity || !role.trim() || hours === '' || hours <= 0) {
      setError('모든 필드를 올바르게 입력해주세요.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    onSave({
      name,
      level,
      projectName,
      discipline,
      activity,
      subActivity,
      role,
      hours: Number(hours),
    }, editingEntry ? editingEntry.id : null);
    
    if(!isEditing) {
        clearForm();
    }

  }, [name, level, projectName, discipline, activity, subActivity, role, hours, onSave, editingEntry, isEditing, clearForm]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditing ? '기록 수정' : '업무 시간 기록'}</h2>
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InputField id="name" label="이름" type="text" value={name} onChange={() => {}} placeholder="로그인 필요" required readOnly disabled />
                <SelectField id="level" label="Lv." value={level} onChange={(e) => setLevel(e.target.value as Level)}>
                    {LEVEL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </SelectField>
                <InputField id="projectName" label="PJT명" type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="강남 빌딩 프로젝트" required />
                <SelectField id="discipline" label="공종(S)" value={discipline} onChange={(e) => setDiscipline(e.target.value as FormDiscipline)}>
                    {DISCIPLINE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </SelectField>
                <SelectField id="activity" label="Activity" value={activity} onChange={(e) => setActivity(e.target.value as Activity)}>
                    {ACTIVITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </SelectField>
                <SelectField id="subActivity" label="Sub-Activity" value={subActivity} onChange={(e) => setSubActivity(e.target.value)} disabled={subActivityOptions.length === 0}>
                   {subActivityOptions.length > 0 ? (
                       subActivityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
                   ) : (
                       <option>Activity를 먼저 선택하세요</option>
                   )}
                </SelectField>
                <InputField id="role" label="Role" type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="모델러" required />
                <InputField id="hours" label="작업 시간 (h)" type="number" value={hours} onChange={(e) => setHours(e.target.value === '' ? '' : Number(e.target.value))} placeholder="8" min="0.1" step="0.1" required />
            </div>

            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

            <div className="mt-8 flex justify-end items-center gap-4">
                {isEditing && (
                    <button 
                        type="button" 
                        onClick={onCancelEdit}
                        className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                    >
                        취소
                    </button>
                )}
                <button type="submit" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105">
                    {isEditing ? (
                        <>
                            <PencilIcon className="w-5 h-5 mr-2" />
                            기록 수정
                        </>
                    ) : (
                        <>
                            <PlusIcon className="w-5 h-5 mr-2" />
                            기록 추가
                        </>
                    )}
                </button>
            </div>
        </form>
    </div>
  );
};

export default TimeInputForm;
