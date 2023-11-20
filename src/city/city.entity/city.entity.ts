import { SupermarketEntity } from '../../supermarket/supermarket.entity/supermarket.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CityEntity {
  [x: string]: any;
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  population: number;

  @ManyToMany(() => SupermarketEntity)
  @JoinTable()
  supermarkets: SupermarketEntity[];
}
