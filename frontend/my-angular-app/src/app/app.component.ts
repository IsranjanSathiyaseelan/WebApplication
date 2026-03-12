import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookService } from './book.service';
import { Book } from './book';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'] 
})
export class AppComponent implements OnInit {

  books: Book[] = [];
  newBook: Book = { id: 0, title: '', author: '', isbn: '', publicationDate: '' };

  editing: boolean = false;
  selectedBookId: number | null = null;

  constructor(private bookService: BookService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(data => {
      this.books = data;
      this.cdr.detectChanges();
    });
  }

  addBook() {
    if (this.editing && this.selectedBookId !== null) {
      this.bookService.updateBook(this.selectedBookId, this.newBook).subscribe(() => {
        this.loadBooks();
        this.cancelEdit();
      });
    } else {
      this.bookService.addBook(this.newBook).subscribe((addedBook) => {
        this.books = [...this.books, addedBook];
        this.resetForm();
        this.cdr.detectChanges();
      });
    }
  }

  editBook(book: Book) {
    this.newBook = { ...book };
    this.selectedBookId = book.id;
    this.editing = true;
  }

  deleteBook(id: number) {
    this.bookService.deleteBook(id).subscribe(() => {
      this.loadBooks();
      if (this.selectedBookId === id) this.cancelEdit();
    });
  }

  cancelEdit() {
    this.resetForm();
    this.editing = false;
    this.selectedBookId = null;
  }

  resetForm() {
    this.newBook = { id: 0, title: '', author: '', isbn: '', publicationDate: '' };
  }
}