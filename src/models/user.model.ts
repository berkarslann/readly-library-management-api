import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Transaction } from "./transaction.model";

@Entity("users") 
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({nullable: false})
  email:string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions!: Transaction[];
 
}
