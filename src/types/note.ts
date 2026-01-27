export interface Note {
    id: string;
    user_id: string;
    title: string;
    content: string;
    tags: string[];
    linked_task_id?: string;
    linked_job_role?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateNoteData {
    title: string;
    content: string;
    tags?: string[];
    linked_task_id?: string;
    linked_job_role?: string;
}

export interface UpdateNoteData extends Partial<CreateNoteData> { }
