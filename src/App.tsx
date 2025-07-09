import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy, where } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './hooks/useAuth';
import { TimeEntry, Discipline, FormDiscipline } from './types';
import TimeInputForm from './components/TimeInputForm';
import TimeLogTable from './components/TimeLogTable';
import FilterBar from './components/FilterBar';
import Dashboard from './components/Dashboard';
import Tabs from './components/Tabs';
import Spinner from './components/Spinner';
import Login from './components/Login';
import Header from './components/Header';

type ActiveTab = '대시보드' | '업무시간 기록';

const App: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [activeTab, setActiveTab] = useState<ActiveTab>('대시보드');
    const TABS: ActiveTab[] = ['대시보드', '업무시간 기록'];

    useEffect(() => {
        if (!user) {
            setTimeEntries([]);
            setLoadingData(false);
            return;
        }

        setLoadingData(true);
        const timeEntriesCollectionRef = collection(db, "time-entries");
        const q = query(timeEntriesCollectionRef, where("userId", "==", user.uid), orderBy("date", "desc"));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const entriesData = querySnapshot.docs.map(doc => ({
                ...doc.data() as Omit<TimeEntry, 'id'>,
                id: doc.id,
            }));
            setTimeEntries(entriesData);
            setLoadingData(false);
        }, (error) => {
            console.error("Error fetching time entries: ", error);
            setLoadingData(false);
        });

        return () => unsubscribe();
    }, [user]);

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

    const handleSaveEntry = useCallback(async (entryData: Omit<TimeEntry, 'id' | 'date' | 'userId' | 'authorName'>, id: string | null) => {
        if (!user) return;
        
        try {
            const dataToSave = {
                ...entryData,
                userId: user.uid,
                authorName: user.displayName || 'Unknown User',
                date: new Date().toISOString(),
            };

            if (id) {
                const entryDoc = doc(db, "time-entries", id);
                await updateDoc(entryDoc, dataToSave);
            } else {
                const timeEntriesCollectionRef = collection(db, "time-entries");
                await addDoc(timeEntriesCollectionRef, dataToSave);
            }
        } catch(e) {
            console.error("Error saving entry: ", e);
            alert("데이터 저장 중 오류가 발생했습니다.");
        }
        
        setEditingEntryId(null);
    }, [user]);

    const handleDeleteEntry = useCallback(async (id: string) => {
        if (window.confirm('이 기록을 정말로 삭제하시겠습니까?')) {
            try {
                const entryDoc = doc(db, "time-entries", id);
                await deleteDoc(entryDoc);
                if (id === editingEntryId) {
                    setEditingEntryId(null);
                }
            } catch(e) {
                console.error("Error deleting entry: ", e);
                alert("데이터 삭제 중 오류가 발생했습니다. 본인이 작성한 기록만 삭제할 수 있습니다.");
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

    if (authLoading) {
        return <div className="flex justify-center items-center h-screen bg-slate-100"><Spinner /></div>;
    }

    if (!user) {
        return <Login />;
    }

    const renderContent = () => {
        if (loadingData) {
            return <div className="flex justify-center items-center h-64"><Spinner /></div>;
        }
        
        if (activeTab === '대시보드') {
            return <Dashboard entries={timeEntries} />;
        }
        
        if (activeTab === '업무시간 기록') {
            return (
                <>
                   <div ref={formRef}>
                       <TimeInputForm
                           user={user}
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
                        currentUserId={user.uid}
                    />
                </>
            );
        }
        return null;
    }

    return (
        <div className="bg-slate-100 min-h-screen font-sans">
            <Header user={user} />
            <main>
                <div className="max-w-screen-xl mx-auto py-8 sm:px-6 lg:px-8">
                    <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
                    {renderContent()}
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
