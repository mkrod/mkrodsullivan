export interface JwtTokenPayload {
    user_id: string;
    email?: string;
    role: "admin" | "user";
}

export interface UserData {
    [key: string]: any; // Dynamic fields for user data
}


export interface User {
    id: number;
    user_id: string;
    name: {
        first: string;
        last: string;
    };
    username?: string;
    avatar?: string;
    permission: string;
    email: string;
    newsletter?: number; //from mysql 1 or 0
    role: JwtTokenPayload['role'];
    verified: number; //from mysql 1 or 0
    password: string;
    user_data: UserData;
    created_at: Date;
}

export type SubPackage = "pro" | "enterprise" | "basic";

export interface UsersFilter {
    searchTerm: string;
    page: number;
    limit: number;
    role: "admin" | "users";
    order: "newest" | "oldest";
    sub: SubPackage;
    cursorCreatedAt: string;
    cursorId: string;
}

export interface Permission {
    post: string;
}


export interface Presence {
    id: number;
    user_id: string;
    socket_id: string;
    status: "online" | "away" | "offline";
    last_login: Date;
    last_seen: Date | null;
}
