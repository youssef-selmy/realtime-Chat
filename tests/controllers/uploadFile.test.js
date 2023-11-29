
const request = require('supertest');
const multer = require('multer');
const app = require('../../index'); 
const User = require('../../models/userModel'); 

jest.mock('../../models/userModel', () => ({
  findById: jest.fn(),
}));

jest.mock('multer', () => ({
  single: jest.fn(),
}));

describe('File Upload Controller', () => {
  it('should upload a file and link it to the user', async () => {
    const mockUser = {
      _id: 'mockUserId',
      save: jest.fn(),
    };

    User.findById.mockResolvedValue(mockUser);

    multer.single.mockImplementation((field) => (req, res, next) => {
      req.file = { filename: 'testfile.png' }; // Simulating uploaded file data
      next();
    });

    const mockReq = {
      user: { id: 'mockUserId' }, // Simulating authenticated user
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await request(app)
      .post('/upload')
      .send(mockReq)
      .expect(200);

    expect(User.findById).toHaveBeenCalledWith('mockUserId');
    expect(mockUser.fileLink).toBe('/uploads/testfile.png');
    expect(mockUser.save).toHaveBeenCalled();
  });
});
