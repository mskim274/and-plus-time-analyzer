import React from 'react';
import { TimeEntry } from '../types';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';

interface TimeLogTableProps {
  entries: TimeEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentUserId: string;
}

const TimeLogTable: React.FC<TimeLogTableProps> = ({ entries, onEdit, onDelete, currentUserId }) => {
    if (entries.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center text-gray-500">
                <h3 className="text-xl font-semibold mb-2">기록된 데이터가 없습니다.</h3>
                <p>업무 시간을 기록하여 분석을 시작하세요.</p>
            </div>
        );
    }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">이름</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Lv.</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">PJT명</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">공종(S)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Activity</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sub-Activity</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">시간(h)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">기록일</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">작업</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.authorName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.level}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={entry.projectName}>{entry.projectName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.discipline}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={entry.activity}>{entry.activity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={entry.subActivity}>{entry.subActivity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold text-right">{entry.hours.toFixed(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(entry.date).toLocaleDateString('ko-KR')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium" style={{ minWidth: '100px' }}>
                          {entry.userId === currentUserId ? (
                            <>
                              <button
                                  type="button"
                                  onClick={() => onEdit(entry.id)}
                                  className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100 transition-all"
                                  aria-label={`'${entry.projectName}' 항목 수정`}
                              >
                                  <PencilIcon className="w-5 h-5" />
                              </button>
                              <button
                                  type="button"
                                  onClick={() => onDelete(entry.id)}
                                  className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-all ml-2"
                                  aria-label={`'${entry.projectName}' 항목 삭제`}
                              >
                                  <TrashIcon className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">읽기전용</span>
                          )}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default TimeLogTable;
