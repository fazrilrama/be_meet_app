import { Controller, Get } from '@nestjs/common';
import { query } from '../config/connection'; // pastikan import dari helper-mu

@Controller('health')
export class HealthController {
  @Get()
  async check() {
    try {
      await query('SELECT 1'); // test query
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      return {
        status: 'fail',
        database: 'disconnected',
        error: err.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
