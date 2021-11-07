import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ConfigurationModule } from '../app-configuration/configuration.module';
import { jwtConstants, JwtStrategy } from '@repos/common';
import { JwtModule } from '@nestjs/jwt';
import { AppointmentsModule } from './appointments/appointments.module';
import { ResolutionsModule } from './resolutions/resolutions.module';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
    ConfigurationModule,
    AppointmentsModule,
    ResolutionsModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
