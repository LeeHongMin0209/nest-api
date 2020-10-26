import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { O_TRUNC } from 'constants';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();//테스팅 서버는 메인 서버와 따로 작동하기때문에 메인에서 사용한  transform등이 사용되지않음, 테스팅 할때 인식
    //테스트 서버에서도 메인서버의 기능들을 적용시켜줘야함
    app.useGlobalPipes(new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted: true,//원하는 타입의 데이터만 받음
      transform: true, //쿼리에서 받은 데이터 타입을 설정한 데이터타입으로 변경해주는 기능
    }), 
  );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to my Movie API');
  });

  describe("/movies", () => {
    it('GET', () => {
      return request(app.getHttpServer())
      .get("/movies")
      .expect(200)
      .expect([]);
    });

    it("POST 201", () => {
      return request(app.getHttpServer())
      .post("/movies")
      .send({
        title:"Test",
        year:2020,
        genres:['test']
      })
      .expect(201)
    });

    it("POST 400", () => {
      return request(app.getHttpServer())
      .post("/movies")
      .send({
        title:"Test",
        year:2020,
        genres:['test'],
        other:"thing"
      })
      .expect(400)
    });

    it("DELETE", () => {
      return request(app.getHttpServer())
      .delete("/movies")
      .expect(404);
    });
  });

  describe('/movies/:id', () => {

    it('GET 404', () => {
      return request(app.getHttpServer())
      .get("/movies/999")
      .expect(404);
    });

    it('PATCH 200', () => {
      return request(app.getHttpServer())
      .patch('/movies/1')
      .send({ title: 'Update Test'})
      .expect(200);
    });

    it('DELETE 200', () => {
      return request(app.getHttpServer())
      .delete('/movies/1')
      .expect(200)
    });
  })
});
