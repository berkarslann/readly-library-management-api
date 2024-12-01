import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.model";
import { Book } from "./book.model";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Book, (book) => book.transactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "book_id" })
  book: Book;

  @Column({ type: "timestamp", nullable: false })
  borrowDate: Date;

  @Column({ type: "timestamp", nullable: true })
  returnDate: Date;

  @Column({ nullable: true, default:0 })
  rating: number;
}
