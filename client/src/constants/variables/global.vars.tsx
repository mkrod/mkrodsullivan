import { HiCode } from "react-icons/hi";
import type { ChunkedResponse, colorScheme, MyServices, NavLink, Response, SkillSet } from "../types/global.types";
import { IoAppsSharp, IoColorPalette, IoLogoCss3, IoLogoJavascript } from "react-icons/io5";
import { FaGears, FaGitAlt } from "react-icons/fa6";
import { RiBook3Fill } from "react-icons/ri";
import { VscSearchSparkle } from "react-icons/vsc";
import { AiFillHtml5 } from "react-icons/ai";
import { SiMongodb, SiTypescript } from "react-icons/si";
import { TbBrandMysql, TbBrandNodejs, TbBrandReact, TbTruckLoading } from "react-icons/tb";
import { MdOutlineHttps, MdSupportAgent } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { LuUserPen } from "react-icons/lu";
import { GoProject } from "react-icons/go";
import { IoIosAppstore } from "react-icons/io";
import { createTheme } from "@mui/material";


//meta
export const siteName = "MkRoD SuLLivan";
export const siteURL = "www.mkrodsullivan.com.ng";
export const siteDescription = "";
export const siteKeyWord = "mkrodsullivan, mkrod, mk tech ltd, mktechltd, mk technology limited, mkrodsullivan technology limited";


export const appLogo: string = "/favicon.png";
export const appLogoText = "/logo+text.svg";
export const defaultDp: string = "/isolated-layout.svg";
export const ogImage: string = '/favicon.png'

export const iconBadge: string = '/icon_badge.jpeg'

export const defaultContentDt = "/advert_img.webp";

export const server = process.env.NEXT_PUBLIC_SERVER_URL; //"https://192.168.43.150";

//server
export const serverPort = process.env.NEXT_PUBLIC_SERVER_PORT ?? ":3500"; //":3500";
export const serverNamespace = process.env.NEXT_PUBLIC_SERVER_NAMESPACE ?? "/api"; //"/api";
export const serverURL = `${server}${serverPort}${serverNamespace}`.trim();



//client
export const clientPort = process.env.NEXT_PUBLIC_CLIENT_PORT ?? ":5190";
export const clientNamespace = process.env.NEXT_PUBLIC_CLIENT_NAMESPACE ?? "";
export const clientURL = `${server}${clientPort}${clientNamespace}`.trim();



export const adminURL = process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin.naijailoaded.com.ng"
//cookie analytics
export const googleAnalyticsID = "G-8KKXVF25ZF";
export const googleAdsID = "";
export const facebookPixelID = "3452294181590573";


//Auth

export const googleClientID: string = `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`;
export const isProd: boolean = process.env.NEXT_PUBLIC_NODE_ENV === "production";
// export const googleRedirectURI: string = `${isProd ? serverURL : "https://localhost:3500" + serverPort + serverNamespace}${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_ROUTE}`//process.env.NEXT_PUBLIC_ //`https://localhost:3500`;
export const googleRedirectURI: string = `${serverURL}${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_ROUTE}`//process.env.NEXT_PUBLIC_ //`https://localhost:3500`;

//export const googleScope: string = "user_info"
export const googleSignInLink = `https://accounts.google.com/o/oauth2/auth?client_id=${googleClientID}&redirect_uri=${googleRedirectURI}&response_type=code&scope=openid+email+profile&include_granted_scopes=true&access_type=offline&prompt=consent`;


export const colors: Record<"light" | "dark", colorScheme> = {
    light: {
        background: '#ffffff',
        backgroundSecondary: '#ebebeb',
        backgroundFade: '#ffffffb8',

        text: '#171914',
        textFade: '#65685f',
        textFadeSecondary: '#8b8e85',

        accent: '#8da900',
        accentSec: '#a5bd18',
        accentFeint: '#9db51f2e',

        border: '#d9dcd2',
        borderFade: '#e8eae4',
    },

    dark: {
        background: '#000000',
        backgroundSecondary: '#0a0a0a',
        backgroundFade: '#0000009d',
        text: '#f1f1f1',
        accent: '#bacb3c',
        accentSec: '#bacb3c',
        accentFeint: '#93c50c74', //3
        textFade: '#c2c2c2',
        textFadeSecondary: '#a1a1a1',
        border: '#242424',
        borderFade: '#42424261'
        //borderFade: '#3a3a3a2a',
    },
}

