import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList, undoRemoveFromReadingList } from '@tmo/books/data-access';
import { ReadingListItem } from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store, private readonly snackBar: MatSnackBar) { }

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
    this.displayUndoSnackbar(item);
  }

  displayUndoSnackbar(item: ReadingListItem): void {
    const msg = `Removed '${item.title}'`;
    const snackbar = this.snackBar.open(msg, 'Undo');
    snackbar.onAction().subscribe(() => this.store.dispatch(undoRemoveFromReadingList({ item })));
  }
}
