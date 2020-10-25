import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted: true,//원하는 타입의 데이터만 받음
      transform: true, //쿼리에서 받은 데이터 타입을 설정한 데이터타입으로 변경해주는 기능
    }), 
  );
  await app.listen(3000);
}
bootstrap();

// nestJS 실행 순서 : main -> module -> controller -> service
// nestJS에서 controller는 express에서 라우터와 같음