import { getAuthenticatedEmployeeProfile } from "./empleados";

export default async function getBasicUser(token) {
    try {
        return await getAuthenticatedEmployeeProfile(token);
    } catch {
        return null;
    }
}
