import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateResolutionDto } from 'src/patient/dto/create-resolution.dto';
import { PatientEntity } from 'src/patient/patient.entity';
import { TimeHelper } from 'src/utils/timeHelper';
import { ResolutionsEntity } from './resolutions.entity';
import { ResolutionsRepository } from './resolutions.repository';

@Injectable()
export class ResolutionsService {
  constructor(
    @InjectRepository(ResolutionsRepository)
    private readonly resolutionsRepository: ResolutionsRepository,
  ) {}

  async getAllById(id: number): Promise<ResolutionsEntity[]> {
    const resolutions: ResolutionsEntity[] =
      await this.resolutionsRepository.getAllById(id);

    if (!resolutions) throw new NotFoundException();

    return TimeHelper.filterOutdated(resolutions);
  }

  async createResolution(
    dto: CreateResolutionDto,
    patient: PatientEntity,
  ): Promise<void> {
    const modDto: CreateResolutionDto = dto;

    modDto.expires_in = TimeHelper.now() + TimeHelper.minToMs(dto.expires_in);

    return this.resolutionsRepository.createResolution(modDto, patient);
  }
}