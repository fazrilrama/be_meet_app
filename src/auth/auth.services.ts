import { Injectable } from '@nestjs/common';
import { query, query_transaction } from '../config/connection';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from "./auth_dto/register_dto";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const rows: any = await query('SELECT * FROM users WHERE email = ? OR username = ?', [email, email]);
    if (rows.length === 0) return null;

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // remove password before returning
    delete user.password;
    return user;
  }

  async register(RegisterDto: RegisterDto) {
    const { username, email, password, company_id, fullname } = RegisterDto;

    const rows: any = await query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);

    if(rows.length > 0) {
        return {
            status: false,
            message: 'User tersebut sudah tersedia...'
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insert: any = await query_transaction('INSERT INTO users (company_id, fullname, email, username, password) VALUES (?,?,?,?,?)', [company_id, fullname, email, username, hashedPassword]);

    if (insert.affectedRows == 0) {
        return {
            status: false,
            message: 'Registrasi gagal, silakan coba lagi',
        };
    }

    return {
        status: true,
        message: 'Registrasi berhasil',
        data: {
          id: insert.insertId,
          email,
          username,
          fullname,
        },
    };
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, user };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user,
    };
  }
}
