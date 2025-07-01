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

        if(user_id) {
            conditions.push('meetings.created_by = ?');
            params.push(user_id);
        }
      
        if (conditions.length > 0) {
          sql += ' WHERE ' + conditions.join(' AND ');
        }

        const rows: any = await query(sql, params);


        let meet_participant = `
                SELECT meetings.*, users.fullname FROM meeting_participant
                LEFT JOIN meetings ON meetings.id = meeting_participant.meeting_id
                LEFT JOIN users ON users.id = meetings.created_by
            `;

        const params_meet: any[] = [];
        const conditions_meet: string[] = [];

        if(user_id) {
            conditions_meet.push('meeting_participant.user_id = ?');
            params_meet.push(user_id);
        }

        if (conditions_meet.length > 0) {
            meet_participant += ' WHERE ' + conditions_meet.join(' AND ');
        }

        const data: any = await query(meet_participant, params_meet);

        const allMeetingsMap = new Map();

        // Check apakah ada ?
        // Kalo gaada kita ngambil lewat meeting participant
        for (const meet of rows) {
            allMeetingsMap.set(meet.id, meet);
        }
        
        for (const meet of data) {
            allMeetingsMap.set(meet.id, meet);
        }
        
        const allMeetings = Array.from(allMeetingsMap.values());

        let meeting = allMeetings;

        if (meeting_code && meeting.length > 0) {
            const selectedMeeting = meeting.find(m => m.meeting_code === meeting_code);

            if (selectedMeeting) {
                const sql_record = `
                    SELECT id, record_name, created_at 
                    FROM meeting_record 
                    WHERE meeting_id = ?
                `;
                const sql_participant = `
                    SELECT meeting_participant.id, users.fullname, users.email, status_accept.name AS status_name  
                    FROM meeting_participant 
                    LEFT JOIN users ON users.id = meeting_participant.user_id
                    LEFT JOIN status_accept ON status_accept.id = meeting_participant.status_accept
                    WHERE meeting_id = ?
                `;

                const record: any = await query(sql_record, [selectedMeeting.id]);
                const participant: any = await query(sql_participant, [selectedMeeting.id]);

                // Tambahkan ke object selectedMeeting
                selectedMeeting.participant = participant;
                selectedMeeting.record = record;
            }
        }

        return {
            status: 200,
            message: 'SUCCESS_GET_MEETINGS',
            length: meeting.length,
            data: meeting
        };
    }
}