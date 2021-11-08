import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiGoneResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard, Role, Roles, RolesGuard } from '@repos/common';
import { CreateResolutionDto } from './dto/create-resolution.dto';
import { UpdateResolutionDto } from './dto/update-resolution.dto';
import { ResolutionsEntity } from './resolutions.entity';
import { ResolutionsService } from './resolutions.service';

@ApiTags('resolutions')
@Controller('resolutions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResolutionsController {
  constructor(private readonly service: ResolutionsService) {}

  @Post()
  @Roles(Role.DOCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new resolution for the patient' })
  @ApiCreatedResponse({
    description: 'Resolution was successfully created',
  })
  @ApiBadRequestResponse({
    description: 'Received data violates the predefined DTO schema',
  })
  @ApiNotFoundResponse({
    description: 'Patient with the given id was not found',
  })
  @ApiForbiddenResponse({
    description: 'You dont have permission to access the route',
  })
  async createResolution(
    @Body() dto: CreateResolutionDto,
    @Req() req,
  ): Promise<void> {
    return this.service.createResolution(dto, req.user.userId);
  }

  @Patch(':id')
  @Roles(Role.DOCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update resolution' })
  @ApiOkResponse({
    description: 'Resolution was successfully updated',
  })
  @ApiBadRequestResponse({
    description: 'Received data violates the predefined DTO schema',
  })
  @ApiGoneResponse({
    description: 'Resolution was previously deleted',
  })
  @ApiForbiddenResponse({
    description: 'You dont have permission to access the route',
  })
  async updateResolution(
    @Body() dto: UpdateResolutionDto,
    @Param('id', ParseIntPipe) resolutionId: number,
    @Req() req,
  ): Promise<void> {
    return this.service.updateResolution(resolutionId, dto, req.user.userId);
  }

  @Get('me')
  @Roles(Role.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own resolutions' })
  @ApiOkResponse({
    description:
      'Patient was successfully authenticated, returns a resolutions list',
    type: [ResolutionsEntity],
  })
  @ApiNotFoundResponse({
    description:
      'Patient was successfully authenticated but no resolutions were found',
  })
  @ApiUnauthorizedResponse({
    description: 'Patient can not be authenticated',
  })
  @ApiForbiddenResponse({
    description: 'You dont have permission to access the route',
  })
  async getResolutions(@Req() req): Promise<ResolutionsEntity[]> {
    return this.service.patientGetOwn(req.user.userId);
  }

  @Get()
  @Roles(Role.DOCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all the resolutions of a certain patient' })
  @ApiOkResponse({
    description: 'Returns all the resolutions for the patient',
    type: [ResolutionsEntity],
  })
  @ApiNotFoundResponse({
    description: 'Patient with the given id was not found',
  })
  @ApiForbiddenResponse({
    description: 'You dont have permission to access the route',
  })
  async getAllResolutionsById(
    @Query('id', ParseIntPipe) id: number,
  ): Promise<ResolutionsEntity[]> {
    return this.service.getAllById(id);
  }

  @Delete(':id')
  @Roles(Role.DOCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a certain resolution of a certain patient' })
  @ApiOkResponse({
    description: 'The resolution was deleted',
  })
  @ApiForbiddenResponse({
    description:
      'You do not have permission to access the route or to delete the resolution',
  })
  async deleteResolution(
    @Param('id', ParseIntPipe) resId: number,
    @Req() req,
  ): Promise<void> {
    return this.service.deleteResolution(resId, req.user.userId);
  }
}
