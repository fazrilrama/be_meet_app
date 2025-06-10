import { IsNotEmpty, IsString } from 'class-validator';

export class MeetingDto {
  @IsString()
  @IsNotEmpty()
  meeting_name: number;

  @IsNotEmpty()
  @IsString()
  start_date: string;

  @IsNotEmpty()
  @IsString()
  end_date: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
