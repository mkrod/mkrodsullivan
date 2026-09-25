import { serverRequest } from "../variables/global.vars"


export const sendContactMessage = async (data: any) => {
    return serverRequest("put", "/contact/", data, "json", "json");
}