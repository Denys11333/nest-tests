import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../src/user/entities/user.entity';

describe('User (e2e)', () => {
  let app: INestApplication;
  let connection: DataSource;
  let userRepository: Repository<User>;

  const testUser = {
    username: 'username',
    password: '12345',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([User])],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = moduleFixture.get<DataSource>(DataSource);
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    await app.init();

    await userRepository.save({
      username: 'username',
      password: '12345',
    });
  });

  afterEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    if (connection) {
      try {
        await connection.dropDatabase();
      } catch (error) {
        console.error('Помилка при видаленні бази даних :', error);
      }
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should create user (POST /user)', async () => {
    const response = await request(app.getHttpServer())
      .post('/user')
      .send(testUser)
      .expect(201);

    expect(response.body).toMatchObject(testUser);

    const createUser = await userRepository.findOne({
      where: { id: response.body.id },
    });
    expect(createUser).toBeDefined();
    expect(createUser.username).toBe(testUser.username);
  });

  it('should return list of users (GET /user)', async () => {
    const response = await request(app.getHttpServer())
      .get('/user')
      .expect(200);

    expect(response.body).toMatchObject([testUser]);
  });

  it('should find one user (GET /user/:id)', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/1')
      .expect(200);

    expect(response.body).toMatchObject(testUser);
  });

  it('should update user by ID (PATCH /user/:id)', async () => {
    const updatedTestUser = {
      username: 'test',
    };

    const response = await request(app.getHttpServer())
      .patch('/user/1')
      .send(updatedTestUser)
      .expect(200);

    expect(response.body.affected).toBe(1);

    const user = await userRepository.findOne({ where: { id: 1 } });

    expect(updatedTestUser.username).toEqual(user.username);
  });

  it('should delete user by ID (DELETE /user/:id)', async () => {
    const response = await request(app.getHttpServer()).delete('/user/1');

    expect(response.body.affected).toBe(1);

    const user = await userRepository.findOne({ where: { id: 1 } });

    expect(user).toEqual(null);
  });
});
