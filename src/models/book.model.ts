import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./transaction.model";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ type: "float", default: 0 })
  rating: number; 

  @Column({default:0})
  totalRatings: number;

  @Column({default:0})
  ratingCount: number;

  @Column()
  author: string;

  @Column({ default: true })
  isAvailable!: boolean; 

  @OneToMany(() => Transaction, (transaction) => transaction.book)
  transactions!: Transaction[]; 
}
