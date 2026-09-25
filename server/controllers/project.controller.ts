import { db } from "@/config/db.config.js";
import type { Project, ProjectFilter } from "@/types/project.type.js";
import { parseProject } from "@/utilities/projects.utils.js";
import type { Request, Response } from "express";


export const getProjects = async (req: Request, res: Response) => {

    try {
        const q = req.query as Record<string, string | number | undefined>;
        const qLimit = Number(q.limit);
        const defaultLimit = 5;
        const maxLimit = 10;

        const filter = {
            limit: !isNaN(qLimit) ? Math.min(maxLimit, qLimit) : defaultLimit,
            order: "newest",
        } as ProjectFilter;

        if (q.order) filter.order = q.order as "newest" | "oldest";
        if (q.cursorCreatedAt) filter.cursorCreatedAt = String(q.cursorCreatedAt);
        if (q.cursorId) filter.cursorId = Number(q.cursorId);

        const orderDirection = filter.order === "oldest" ? "ASC" : "DESC"


        // --- Build conditions ---
        const conditions: string[] = [];
        const values: any[] = [];

        let sql = `
            SELECT *
            FROM completed_projects p
        `

        if (conditions.length) sql += " WHERE " + conditions.join(" AND ");

        // --- Pagination setup ---
        let page: number | null = null;
        let totalResult: number | null = null;
        let offset = 0;
        let hasNext = false;

        let countSql: string | null = null;
        let countValue: any[] = [];


        if (filter.limit !== -1) {
            if (q.page) {
                page = Math.max(Number(q.page), 1);
                offset = (page - 1) * filter.limit;

                countSql = `SELECT COUNT(*) as total FROM completed_projects p ${conditions.length ? "WHERE " + conditions.join(" AND ") : ""}`;
                countValue = [...values]

                sql += ` ORDER BY p.completed_at ${orderDirection}, p.id ${orderDirection} LIMIT ? OFFSET ?`;
                values.push(filter.limit, offset);

            } else {
                if (filter.cursorCreatedAt && filter.cursorId) {
                    conditions.push("(p.completed_at < ? OR (p.completed_at = ? AND p.id < ?))");
                    values.push(filter.cursorCreatedAt, filter.cursorCreatedAt, filter.cursorId);
                    // Re-inject WHERE for cursor mode
                    const baseSelect = sql.split("FROM completed_projects p")[0] + "FROM completed_projects p";
                    sql = `${baseSelect} WHERE ${conditions.join(" AND ")}`;
                }
                sql += ` ORDER BY p.completed_at ${orderDirection}, p.id ${orderDirection} LIMIT ?`;
                values.push(filter.limit + 1);
            }
        } else {

            // Unlimited: no page pagination and no cursor pagination.
            sql += `
              ORDER BY p.completed_at ${orderDirection}, p.id ${orderDirection}
            `;
        }

        if (countSql && page) {
            const [countRows]: [any[], any] = await db.query(countSql, countValue);
            totalResult = countRows[0].total;
            hasNext = page * filter.limit < (totalResult ?? 0);
        }

        // --- Execute and Map ---
        const [rows]: [Project[], any] = await db.query(sql, values) as [any[], any];
        const results = rows.map(parseProject);

        // Handle cursor logic for next result set
        let nextCursor = null;
        if (!q.page && filter.limit !== -1) {
            hasNext = results.length > filter.limit;
            if (hasNext) results.pop();
            const lastItem = results.length ? results[results.length - 1] : null;
            nextCursor = lastItem ? { createdAt: lastItem.completed_at, postId: lastItem.id } : null;
        }

        const finalResponse = {
            status: 200,
            message: "Projects fetched successfully",
            data: { perPage: filter.limit, page, totalResult, hasNext, nextCursor, results },
        }

        return res.status(finalResponse.status).json(finalResponse);

    } catch (err) {
        console.log("Error getting projects: ", err);
        return res.status(500).json({ status: 500, message: "an error has occurred!" });
    }
}