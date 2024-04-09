import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

describe('SongsController', () => {
  let controller: SongsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        {
          provide: SongsService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 1
            }),
            findAll: jest.fn().mockResolvedValue([
              {
                id: 1,
                title: 'Sample 1'
              },
              {
                id: 2,
                title: 'Sample 2'
              }
            ]),
          }
        }
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
