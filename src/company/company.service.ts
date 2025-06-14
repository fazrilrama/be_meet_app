import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { query, query_transaction } from '../config/connection';

@Injectable() 
export class CompanyService {
    constructor() {}

    async list() {
        let sql = 'SELECT * FROM company';

        const params: any[] = [];

        sql += ' ORDER BY id DESC';
        const rows: any = await query(sql, params);

        return {
            status: 200,
            message: 'SUCCESS_GET_COMPANY',
            data: rows
        };
    }
}