export const applyCssVariables = (scheme: colorScheme) => {
    const root = document.documentElement

    root.style.setProperty('--bg', scheme.background as string)
    root.style.setProperty('--bg-sec', scheme.backgroundSecondary as string)
    root.style.setProperty('--bg-fade', scheme.backgroundFade as string)

    root.style.setProperty('--text', scheme.text as string)
    root.style.setProperty('--text-fade', scheme.textFade as string)
    root.style.setProperty('--text-sec', scheme.textFadeSecondary as string)

    root.style.setProperty('--accent', scheme.accent as string)
    root.style.setProperty('--accent-sec', scheme.accentSec as string)
    root.style.setProperty('--accent-feint', scheme.accentFeint as string)

    root.style.setProperty('--border', scheme.border as string)
    root.style.setProperty('--border-fade', scheme.borderFade as string)
}




export const serverRequest = async (method: "post" | "get" | "put" | "delete" | "patch", route: string, data?: any, type?: "json" | "form" | "formdata", responseType: "blob" | "json" = "json"): Promise<Response> => {
    const headers: HeadersInit = {};

    if (type === "json") {
        headers["Content-Type"] = "application/json";
    } else if (type === "form") {
        headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    // Don't set Content-Type for FormData
    //if (accessToken) {
    //    headers["Authorization"] = `Bearer ${accessToken}`;
    //}
    //if (refreshToken) {
    //    headers["x-refresh-token"] = refreshToken;
    // }

    const options: RequestInit = {
        method: method.toUpperCase(),
        headers,
        credentials: "include",
    };

    if (method === "post" || method === "put" || method === "delete" || method === "patch") {
        if (type === "json") {
            options.body = JSON.stringify({ ...data });
        } else if (type === "form") {
            options.body = new URLSearchParams({ ...data }).toString();
        } else if (type === "formdata") {
            options.body = data; // data is already a FormData instance
            // Do not set Content-Type manually
        }
    } else if (method === "get" && data) {
        route += `?${new URLSearchParams(data).toString()}`;
    }

    //console.log(`Request: ${options.method} ${serverURL}${route}`);

    const response = await fetch(`${serverURL}${route}`, options);
    // console.log("Response: ", response);
    if (!response.ok) {
        // console.log(response.statusText)
        let resp: any = undefined
        try {
            const read = await response.json();
            resp = read?.message;
        } catch (e) {
            resp = response.statusText;
        }
        throw new Error(resp);
    }

    let res;
    if (responseType === "blob") {
        res = response.blob();
    } else if (responseType === "json") {
        res = response.json()
    }

    return res;
};



export const serverRequestWithProgress = async (
    method: "post" | "get" | "put" | "delete" | "patch",
    route: string,
    data?: any,
    type?: "json" | "form" | "formdata",
    responseType: "blob" | "json" = "json",
    onProgress?: (percent: number) => void // New callback for progress
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        let url = `${serverURL}${route} `;

        // Handle GET params
        if (method === "get" && data) {
            url += `? ${new URLSearchParams(data).toString()} `;
        }

        xhr.open(method.toUpperCase(), url, true);

        xhr.timeout = 1200000;
        xhr.withCredentials = true;

        // Set Headers
        if (type === "json") {
            xhr.setRequestHeader("Content-Type", "application/json");
        } else if (type === "form") {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        // FormData headers are handled automatically by XHR

        // Progress Tracking (Upload)
        if (onProgress && xhr.upload) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    onProgress(percentComplete);
                }
            };
        }

        // Response Handling
        xhr.responseType = responseType;

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                // Emulating your error handling
                const errorResponse = xhr.response;
                reject(new Error(errorResponse?.message || xhr.statusText));
            }
        };

        // --- HANDLE TIMEOUT ERROR ---
        xhr.ontimeout = () => {
            reject(new Error("The request timed out. The processing took too long."));
        };

        xhr.onerror = () => reject(new Error("Network Error"));

        // Body Construction
        let body: any = null;
        if (method !== "get" && data) {
            if (type === "json") {
                body = JSON.stringify({ ...data });
            } else if (type === "form") {
                body = new URLSearchParams({ ...data }).toString();
            } else if (type === "formdata") {
                body = data; // FormData instance
            }
        }

        xhr.send(body);
    });
};


export const myServices: MyServices[] = [
    {
        name: 'Web Development',
        icon: (
            <HiCode
                size={30}
            />
        ),
        desc: 'Building an optimized and high performance web app for businesses.'
    },
    {
        name: 'App Development',
        icon: (
            <IoAppsSharp
                size={30}
            />
        ),
        desc: 'Building an optimized and high performance native mobile app for businesses.'
    },
    {
        name: 'Frontend Service',
        icon: (
            <IoColorPalette
                size={30}
            />
        ),
        desc: 'Available for Collaborations and independent endeavours on Frontend Projects.'
    },
    {
        name: 'Backend Service',
        icon: (
            <FaGears
                size={30}
            />
        ),
        desc: 'Available for Collaborations and independent endeavours on Backend Projects.'
    },
    {
        name: 'SEO',
        icon: (
            <VscSearchSparkle
                size={30}
            />
        ),
        desc: "Integrating seamlessly with search engines to enable flawless online presence."
    },
    {
        name: 'Tutoring',
        icon: (
            <RiBook3Fill
                size={30}
            />
        ),
        desc: "Impacting knowledge on others who are willing to learn."
    },
]



