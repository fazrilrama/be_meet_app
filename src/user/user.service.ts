import { Injectable, NotFoundException } from '@nestjs/common';
import { query, query_transaction } from '../config/connection';

@Injectable()
export class UserService {
    constructor() {}

    async list() {
        let sql = `
            SELECT users.id, users.fullname, users.email, users.username, company.name as company_name 
            FROM users 
            LEFT JOIN company ON company.id = users.company_id
        `;

        const params: any[] = [];

        sql += ' ORDER BY users.id DESC';
        const rows: any = await query(sql, params);
        return {
            status: true,
            message: 'SUCCESS_GET_USER',
            data: rows
        };
    }

    async get_by_token(id?: number) {
        let sql = `
            SELECT users.id, users.fullname, users.email, users.username, company.name as company_name 
            FROM users 
            LEFT JOIN company ON company.id = users.company_id
        `;

        const params: any[] = [];
        const conditions: string[] = [];

        if(id) {
            conditions.push('users.id = ?');
            params.push(id);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        const rows: any = await query(sql, params);
        return {
            status: true,
            message: 'SUCCESS_GET_PROFILE',
            data: rows
        };
    }
}