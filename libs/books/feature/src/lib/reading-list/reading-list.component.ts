import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription } from 'rxjs';
import {
  getReadingList,
  removeFromReadingList,
  undoRemoveFromReadingList,
  confirmedRemoveFromReadingList
} from '@tmo/books/data-access';
import { ReadingListItem } from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent implements OnInit, OnDestroy {
  readingList$ = this.store.select(getReadingList);

  subscription: Subscription;

  constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar,
    private readonly actions$: Actions
  ) {}

  ngOnInit(): void {
    this.subscription = this.actions$
      .pipe(ofType(confirmedRemoveFromReadingList))
      .subscribe(({ item }) => this.displayUndoSnackbar(item));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
  }

  displayUndoSnackbar(item: ReadingListItem): void {
    const msg = `Removed '${item.title}'`;
    const snackbar = this.snackBar.open(msg, 'Undo');
    snackbar.onAction().subscribe(() => this.store.dispatch(undoRemoveFromReadingList({ item })));
  }
}
