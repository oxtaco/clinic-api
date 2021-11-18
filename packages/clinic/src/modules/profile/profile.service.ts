import { Metadata } from '@grpc/grpc-js';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import {
  formMetadata,
  IProfileEntity,
  IProfileServiceForClinic,
} from '@repos/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProfileService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    @Inject('PROFILE_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  private profile: IProfileServiceForClinic;

  onModuleInit() {
    this.profile =
      this.client.getService<IProfileServiceForClinic>('ProfileGRPCService');
  }

  async getProfile(userId: number): Promise<IProfileEntity> {
    const meta: Metadata = formMetadata(this.configService.get('jwt.secret'));

    const profile = await lastValueFrom(
      this.profile.getProfileByUserId({ userId }, meta),
    );

    return profile;
  }

  async getManyProfiles(users: number[]): Promise<IProfileEntity[]> {
    const meta: Metadata = formMetadata(this.configService.get('jwt.secret'));

    const { profiles } = await lastValueFrom(
      this.profile.getProfileBatch({ users }, meta),
    );

    return profiles;
  }
}
