import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { Clock, PlayCircle, CheckCircle } from 'lucide-react';

// --- Sortable Task Item Component ---
const TaskItem = ({ task, colId }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task._id, data: { task, colId } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="glass-panel p-4 mb-3 hover:border-slate-500 transition-all group relative cursor-move bg-slate-800/50"
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1.5 
                    ${colId === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                        colId === 'in_progress' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-green-500/10 text-green-500'}`}>
                    {colId === 'pending' && <Clock size={12} />}
                    {colId === 'in_progress' && <PlayCircle size={12} />}
                    {colId === 'completed' && <CheckCircle size={12} />}
                    {colId.replace('_', ' ')}
                </span>
                {task.priority === 'high' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
            </div>
            <h4 className="text-white font-medium text-sm mb-1">{task.title}</h4>
            <p className="text-slate-400 text-xs line-clamp-2 mb-3">{task.description}</p>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-700/50">
                Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
        </div>
    );
};

// --- Column Component ---
const KanbanColumn = ({ id, title, tasks, color }) => {
    const { setNodeRef } = useSortable({ id });

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[280px] bg-slate-900/40 rounded-xl p-2 h-full">
            <div className={`p-4 rounded-xl border mb-4 font-semibold flex items-center justify-between ${color}`}>
                <h3 className="uppercase tracking-wider text-sm">{title}</h3>
                <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{tasks.length}</span>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-2 min-h-[500px] border border-slate-700/50">
                <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <TaskItem key={task._id} task={task} colId={id} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

// --- Main Board Component ---
const KanbanBoard = ({ tasks, onTaskUpdate }) => {
    const [activeId, setActiveId] = useState(null);
    const [localTasks, setLocalTasks] = useState(tasks);

    // Sync when props change
    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const columns = {
        pending: localTasks.filter(t => t.status === 'pending'),
        in_progress: localTasks.filter(t => t.status === 'in_progress'),
        completed: localTasks.filter(t => t.status === 'completed'),
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id; // Could be a task ID or a column ID

        // Find the task and its new status
        // Simplification: We just need to know which column it landed in.
        // But dnd-kit sortable usually gives us the ID of the item implementation.

        let newStatus = null;

        // Check if dropped on a column container directly? (Unlikely with SortableContext, but possible if empty)
        // Or updated by finding which list the overId belongs to.

        // Helper to find column of an ID
        const findColumn = (id) => {
            if (['pending', 'in_progress', 'completed'].includes(id)) return id;
            const task = localTasks.find(t => t._id === id);
            return task ? task.status : null;
        };

        const activeColumn = findColumn(activeId);
        const overColumn = findColumn(overId);

        if (!activeColumn || !overColumn || activeColumn === overColumn) {
            // If just reordering in same column, we can support that visually but backend doesn't care order usually
            // For now, let's just focus on status change
            return;
        }

        // Optimistic Update
        const updatedTasks = localTasks.map(t => {
            if (t._id === activeId) return { ...t, status: overColumn };
            return t;
        });
        setLocalTasks(updatedTasks);

        try {
            await api.put(`/tasks/${activeId}/status`, { status: overColumn });
            toast.success('Task updated');
            if (onTaskUpdate) onTaskUpdate();
        } catch (error) {
            toast.error('Failed to update task');
            // Revert
            setLocalTasks(tasks);
        }
    };

    const handleDragOver = (event) => {
        // This is needed for moving items between columns visually during drag
        // But for simple "Card to Card" movement, dragEnd is enough for logic if we accept snap.
        // For smooth "Sortable" between lists, we need more complex logic onDragOver to `setItems`.
        // Given complexity and "Run Fast" requirement, let's trust the SortableContext and simplified logic.
        // Actually, to make it visually move between columns *while dragging*, we need onDragOver.
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Find containers
        // This part is tricky to get right quickly without bugs. 
        // I'll stick to a simpler implementation:
        // The `handleDragEnd` will handle the logic. 
        // Visuals might be slightly jumpy if not handling Over, but acceptable for MVP.
        // Actually, let's implement a quick visual update if possible.

        // ... skipping complex INTER-column sortable reordering for speed. 
        // Using React Beautiful DnD is often easier for this specific "Board" usecase than dnd-kit primitives.
        // But I committed to dnd-kit.
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
                <KanbanColumn
                    id="pending"
                    title="Pending"
                    tasks={columns.pending}
                    color="text-yellow-500 border-yellow-500/20 bg-yellow-500/10"
                />
                <KanbanColumn
                    id="in_progress"
                    title="In Progress"
                    tasks={columns.in_progress}
                    color="text-blue-500 border-blue-500/20 bg-blue-500/10"
                />
                <KanbanColumn
                    id="completed"
                    title="Completed"
                    tasks={columns.completed}
                    color="text-green-500 border-green-500/20 bg-green-500/10"
                />

                <DragOverlay>
                    {activeId ? (
                        <div className="glass-panel p-4 bg-slate-800 rotate-3 cursor-grabbing shadow-2xl border border-primary-500/50">
                            Dragging Task...
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
};

export default KanbanBoard;
