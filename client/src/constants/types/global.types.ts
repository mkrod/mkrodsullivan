import { ReactNode, type CSSProperties } from 'react'

export interface colorScheme {
    background: CSSProperties['background']
    backgroundSecondary: CSSProperties['background']
    backgroundFade: CSSProperties['background']

    text: CSSProperties['color']
    textFade: CSSProperties['color']
    textFadeSecondary: CSSProperties['color']

    accent: CSSProperties['color']
    accentSec: CSSProperties['color']
    accentFeint: CSSProperties['color']

    border: CSSProperties['borderColor']
    borderFade: CSSProperties['borderColor']
}



export type Scheme = "dark" | "light";


export interface Note {
    type: "success" | "error" | "warning";
    title: string;
    body?: string;
}

export interface Snack {
    message: string;
}

export interface Prompt {
    title: string;
    description?: string;
    onAccept: () => void;
    onDecline?: () => void;
}

export interface Response<T = any> {
    status: number | undefined;
    success?: boolean;
    message?: string;
    data?: T;
    error?: {
        message: string;
        status?: number;
    };
}

export interface NavLink {
    label: string;
    path: string;
    icon?: React.ReactElement;
    children?: NavLink[];
}


export interface APIArrayResponse<T = any[]> {
    page: string;
    perPage: string;
    totalResult: string;
    hasNext: boolean;
    results: T;
}

export interface DefaultRes<T = any> {
    hasNext: boolean;
    nextCursor: { createdAt: string, id: string } | undefined;
    perPage: number | undefined;
    results: T[];
    page: number;
    totalResult?: number;
}


export interface MyServices {
    name: string;
    icon: ReactNode;
    desc?: string;
}

export interface SkillSet {
    name: string;
    icon: ReactNode;
}



export interface PaginationCursor {
    cursorCreatedAt: string | null | undefined;
    cursorId: string | null | undefined;
}

export interface ChunkedResponse<T = any> {
    perPage: number,
    page: number,
    totalResult: number,
    hasNext: boolean,
    nextCursor: PaginationCursor | undefined;
    results: T[];
}