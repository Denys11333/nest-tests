# An example for writing tests in NestJs
- unit tests with mocks (for example create user test)
``` typescript
describe('create', () => {
    it('should create user', async () => {
      const newUser = {
        username: 'user',
        password: 'password',
      };

      jest
        .spyOn(userRepository, 'save')
        .mockImplementationOnce(() => Promise.resolve(mockUser));

      const result = await userService.create(newUser);

      expect(userRepository.save).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(mockUser);
    });
  });
```
- integration tests (for example create user test)
``` typescript
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
```
