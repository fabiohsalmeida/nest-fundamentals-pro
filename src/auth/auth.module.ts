import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ArtistsModule } from 'src/artists/artists.module';
import { ApikeyStrategy } from './api-key.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: {
          expiresIn: '1d'
        }
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    ArtistsModule
  ],
  providers: [AuthService, JwtStrategy, ApikeyStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
