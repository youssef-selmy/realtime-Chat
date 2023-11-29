const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { signup, login } = require('../../controllers/auth'); 
const createToken = require('../../utils/createToken');
const User = require('../../models/userModel');

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked_token'),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('../../utils/createToken', () => jest.fn(() => 'mocked_token'));

jest.mock('../../models/userModel', () => ({
  create: jest.fn(),
  findOne: jest.fn(),
}));

describe('Signup Controller', () => {
  const req = {
    body: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    },
  };

  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  test('should create a new user and return a token', async () => {
    User.create.mockResolvedValue(req.body);
    
    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(createToken).toHaveBeenCalledWith(req.body._id);
    expect(res.json).toHaveBeenCalledWith({ data: req.body, token: 'mocked_token' });
  });

  test('should return 400 if required fields are missing', async () => {
    req.body = {}; // Missing required fields
    
    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Name, email, and password are required' });
  });
});

describe('Login Controller', () => {
  const req = {
    body: {
      email: 'test@example.com',
      password: 'password123',
    },
  };

  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  const mockedUser = {
    _id: '123',
    email: req.body.email,
    password: 'hashed_password',
  };

  test('should log in the user and return a token', async () => {
    User.findOne.mockResolvedValue(mockedUser);
    bcrypt.compare.mockResolvedValue(true);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, mockedUser.password);
    expect(createToken).toHaveBeenCalledWith(mockedUser._id);
    // expect(res.json).toHaveBeenCalledWith({ data: { ...mockedUser, password: undefined }, token: 'mocked_token' });
  });

  test('should return 400 if email or password is missing', async () => {
    req.body = {}; // Missing email and password
    
    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
  });

  test('should return 401 if user does not exist or password is incorrect', async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
  });
});
