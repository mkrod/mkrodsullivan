import { getProjects } from "@/constants/controllers/project.controller";
import styles from "./css/projects.module.css";
import { ChunkedResponse } from "@/constants/types/global.types";
import { Project } from "@/constants/types/project.type";
import { clientURL, defaultChunkedData, ogImage, siteName } from "@/constants/variables/global.vars";
import { GetServerSideProps } from "next";
import ProjectCard from "@/components/cards/project.card";
import { Pagination, PaginationItem } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import EmptyList from "@/components/empty.list";
import Head from "next/head";

interface Props {
    projectsRes?: ChunkedResponse<Project>;
}


export default function Projects({ projectsRes = defaultChunkedData }: Props) {
    const { results: projects, page, totalResult, perPage } = projectsRes;
    const router = useRouter();

    return (
        <>
            <Head>
                <title>
                    {`Projects${Number(page) > 1 ? ` — Page ${page}` : ""} | ${siteName}`}
                </title>

                <meta
                    name="description"
                    content={
                        Number(page) > 1
                            ? `Page ${page} of projects by ${siteName}, featuring web applications, software projects, and development work.`
                            : `Explore projects built by ${siteName}, including web applications, software projects, and development work.`
                    }
                />

                <link
                    rel="canonical"
                    href={
                        Number(page) > 1
                            ? `${clientURL}/projects?page=${page}`
                            : `${clientURL}/projects`
                    }
                />

                <meta
                    property="og:type"
                    content="website"
                />

                <meta
                    property="og:title"
                    content={
                        Number(page) > 1
                            ? `Projects — Page ${page} | ${siteName}`
                            : `Projects | ${siteName}`
                    }
                />

                <meta
                    property="og:description"
                    content={`Explore projects built by ${siteName}, including web applications, software projects, and development work.`}
                />

                <meta
                    property="og:url"
                    content={
                        Number(page) > 1
                            ? `${clientURL}/projects?page=${page}`
                            : `${clientURL}/projects`
                    }
                />

                <meta
                    property="og:site_name"
                    content={siteName}
                />

                <meta
                    property="og:image"
                    content={ogImage}
                />

                <meta
                    property="og:image:alt"
                    content={`${siteName} — Projects`}
                />
            </Head>
            <main
                className={`${styles.container} patternBg`}
            >
                {projects.length > 0 && (
                    <div className={styles.projectsWrapper}>
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.project_id}
                                project={project}
                            />
                        ))}
                    </div>
                )}


                {projects.length === 0 && (
                    <div className={styles.emptyContainer}>
                        <EmptyList
                            title="No projects yet"
                            subtitle="There are currently no projects to display."
                        />
                    </div>
                )}

                <nav
                    aria-label="Projects pagination"
                    className={`${styles.paginationWrapper}`}
                >
                    <Pagination
                        variant="outlined"
                        shape="rounded"
                        renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                href={{
                                    pathname: router.pathname,
                                    query: {
                                        ...router.query,
                                        ...(item.page === 1
                                            ? (() => {
                                                const { page: _, ...query } = router.query;
                                                return query;
                                            })()
                                            : { page: item.page }),
                                    },
                                }}
                                {...item}
                            />
                        )}
                        page={Number(page)}
                        count={Math.ceil(Number(totalResult) / Number(perPage))}
                        hidePrevButton={Number(page) < 2}
                        hideNextButton={Number(page) >= Math.ceil(Number(totalResult) / Number(perPage))}
                    />
                </nav>
            </main>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    let props: Props = {};
    const page = ctx.query.page as string || 1;

    try {
        const response = await getProjects({ limit: 9, page: Number(page) });
        if (response.status !== 200) throw Error("Fetch has failed!")
        if (!response.data) throw Error("Fetch returned no data!");

        props.projectsRes = response.data;

    } catch (err) {
        console.log("Home Data failed: ", err);
    }
    return {
        props
    }
}