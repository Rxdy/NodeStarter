// userController.test.ts
import UserController from '../../src/controllers/user';
import { User, userCreationAttributes } from "../../src/models/user";
import Crypt from "../../src/tools/hash";
import UUID from "../../src/tools/uuid";

// Mock des dépendances
jest.mock("../../src/models/user");
jest.mock("../../src/tools/hash");
jest.mock("../../src/tools/uuid");

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should create a new user successfully', async () => {
	
      const userData: userCreationAttributes = {
        mail: 'test@example.com',
        username: 'testuser',
        password: 'initialPassword',
      };

      const mockUuid = 'mocked-uuid';
      const mockHashedPassword = 'hashedpassword123';

      (UUID.v7 as jest.Mock).mockReturnValue(mockUuid);
      (Crypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
      (User.create as jest.Mock).mockResolvedValue({ ...userData, id: mockUuid });
      (User.update as jest.Mock).mockResolvedValue([1]);

      await UserController.add(userData);

      expect(UUID.v7).toHaveBeenCalledTimes(1);
      expect(User.create).toHaveBeenCalledWith({
        ...userData,
        id: mockUuid,
        password: "password1" 
      });
      expect(Crypt.hash).toHaveBeenCalledWith("password1");
      expect(User.update).toHaveBeenCalledWith(
        {
          ...userData,
          id: mockUuid,
          password: mockHashedPassword
        },
        {
          where: { id: mockUuid },
          validate: false
        }
      );
    });

    it('should handle errors during user creation', async () => {
      
      const userData: userCreationAttributes = {
        mail: 'test@example.com',
        username: 'testuser',
        password: 'initialPassword', 
      };

      const mockUuid = 'mocked-uuid';
      (UUID.v7 as jest.Mock).mockReturnValue(mockUuid);
      (User.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      
      await expect(UserController.add(userData)).rejects.toThrow('Database error');
    });
  });

  describe('getAll', () => {
    it('should return all users without password and token', async () => {
      
      const mockUsers = [
        { id: '1', mail: 'user1@example.com', username: 'user1' },
        { id: '2', mail: 'user2@example.com', username: 'user2' },
      ];
      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      
      const result = await UserController.getAll();

      expect(User.findAll).toHaveBeenCalledWith({
        attributes: { exclude: ["password", "token"] },
        order: [["createdAt", "desc"]],
      });
      expect(result).toEqual(mockUsers);
    });

    it('should handle errors when fetching users', async () => {
      
      (User.findAll as jest.Mock).mockRejectedValue(new Error('Fetch error'));

      await expect(UserController.getAll()).rejects.toThrow('Fetch error');
    });
  });
});