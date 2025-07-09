
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { TimeEntry, Discipline, FormDiscipline, Level, Activity } from './types';
import TimeInputForm from './components/TimeInputForm';
import TimeLogTable from './components/TimeLogTable';
import FilterBar from './components/FilterBar';
import Dashboard from './components/Dashboard';
import Tabs from './components/Tabs';

type ActiveTab = '대시보드' | '업무시간 기록';

const App: React.FC = () => {
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
        try {
            const savedEntries = localStorage.getItem('timeEntries');
            if (savedEntries) {
                return JSON.parse(savedEntries);
            }
        } catch (e) {
            console.error("Could not load time entries from local storage", e);
        }
        return [
            {
                id: 'demo1',
                name: '김철수',
                level: Level.SENIOR,
                projectName: '판교 데이터센터',
                discipline: FormDiscipline.ARCHITECTURE,
                activity: Activity.MODELING,
                subActivity: '2-01. Modeling 작업',
                role: 'BIM 모델러',
                hours: 8,
                date: new Date().toLocaleDateString('ko-KR')
            },
            {
                id: 'demo2',
                name: '이영희',
                level: Level.MID,
                projectName: '부산 스마트시티',
                discipline: FormDiscipline.MEP,
                activity: Activity.REVIEW_ANALYSIS,
                subActivity: '1-01. 도면 검토/분석',
                role: '설비 엔지니어',
                hours: 6.5,
                date: new Date(Date.now() - 86400000).toLocaleDateString('ko-KR')
            },
            {
                id: 'demo3',
                name: '박진우',
                level: Level.JUNIOR,
                projectName: '판교 데이터센터',
                discipline: FormDiscipline.ELECTRICAL,
                activity: Activity.BCMS,
                subActivity: '3-01. 속성 표준화',
                role: '전기 모델러',
                hours: 7,
                date: new Date(Date.now() - 86400000).toLocaleDateString('ko-KR')
            }
        ];
    });
    
    const [activeTab, setActiveTab] = useState<ActiveTab>('대시보드');
    const TABS: ActiveTab[] = ['대시보드', '업무시간 기록'];

    useEffect(() => {
        try {
            localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
        } catch (e) {
            console.error("Could not save time entries to local storage", e);
        }
    }, [timeEntries]);

    const [filter, setFilter] = useState<Discipline>(Discipline.ALL);
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editingEntryId && activeTab === '업무시간 기록') {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [editingEntryId, activeTab]);

    const editingEntry = useMemo(() => {
        if (!editingEntryId) return null;
        return timeEntries.find(entry => entry.id === editingEntryId) || null;
    }, [timeEntries, editingEntryId]);
    
    const handleSaveEntry = useCallback((entryData: Omit<TimeEntry, 'id' | 'date'>, id: string | null) => {
        if (id) {
            setTimeEntries(prevEntries =>
                prevEntries.map(entry =>
                    entry.id === id ? { ...entry, ...entryData, date: new Date().toLocaleDateString('ko-KR') } : entry
                )
            );
        } else {
            const newEntry: TimeEntry = {
                ...entryData,
                id: new Date().toISOString() + Math.random(),
                date: new Date().toLocaleDateString('ko-KR'),
            };
            setTimeEntries(prevEntries => [newEntry, ...prevEntries]);
        }
        setEditingEntryId(null);
    }, []);

    const handleDeleteEntry = useCallback((id: string) => {
        if (window.confirm('이 기록을 정말로 삭제하시겠습니까?')) {
            setTimeEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
            if (id === editingEntryId) {
                setEditingEntryId(null);
            }
        }
    }, [editingEntryId]);

    const handleStartEdit = useCallback((id: string) => {
        setActiveTab('업무시간 기록');
        setEditingEntryId(id);
    }, []);

    const handleCancelEdit = useCallback(() => {
        setEditingEntryId(null);
    }, []);


    const filteredEntries = useMemo(() => {
        if (filter === Discipline.ALL) {
            return timeEntries;  
        }
        return timeEntries.filter(entry => entry.discipline === (filter as unknown as FormDiscipline));
    }, [timeEntries, filter]);


    return (
        <div className="bg-slate-100 min-h-screen font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-screen-xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">AnD.PLUS 업무 투입시간 분석</h1>
                    <p className="mt-1 text-md text-gray-600">프로젝트별 투입 시간을 효율적으로 관리하고 분석하세요.</p>
                </div>
            </header>
            <main>
                <div className="max-w-screen-xl mx-auto py-8 sm:px-6 lg:px-8">
                    <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
                    
                    {activeTab === '대시보드' && <Dashboard entries={timeEntries} />}

                    {activeTab === '업무시간 기록' && (
                        <>
                           <div ref={formRef}>
                               <TimeInputForm
                                   onSave={handleSaveEntry}
                                   editingEntry={editingEntry}
                                   onCancelEdit={handleCancelEdit}
                               />
                            </div>
                            <FilterBar selectedFilter={filter} onFilterChange={setFilter} />
                            <TimeLogTable 
                                entries={filteredEntries} 
                                onEdit={handleStartEdit}
                                onDelete={handleDeleteEntry}
                            />
                        </>
                    )}
                </div>
            </main>
            <footer className="py-6">
                <div className="text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} AnD.PLUS 업무 투입시간 분석. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default App;
