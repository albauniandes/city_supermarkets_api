import { Test, TestingModule } from '@nestjs/testing';
import { CitySupermarketService } from './city-supermarket.service';
import { CityEntity } from '../city/city.entity/city.entity';
import { SupermarketEntity } from '../supermarket/supermarket.entity/supermarket.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('CitySupermarketService', () => {
  let service: CitySupermarketService;
  let cityRepository: Repository<CityEntity>;
  let supermarketRepository: Repository<SupermarketEntity>;
  let city: CityEntity;
  let supermarketsList: SupermarketEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CitySupermarketService],
    }).compile();

    service = module.get<CitySupermarketService>(CitySupermarketService);

    cityRepository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
    supermarketRepository = module.get<Repository<SupermarketEntity>>(
      getRepositoryToken(SupermarketEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermarketRepository.clear();
    cityRepository.clear();

    supermarketsList = [];
    for (let i = 0; i < 5; i++) {
      const supermarket: SupermarketEntity = await supermarketRepository.save({
        name: faker.company.name(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        web_page_url: faker.internet.url(),
      });
      supermarketsList.push(supermarket);
    }

    city = await cityRepository.save({
      name: faker.location.city(),
      country: 'Ecuador',
      population: faker.number.int(),
      supermarkets: supermarketsList,
    });
  };

  it('addSupermarketCity should add an supermarket to a city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      web_page_url: faker.internet.url(),
    });

    const newCity: CityEntity = await cityRepository.save({
      name: faker.location.city(),
      country: 'Argentina',
      population: faker.number.int(),
    });

    const result: CityEntity = await service.addSupermarketCity(
      newCity.id,
      newSupermarket.id,
    );

    expect(result.supermarkets.length).toBe(1);
    expect(result.supermarkets[0]).not.toBeNull();
    expect(result.supermarkets[0].name).toBe(newSupermarket.name);
    expect(result.supermarkets[0].web_page_url).toBe(
      newSupermarket.web_page_url,
    );
  });

  it('addSupermarketCity should thrown exception for an invalid supermarket', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.location.city(),
      country: 'Ecuador',
      population: faker.number.int(),
    });

    await expect(() =>
      service.addSupermarketCity(newCity.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('addSupermarketCity should throw an exception for an invalid city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      web_page_url: faker.internet.url(),
    });

    await expect(() =>
      service.addSupermarketCity('0', newSupermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('findSupermarketByCityIdSupermarketId should return supermarket by city', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    const storedSupermarket: SupermarketEntity =
      await service.findSupermarketByCityIdSupermarketId(
        city.id,
        supermarket.id,
      );
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toBe(supermarket.name);
    expect(storedSupermarket.web_page_url).toBe(supermarket.web_page_url);
  });

  it('findSupermarketByCityIdSupermarketId should throw an exception for an invalid supermarket', async () => {
    await expect(() =>
      service.findSupermarketByCityIdSupermarketId(city.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('findSupermarketByCityIdSupermarketId should throw an exception for an invalid city', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    await expect(() =>
      service.findSupermarketByCityIdSupermarketId('0', supermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('findSupermarketByCityIdSupermarketId should throw an exception for an supermarket not associated to the city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      web_page_url: faker.internet.url(),
    });

    await expect(() =>
      service.findSupermarketByCityIdSupermarketId(city.id, newSupermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id is not associated to the city',
    );
  });

  it('findSupermarketsByCityId should return supermarkets by city', async () => {
    const supermarkets: SupermarketEntity[] =
      await service.findSupermarketsByCityId(city.id);
    expect(supermarkets.length).toBe(5);
  });

  it('findSupermarketsByCityId should throw an exception for an invalid city', async () => {
    await expect(() =>
      service.findSupermarketsByCityId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('associateSupermarketsCity should update supermarkets list for a city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      web_page_url: faker.internet.url(),
    });

    const updatedCity: CityEntity = await service.associateSupermarketsCity(
      city.id,
      [newSupermarket],
    );
    expect(updatedCity.supermarkets.length).toBe(1);

    expect(updatedCity.supermarkets[0].name).toBe(newSupermarket.name);
    expect(updatedCity.supermarkets[0].web_page_url).toBe(
      newSupermarket.web_page_url,
    );
  });

  it('associateSupermarketsCity should throw an exception for an invalid city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      web_page_url: faker.internet.url(),
    });

    await expect(() =>
      service.associateSupermarketsCity('0', [newSupermarket]),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('associateSupermarketsCity should throw an exception for an invalid supermarket', async () => {
    const newSupermarket: SupermarketEntity = supermarketsList[0];
    newSupermarket.id = '0';

    await expect(() =>
      service.associateSupermarketsCity(city.id, [newSupermarket]),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('deleteSupermarketToCity should remove an supermarket from a city', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];

    await service.deleteSupermarketCity(city.id, supermarket.id);

    const storedCity: CityEntity = await cityRepository.findOne({
      where: { id: city.id },
      relations: ['supermarkets'],
    });
    const deletedSupermarket: SupermarketEntity = storedCity.supermarkets.find(
      (a) => a.id === supermarket.id,
    );

    expect(deletedSupermarket).toBeUndefined();
  });

  it('deleteSupermarketToCity should thrown an exception for an invalid supermarket', async () => {
    await expect(() =>
      service.deleteSupermarketCity(city.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('deleteSupermarketToCity should thrown an exception for an invalid city', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    await expect(() =>
      service.deleteSupermarketCity('0', supermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('deleteSupermarketToCity should thrown an exception for an non asocciated supermarket', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      web_page_url: faker.internet.url(),
    });

    await expect(() =>
      service.deleteSupermarketCity(city.id, newSupermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id is not associated to the city',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
