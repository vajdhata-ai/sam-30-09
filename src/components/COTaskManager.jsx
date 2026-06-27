import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, where } from 'firebase/firestore';
import { ClipboardList, Plus, Clock, CheckCircle, AlertTriangle, Users, Trash2, Calendar } from './Icons';
import { useAuth } from '../contexts/AuthContext';

const COTaskManager = () => {
    const { userProfile } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('Active'); // All, Active, Completed, Overdue
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        assignedTo: 'All Cadets'
    });

    useEffect(() => {
        if (!userProfile) return;
        const q = query(
            collection(db, 'tasks'),
            where('wing', '==', userProfile.wing || 'army')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            data.sort((a, b) => {
                const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                return tB - tA;
            });
            
            setTasks(data);
        }, (error) => {
            console.error("Tasks fetch error:", error);
        });
        return () => unsubscribe();
    }, []);

    const filteredTasks = tasks.filter(t => {
        const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed';
        
        if (filter === 'Active') return t.status !== 'Completed' && !isOverdue;
        if (filter === 'Completed') return t.status === 'Completed';
        if (filter === 'Overdue') return isOverdue;
        return true;
    });

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        try {
            await addDoc(collection(db, 'tasks'), {
                ...formData,
                status: 'Active',
                completedCount: 0,
                wing: userProfile?.wing || 'army',
                battalion: userProfile?.battalion || '1st Battalion',
                createdAt: serverTimestamp()
            });
            setIsCreating(false);
            setFormData({ title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: 'All Cadets' });
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Failed to create task.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await deleteDoc(doc(db, 'tasks', id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'Urgent': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'Medium': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'Low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
            <div className="max-w-5xl mx-auto w-full h-full flex flex-col space-y-6 min-h-0">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
                    <div>
                        <h1 className="text-2xl font-black text-theme-text flex items-center gap-2">
                            <ClipboardList className="w-6 h-6 text-theme-primary" /> Task Manager
                        </h1>
                        <p className="text-sm text-theme-muted mt-1">Assign and track daily objectives for cadets</p>
                    </div>
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2.5 bg-theme-primary text-theme-bg rounded-xl text-sm font-bold shadow-md shadow-theme-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> New Task
                    </button>
                </div>

                {/* Create Task Modal */}
                {isCreating && (
                    <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 flex-shrink-0 animate-fade-in-down shadow-2xl relative z-20">
                        <button onClick={() => setIsCreating(false)} className="absolute top-4 right-4 text-theme-muted hover:text-theme-text">✕</button>
                        <h2 className="text-lg font-bold text-theme-text mb-6">Create New Objective</h2>
                        
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="text-[10px] text-theme-muted uppercase tracking-widest font-bold mb-1.5 block">Task Title</label>
                                <input 
                                    type="text" required
                                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g., Morning PT Assembly, Mess Hall Duty"
                                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:border-theme-primary/50 outline-none"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-theme-muted uppercase tracking-widest font-bold mb-1.5 block">Priority</label>
                                    <select 
                                        value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}
                                        className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:border-theme-primary/50 outline-none appearance-none"
                                    >
                                        <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-theme-muted uppercase tracking-widest font-bold mb-1.5 block">Due Date (Optional)</label>
                                    <input 
                                        type="date"
                                        value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})}
                                        className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:border-theme-primary/50 outline-none"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-[10px] text-theme-muted uppercase tracking-widest font-bold mb-1.5 block">Description</label>
                                <textarea 
                                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                                    placeholder="Add specific instructions..."
                                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:border-theme-primary/50 outline-none h-24 resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-theme-muted hover:bg-white/5 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-theme-primary text-theme-bg rounded-xl text-sm font-bold hover:opacity-90 transition-colors">
                                    Issue Task
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Filters & List */}
                <div className="flex-1 flex flex-col bg-theme-surface border border-theme-border rounded-3xl min-h-0">
                    
                    <div className="p-4 border-b border-theme-border flex items-center gap-2 overflow-x-auto custom-scrollbar flex-shrink-0">
                        {['All', 'Active', 'Completed', 'Overdue'].map(f => (
                            <button
                                key={f} onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border whitespace-nowrap
                                    ${filter === f 
                                        ? 'bg-theme-primary/20 text-theme-primary border-theme-primary/30' 
                                        : 'bg-theme-bg text-theme-muted border-theme-border hover:bg-white/5'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                        {filteredTasks.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                <ClipboardList className="w-12 h-12 text-theme-muted mb-3 opacity-50" />
                                <p className="text-theme-muted font-medium">No tasks found in this category</p>
                            </div>
                        ) : (
                            filteredTasks.map(task => {
                                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
                                return (
                                    <div key={task.id} className="p-5 rounded-2xl bg-theme-bg border border-transparent hover:border-theme-border transition-colors group">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                    {isOverdue && <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border text-red-500 bg-red-500/10 border-red-500/20 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Overdue</span>}
                                                    {task.status === 'Completed' && <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border text-theme-primary bg-theme-primary/10 border-theme-primary/20 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Done</span>}
                                                </div>
                                                <h3 className="text-base font-bold text-theme-text mb-1">{task.title}</h3>
                                                {task.description && <p className="text-sm text-theme-muted mb-3">{task.description}</p>}
                                                
                                                <div className="flex flex-wrap items-center gap-4 text-xs text-theme-muted font-medium">
                                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {task.assignedTo}</span>
                                                    {task.dueDate && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                                <div className="text-center bg-theme-surface px-3 py-1.5 rounded-lg border border-theme-border">
                                                    <span className="block text-[10px] uppercase tracking-widest text-theme-muted font-bold">Completions</span>
                                                    <span className="text-sm font-black text-theme-text">{task.completedCount || 0}</span>
                                                </div>
                                                <button 
                                                    onClick={() => handleDelete(task.id)}
                                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete Task"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default COTaskManager;
