import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateResolutionDto {
  @IsNotEmpty()
  @ApiProperty()
  text: string;

  @IsNumberString()
  @ApiProperty()
  patientId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumberString()
  expiresIn: number; // minutes
}
