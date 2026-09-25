import { ProjectFilter } from "../types/project.type";
import { serverRequest } from "../variables/global.vars";



export const getProjects = async (filter?: ProjectFilter) => {
    return serverRequest("get", "/projects", filter);
}