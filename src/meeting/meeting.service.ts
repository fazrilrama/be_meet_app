import { Injectable, NotFoundException } from '@nestjs/common';
import { query, query_transaction } from '../config/connection';
import { MeetingDto } from './dto/meeting_dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MeetingService {
    constructor() {}

    async create_meeting(meeting: MeetingDto, user_id?: string) {
        const { meeting_name, start_date, end_date, description } = meeting;

        const meeting_code = uuidv4(); // Generate Meeting Code

        const insert: any = await query_transaction(
            'INSERT INTO meetings (created_by, meeting_name, meeting_code, start_date, end_date, description) VALUES (?,?,?,?,?,?)'
        , [user_id, meeting_name, meeting_code, start_date, end_date, description]);

        if(insert.affectedRows == 0) {
            return {
                status: false,
                message: 'Gagal membuat meeting, silahkan coba lagi'
            };
        }

        return {
            status: 200,
            message: 'Berhasil membuat meeting',
            data: {
                code: meeting_code
            },

        }
    }

    async list_meeting(filters: { meeting_code?: string; user_id?: string }) {
        const { meeting_code, user_id } = filters;
      
        let sql = 'SELECT meetings.*, users.fullname FROM meetings LEFT JOIN users ON users.id = meetings.created_by';
        const params: any[] = [];
        const conditions: string[] = [];
      
        if (meeting_code) {
          conditions.push('meeting_code = ?');
          params.push(meeting_code);
        }
      
        if (user_id) {
          conditions.push('created_by = ?');
          params.push(user_id);
        }
      
        if (conditions.length > 0) {
          sql += ' WHERE ' + conditions.join(' AND ');
        }
      
        const rows: any = await query(sql, params);

        const meeting = rows[0];

        if (meeting_code && meeting) {
            const sql_record = 'SELECT id, record_name, created_at FROM meeting_record WHERE meeting_id = ?';
            const sql_participant = `
                SELECT meeting_participant.id, users.fullname, users.email, status_accept.name as status_name  FROM meeting_participant 
                    LEFT JOIN users ON users.id = meeting_participant.user_id
                    LEFT JOIN status_accept ON status_accept.id = meeting_participant.status_accept
                WHERE meeting_id = ?
            `;

            const record: any = await query(sql_record, meeting.id);
            const participant: any = await query(sql_participant, meeting.id);

            meeting.participant = participant;
            meeting.record = record;
        }

        return {
            status: 200,
            message: 'SUCCESS_GET_MEETINGS',
            data: rows
        };
    }
}