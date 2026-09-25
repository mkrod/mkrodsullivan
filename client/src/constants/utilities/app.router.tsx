import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

import { useRouter } from "next/router";
import type {
    NextRouter,
} from "next/router";
import type { UrlObject } from "url";



export type NavigationLoading =
    | "none"
    | "top"
    | "fullscreen";

export interface NavigateOptions {
    /**
     * How navigation loading should be displayed.
     */
    loading?: NavigationLoading;

    /**
     * Replace the current history entry instead of pushing one.
     */
    replace?: boolean;

    /**
     * Next.js shallow routing.
     */
    shallow?: boolean;

    /**
     * Whether to scroll to the top after navigation.
     */
    scroll?: boolean;

    /**
     * Next.js locale.
     */
    locale?: string;

    /**
     * Locales to include in the generated path.
     */
    locales?: string[];
}

export interface NavigationState {
    navigating: boolean;
    loading: NavigationLoading;
}

export interface AppRouter extends NextRouter {
    navigate: (url: UrlObject, options?: NavigateOptions,) => Promise<boolean>;

    navigation: NavigationState;
}

const RouterContext = createContext<AppRouter | null>(null);

export function RouterProvider({ children, }: { children: ReactNode }) {

    const router = useRouter();

    const [navigation, setNavigation] = useState<NavigationState>({
        navigating: false,
        loading: "none",
    });

    const navigate = useCallback(async (url: UrlObject, options: NavigateOptions = {}) => {
        const {
            loading = "top",
            replace = false,
            shallow = false,
            scroll = true,
            locale,
            locales,
        } = options;

        setNavigation({
            navigating: loading !== "none",
            loading,
        });

        try {
            if (replace) {
                return await router.replace(url, undefined, {
                    shallow,
                    scroll,
                    locale,
                    unstable_skipClientCache: false,
                });
            }

            return await router.push(url, undefined, {
                shallow,
                scroll,
                locale,
                unstable_skipClientCache: false,
            });
        } finally {
            setNavigation({
                navigating: false,
                loading: "none",
            });
        }
    },
        [router],
    );

    const value = useMemo(() => ({
        ...router,
        navigate,
        navigation,
    }) satisfies AppRouter,
        [router, navigate, navigation]
    );

    return (
        <RouterContext.Provider value={value}>
            {children}
        </RouterContext.Provider>
    );
}

export function useAppRouter() {
    const router = useContext(RouterContext);

    if (!router) {
        throw new Error(
            "useAppRouter must be used inside RouterProvider",
        );
    }

    return router;
}
