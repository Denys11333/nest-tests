import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';

@Injectable()
export class DatabaseTestConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      database: this.configService.get('MYSQL_DB_TEST'),
      host: this.configService.get('MYSQL_HOST'),
      password: this.configService.get('MYSQL_PASSWORD'),
      port: Number(this.configService.get('MYSQL_PORT')),
      username: this.configService.get('MYSQL_USER'),
      entities: [User],
      synchronize: true,
    };
  }
}
