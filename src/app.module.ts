import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
     MulterModule.register({
    dest: './uploads',
  })
  ,GatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
