import { Injectable, NotFoundException } from '@nestjs/common';
import { query, query_transaction } from '../config/connection';
import { v4 as uuidv4 } from 'uuid';

import { ParticipantDto } from './dto/participant_dto';

@Injectable()
export class ParticipantService {
    constructor() {}

    async create_participant(participant: ParticipantDto) {
        const { meeting_id, user_id } = participant;

        const meeting_code = uuidv4(); // Token meet untuk sementara
        const insert: any = await query_transaction(
            'INSERT INTO meeting_participant (meeting_id, user_id, token_meet, status_accept) VALUES (?,?,?,?)'
        , [meeting_id, user_id, meeting_code, 1]);

        if(insert.affectedRows == 0) {
            return {
                status: false,
                message: 'Gagal membuat participant, silahkan coba lagi'
            };
        }

        return {
            status: 200,
            message: 'Berhasil membuat participant',
            data: insert
        };
    }

    async remove_meeting(id?: number) {
        const date = new Date();
        const update:any = await query_transaction(
            'UPDATE meeting_participant SET deleted_at = ? WHERE id = ?'
        , [date, id]);

        if(update.affectedRows == 0) {
            return {
                status: false,
                message: 'Gagal remove participant, silahkan coba lagi'
            };
        }

        return  {
            status: 200,
            message: 'Berhasil menghapus participant',
            data: update
        };
    }

    async approved(id: number, type: number) {        
        const update = await query_transaction(
            'UPDATE meeting_participant SET status_accept = ? WHERE id = ?'
        , [type, id]);

        if(update.affectedRows == 0) {
            return {
                status: false,
                message: 'Gagal update participant, silahkan coba lagi'
            };
        }

        return {
            status: 200,
            message: 'Berhasil update participant',
            data: update
        };
    }

    async list_participant(meeting_id: number, type: number) {
        let sql = `
            SELECT 
                meeting_participant.id,
                users.fullname, 
                status_accept.name as status,
                meeting_participant.token_meet,
                meeting_participant.created_at
            FROM meeting_participant 
            LEFT JOIN users ON users.id = meeting_participant.user_id
            LEFT JOIN status_accept ON status_accept.id = meeting_participant.status_accept
        `;

        const params: any[] = [];
        const conditions: string[] = [];

        if(meeting_id) {
            conditions.push('meeting_participant.meeting_id = ?');
            params.push(meeting_id);
        }

        if(type) {
            conditions.push('meeting_participant.status_accept = ?');
            params.push(type);
        }

        conditions.push('meeting_participant.deleted_at IS NULL');

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' GROUP BY meeting_participant.id';

        const rows: any = await query(sql, params);
        return {
            status: 200,
            message: 'SUCCESS_GET_PARTICIPANTS',
            length: rows.length,
            data: rows
        };
    }
}