import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermarketService } from './supermarket.service';
import { SupermarketEntity } from './supermarket.entity/supermarket.entity';
import { faker } from '@faker-js/faker';

describe('SupermarketService', () => {
  let service: SupermarketService;
  let repository: Repository<SupermarketEntity>;
  let supermarketsList: SupermarketEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermarketService],
    }).compile();

    service = module.get<SupermarketService>(SupermarketService);
    repository = module.get<Repository<SupermarketEntity>>(
      getRepositoryToken(SupermarketEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermarketsList = [];
    for (let i = 0; i < 5; i++) {
      const supermarket: SupermarketEntity = await repository.save({
        name: faker.company.name(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        web_page_url: faker.internet.url(),
      });
      supermarketsList.push(supermarket);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermarkets: SupermarketEntity[] = await service.findAll();
    expect(supermarkets).not.toBeNull();
    expect(supermarkets).toHaveLength(supermarketsList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermarket: SupermarketEntity = supermarketsList[0];
    const supermarket: SupermarketEntity = await service.findOne(
      storedSupermarket.id,
    );
    expect(supermarket).not.toBeNull();
    expect(supermarket.name).toEqual(storedSupermarket.name);
    expect(supermarket.web_page_url).toEqual(storedSupermarket.web_page_url);
  });

  it('create should return a new supermarket', async () => {
    const supermarket: SupermarketEntity = {
      id: '',
      name: faker.company.name(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      web_page_url: faker.internet.url(),
    };

    const newSupermarket: SupermarketEntity = await service.create(supermarket);
    expect(newSupermarket).not.toBeNull();

    const storedSupermarket: SupermarketEntity = await repository.findOne({
      where: { id: newSupermarket.id },
    });
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(newSupermarket.name);
    expect(storedSupermarket.web_page_url).toEqual(newSupermarket.web_page_url);
  });

  it('update should modify a supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    supermarket.name = 'New supermarket name';
    supermarket.web_page_url = 'www.elmejorsupermercado.com';
    const updatedSupermarket: SupermarketEntity = await service.update(
      supermarket.id,
      supermarket,
    );
    expect(updatedSupermarket).not.toBeNull();
    const storedSupermarket: SupermarketEntity = await repository.findOne({
      where: { id: supermarket.id },
    });
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(supermarket.name);
    expect(storedSupermarket.web_page_url).toEqual(supermarket.web_page_url);
  });

  it('delete should remove a supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    await service.delete(supermarket.id);
    const deletedSupermarket: SupermarketEntity = await repository.findOne({
      where: { id: supermarket.id },
    });
    expect(deletedSupermarket).toBeNull();
  });
});
