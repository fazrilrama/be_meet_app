import { Module, MiddlewareConsumer, RequestMethod  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthMiddleware } from './config/jwtvalidation';


// Modules
import { HealthController } from './config/healtcheck';
import { AuthModule } from './auth/auth.modules';
import { MeetingModule } from './meeting/meeting.module';
import { ParticipantModule } from './participant/participant.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { UploadModule } from './upload/upload.module';
import { CompanyModule } from './company/company.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, {
      ssl: false,
      retryAttempts: 5,
      retryDelay: 3000,
    }),
    AuthModule, 
    MeetingModule, 
    ParticipantModule, 
    UserModule, 
    ChatModule,
    UploadModule,
    CompanyModule
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude('auth/login', 'auth/register', 'health')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