export const skillSet: SkillSet[] = [
    {
        name: "HTML",
        icon: (
            <AiFillHtml5
                size={24}
                color="#E34F26"
            />
        ),
    },
    {
        name: "CSS",
        icon: (
            <IoLogoCss3
                size={24}
                color="#1572B6"
            />
        ),
    },
    {
        name: "Javascript",
        icon: (
            <IoLogoJavascript
                size={24}
                color="#F7DF1E"
            />
        ),
    },
    {
        name: "Typescript",
        icon: (
            <SiTypescript
                size={24}
                color="#3178C6"
            />
        ),
    },
    {
        name: "React",
        icon: (
            <TbBrandReact
                size={24}
                color="#61DAFB"
            />
        ),
    },
    {
        name: "React Native",
        icon: (
            <TbBrandReact
                size={24}
                color="#61DAFB"
            />
        ),
    },
    {
        name: "Nodejs",
        icon: (
            <TbBrandNodejs
                size={24}
                color="#339933"
            />
        ),
    },
    {
        name: "SQL",
        icon: (
            <TbBrandMysql
                size={24}
                color="#00758F"
            />
        ),
    },
    {
        name: "MongoDB",
        icon: (
            <SiMongodb
                size={24}
                color="#00684A"
            />
        ),
    },
    {
        name: "Rest API",
        icon: (
            <MdOutlineHttps
                size={24}
                color="#009688"
            />
        )
    },
    {
        name: "Git",
        icon: (
            <FaGitAlt
                size={24}
                color="#F05032"
            />
        ),
    },
]

interface navProp {
    iconSize?: number;
    iconColor?: string;
    iconClassName?: string
}

export const navLinks = ({ iconSize = 20, iconColor, iconClassName }: navProp): NavLink[] => ([
    {
        label: "Home",
        path: "/",
        icon: (
            <FiHome
                size={iconSize}
                color={iconColor}
                className={iconClassName}
            />
        )
    },
    {
        label: "About",
        path: "/",
        icon: (
            <LuUserPen
                size={iconSize}
                color={iconColor}
                className={iconClassName}
            />
        )
    },
    {
        label: "Projects",
        path: "/#projects",
        icon: (
            <GoProject
                size={iconSize}
                color={iconColor}
                className={iconClassName}
            />
        ),
        children: [
            {
                label: "Preview",
                path: "/#projects",
            },
            {
                label: "All",
                path: "/projects",
            }
        ]
    },
    {
        label: "Contact",
        path: "/#contact",
        icon: (
            <MdSupportAgent
                size={iconSize}
                color={iconColor}
                className={iconClassName}
            />
        )
    },
    {
        label: "My Arena",
        path: "",
        icon: (
            <IoIosAppstore
                size={iconSize}
                color={iconColor}
                className={iconClassName}
            />
        ),
        children: [
            {
                label: "Coming soon",
                path: "#",
                icon: (
                    <TbTruckLoading
                        size={iconSize}
                        color={iconColor}
                        className={iconClassName}
                    />
                )
            },
        ]
    },
])

export const defaultChunkedData: ChunkedResponse = {
    perPage: 0,
    page: 1,
    totalResult: 0,
    hasNext: false,
    nextCursor: undefined,
    results: []
}


export const theme = createTheme({
    components: {
        MuiPaginationItem: {
            styleOverrides: {
                root: {
                    color: "var(--text)",
                    fontFamily: "var(--font-global)",
                    fontWeight: 600,
                    fontSize: "var(--sm-font)",

                    "&:hover": {
                        backgroundColor: "var(--bg-sec)", // or use alpha()
                        color: "var(--text)",
                    },

                    "&.Mui-selected": {
                        backgroundColor: "var(--accent)",
                        color: "var(--accent-text)",

                        "&:hover": {
                            backgroundColor: "var(--bg-sec)", // keep solid on hover
                            color: "var(--text)",
                        },
                    },

                    "&.Mui-disabled": {
                        opacity: 0.4,
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    padding: 0,
                    color: "var(--border)",
                    "&.Mui-checked": {
                        color: "var(--accent)",
                    },
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    padding: 0,
                    color: "var(--border)",
                    borderColor: "var(--border-fade)",
                    "&.Mui-checked": {
                        color: "var(--accent)",
                    },
                }
            }
        }
    }
});