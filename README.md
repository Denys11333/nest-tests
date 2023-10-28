# An example for writing tests in NestJs
- unit tests
```
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
