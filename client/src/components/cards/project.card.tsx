import Link from "next/link";
import type { Project } from "@/constants/types/project.type";
import styles from "./css/project.card.module.css";
import ImageViewer from "../viewable_image";

interface Props {
    project: Project;
}

export default function ProjectCard({ project }: Props) {
    const stacks = [
        ...(project.tech_stacks || []),
        ...(project.other_stacks || []),
    ];

    const image = project.image_preview_url?.[0];

    return (
        <article className={styles.card}>
            <div
                // href={`/projects/${project.project_id}`}
                className={styles.imageWrapper}
            >
                {image ? (
                    <img
                        src={image}
                        alt={`${project.name} preview`}
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.imageFallback}>
                        <span>{project.name.slice(0, 1)}</span>
                    </div>
                )}

                {project.is_featured === 1 && (
                    <span className={styles.featured}>
                        Featured
                    </span>
                )}
                <ImageViewer
                    images={(project.image_preview_url || []).map((i) => ({
                        uri: i,
                        alt: project.name,
                        caption: project.description,
                    }))}
                />
            </div>

            <div className={styles.content}>
                <div className={styles.heading}>
                    <h2 className={styles.name}>{project.name}</h2>

                    <span className={styles.year}>
                        {new Date(project.completed_at).getFullYear()}
                    </span>
                </div>

                {project.description && (
                    <p className={styles.description}>
                        {project.description}
                    </p>
                )}

                {stacks.length > 0 && (
                    <div className={styles.stacks}>
                        {stacks.map((stack) => (
                            <span key={stack} className={styles.stack}>
                                {stack}
                            </span>
                        ))}
                    </div>
                )}

                <div className={styles.footer}>
                    <span>
                        {project.is_solo === 1 ? "Solo" : "Team"}
                    </span>

                    <div className={styles.links}>
                        {project.live_url && (
                            <Link
                                href={project.live_url}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.link}
                                onClick={(event) => event.stopPropagation()}
                            >
                                Live ↗
                            </Link>
                        )}

                        {project.repo_url && (
                            <Link
                                href={project.repo_url}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.link}
                                onClick={(event) => event.stopPropagation()}
                            >
                                Code ↗
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}