export interface Project {
    id: number;
    project_id: string;
    name: string;
    description?: string | null;
    image_preview_url?: string[];
    tech_stacks?: string[];
    other_stacks?: string[];
    live_url?: string;
    repo_url?: string | null;
    employed?: number; //0 or 1
    is_solo?: number; //0 or 1
    is_featured?: number; //0 or 1
    completed_at: string;
}



export interface ProjectFilter {
    page?: number;
    limit: number;
    cursorId?: number;
    cursorCreatedAt?: string;
    order?: "newest" | "oldest";
}