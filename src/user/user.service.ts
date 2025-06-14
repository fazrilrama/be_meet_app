import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
            status: 200,
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
            status: 200,
            message: 'SUCCESS_GET_PROFILE',
            data: rows
        };
    }

    async get_request_user(user?: any) {
        if(user?.role != 1) { // WAJIB SUPERADMIN
            throw new BadRequestException('PERMISSION_DENIED');
        }

        let sql = `
            SELECT 
                users.id,
                users.fullname,
                users.email,
                users.username,
                company.name as company_name,
                user_role.name as role_name,
                users.created_at
            FROM users
            LEFT JOIN user_role ON user_role.id = users.role_id
            LEFT JOIN company ON company.id = users.company_id
            WHERE company_id = ? AND is_active = 0
            ORDER BY users.id DESC
        `;

        const rows: any = await query(sql, user.user.company_id);
        return {
            status: 200,
            message: 'SUCCESS_GET_REQUEST_USER',
            data: rows
        };
    }

    async approval_user(user_id: number, type:number) {
        const update: any = await query_transaction(
            'UPDATE users SET is_active = ? WHERE id = ?'
        , [type, user_id]);

        if (update.affectedRows == 0) {
            return {
              status: false,
              message: 'data tidak terupdate...',
            };
        }

        return {
            status: 200,
            message: 'Update success',
            data: update
        };
    }
}