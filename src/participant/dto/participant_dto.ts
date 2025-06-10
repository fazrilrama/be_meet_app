import { IsNotEmpty, IsNumber } from 'class-validator';

export class ParticipantDto {
  @IsNumber()
  @IsNotEmpty()
  meeting_id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
