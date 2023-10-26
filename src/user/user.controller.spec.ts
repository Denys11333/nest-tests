import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUser = {
    id: 1,
    username: 'user',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockReturnValueOnce(mockUser),
            findAll: jest.fn().mockReturnValueOnce([mockUser]),
            findOneById: jest.fn().mockReturnValueOnce(mockUser),
            updateById: jest.fn().mockReturnValueOnce({
              generatedMaps: [],
              raw: [],
              affected: 1,
            }),
            removeById: jest.fn().mockReturnValueOnce({
              raw: [],
              affected: 1,
            }),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should create user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'user',
        password: 'password',
      };

      const result = await userController.create(createUserDto);

      expect(userService.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const result = await userController.findAll();

      expect(userService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should find and return user by ID', async () => {
      const result = await userController.findOne(mockUser.id);

      expect(userService.findOneById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update lesson', async () => {
      const result = await userController.update(mockUser.id, mockUser);

      expect(userService.updateById).toHaveBeenCalledWith(
        mockUser.id,
        mockUser,
      );

      expect(result.affected).toEqual(1);
    });
  });

  describe('remove', () => {
    it('should remove user by ID', async () => {
      const result = await userController.remove(mockUser.id);

      expect(userService.removeById).toHaveBeenCalledWith(mockUser.id);
      expect(result.affected).toEqual(1);
    });
  });
});
