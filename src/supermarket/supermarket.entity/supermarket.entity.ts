import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SupermarketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 13, scale: 10 })
  latitude: number;

  @Column('decimal', { precision: 13, scale: 10 })
  longitude: number;

  @Column()
  web_page_url: string;
}
