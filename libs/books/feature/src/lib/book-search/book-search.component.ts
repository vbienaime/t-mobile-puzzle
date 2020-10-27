import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription } from 'rxjs';
import {
  addToReadingList,
  undoAddToReadingList,
  confirmedAddToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books: ReadingListBook[];

  searchForm = this.fb.group({
    term: ''
  });

  subscription: Subscription;

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly actions$: Actions
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
    });

    this.subscription = this.actions$
      .pipe(ofType(confirmedAddToReadingList))
      .subscribe(({ book }) => this.displayUndoSnackbar(book));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  clearSearch() {
    this.searchForm.setValue({ term: '' });
    this.store.dispatch(clearSearch());
  }

  displayUndoSnackbar(book: Book): void {
    const msg = `Added '${book.title}'`;
    const snackbar = this.snackBar.open(msg, 'Undo');
    snackbar.onAction().subscribe(() => this.store.dispatch(undoAddToReadingList({ book })));
  }
}
