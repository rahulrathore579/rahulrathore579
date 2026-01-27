export interface Task {
    id: string;
    user_id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    status: 'pending' | 'in_progress' | 'completed';
    created_at: string;
    updated_at: string;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    due_date?: string;
    status?: 'pending' | 'in_progress' | 'completed';
}

export interface UpdateTaskData extends Partial<CreateTaskData> { }
