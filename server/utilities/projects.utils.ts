import type { Project } from "@/types/project.type.js";

export const parseProject = (p: Project): Project => {

    return {
        ...p,
        image_preview_url: typeof p.image_preview_url === 'string' ? JSON.parse(p.image_preview_url) : p.image_preview_url,
        tech_stacks: typeof p.tech_stacks === 'string' ? JSON.parse(p.tech_stacks) : p.tech_stacks,
        other_stacks: typeof p.other_stacks === 'string' ? JSON.parse(p.other_stacks) : p.other_stacks
    }
}