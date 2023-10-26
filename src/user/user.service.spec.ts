import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  const mockUser = {
    id: 1,
    username: 'user',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

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

  describe('findAll', () => {
    it('should return an array users', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce([mockUser]);

      const result = await userService.findAll();

      expect(userRepository.find).toHaveBeenCalledWith({});
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOneById', () => {
    it('should find and return a user by ID', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await userService.findOneById(mockUser.id);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(null);

      await expect(userService.findOneById(mockUser.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });
  });

  describe('updateById', () => {
    it('should update user By ID', async () => {
      const updatedUser = {
        username: 'user1',
        password: 'password1',
      };

      jest.spyOn(userRepository, 'update').mockResolvedValueOnce({
        generatedMaps: [],
        raw: [],
        affected: 1,
      });

      const result = await userService.updateById(mockUser.id, updatedUser);

      expect(userRepository.update).toHaveBeenCalledWith(
        mockUser.id,
        updatedUser,
      );

      expect(result.affected).toEqual(1);
    });
  });

  describe('removeById', () => {
    it('should delete user by ID', async () => {
      jest.spyOn(userRepository, 'delete').mockResolvedValueOnce({
        raw: [],
        affected: 1,
      });

      const result = await userService.removeById(mockUser.id);

      expect(userRepository.delete).toHaveBeenCalledWith(mockUser.id);
      expect(result.affected).toEqual(1);
    });

    it('should throw BadRequestException if ID is not a number', async () => {
      const id = 'invalid-id';

      const idIsANumber = jest.spyOn(Number, 'isNaN').mockReturnValueOnce(true);

      await expect(userService.removeById(+id)).rejects.toThrow(
        BadRequestException,
      );

      expect(idIsANumber).toHaveBeenCalledWith(+id);
    });
  });
});
