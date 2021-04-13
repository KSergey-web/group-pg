import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PlayService } from './play.service';

describe('PlayService', () => {
  let service: PlayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[AppModule],
    }).compile();

    service = module.get<PlayService>(PlayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('шшшшшш', () => {
    console.log(service.getClientsFromRoom(''));
  });
});
