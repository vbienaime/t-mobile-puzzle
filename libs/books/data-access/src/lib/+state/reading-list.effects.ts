import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { Book, ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book })),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  undoAddBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.undoAddToReadingList),
      map(({ book }) => ReadingListActions.removeFromReadingList({ item: { bookId: book.id, ...book } }))
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item })
          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  undoRemoveBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.undoRemoveFromReadingList),
      map(({ item }) => ReadingListActions.addToReadingList({ book: { id: item.bookId, ...item } }))
    )
  );

  confirmedAddBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedAddToReadingList),
      map(({ book }) => this._displayUndoSnackbar(book, 'added'))), { dispatch: false }
  );

  confirmedRemoveBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedRemoveFromReadingList),
      map(({ item }) => this._displayUndoSnackbar(item, 'removed'))), { dispatch: false }
  );

  private _displayUndoSnackbar(x: Book | ReadingListItem, action: 'added' | 'removed'): void {
    const msg = `${action === 'added' ? 'Added' : 'Removed'} '${x.title}'`;
    const snackbar = this.snackBar.open(msg, 'Undo');

    snackbar.onAction().subscribe(() => {
      action === 'added'
        ? this.store.dispatch(
            ReadingListActions.undoAddToReadingList({ book: x as Book }))
        : this.store.dispatch(
            ReadingListActions.undoRemoveFromReadingList({ item: x as ReadingListItem}));
    });
  }

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private readonly snackBar: MatSnackBar,
    private readonly store: Store
  ) {}
}
