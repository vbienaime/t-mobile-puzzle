## Code Review ##

### Issues ###

* BookSearchComponent: When you search for a new book and the search result panel opens, the previous search results are not cleared and are visible.

* BookSearchComponent: There is not much error handling if the bookSearch API call fails - the user would not know if an error occured. This could be remedied by using the BookState attribues 'loaded' and 'error'.

### Points of Improvement ###

* In terms of functionality, I would add a button to clear the search input. As of now, you need to manually backspace the input if you want to clear the field.
    * I added this feature

* BookSearchComponent: Memory Leak with subscription

        this.store.select(getAllBooks).subscribe(books => {
            this.books = books;
            });

    This is incorrect and inconsistent with how data store changes are listened to throughout the app. 
    This would give us a memory leak as we never unsubscribe from this subscription. 
    The fix requires us to use async pipe in the template to subscribe to this observable. Another fix would be to simply unsubscribe from the observable on component destroy.

* BookSearchComponent: Image Source Property

        <img src="{{ b.coverUrl }}" alt=""/>

    The appropriate way to property bind is:

        <img [src]="b.coverUrl" alt=""/>

* BookSearchComponent: Formatting Date

        formatDate(date: void | string) {
            return date
            ? new Intl.DateTimeFormat('en-US').format(new Date(date))
            : undefined;
        }
    
    There shouldn't be a need for this function since Angular provides us with a consistent way to display dates from timestamps. We should use `DatePipe`.

* BookSearchComponent: Search Term was not being trimmed

    We are not trimming the search term before we make the api call to retrieve books. This api call actually fails if you call it with an empty string.

* Reading List Effects: Incorrect RxJs Operator (exhaustMap)

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
        ));

    The exhaustMap operator should be used to ignore any incoming events until the observable inside has completed.
    Taking a look at NgRx Effects Lifecycle hooks, The OnInitEffects effect is triggered once when the effect is added. 
    There isn't a need for the exhaustMap operator since we're only triggering the `ReadingListActions.init` action once. An appropriate operator might be `map`.
    The usage of `concatMap` make sense in the other effects because we would want add/remove book actions to be done in sequence.

* TotalCountComponent: Unused function

    `ngOnInit()` is an empty function. There's no need for this component to implement OnInit if there's nothing it needs to do on init.

* ReadingListComponent: Function parameter without type

      removeFromReadingList(item) {
            this.store.dispatch(removeFromReadingList({ item }));
        }

    There is not a huge deal but it is best practice in TypeScript to define types if you're aware of them.


## Accessibility ##

### Automated ###

* Buttons do not have an accessible name
    * Search buttons in BookSearchComponent

* Background and foreground colors do not have a sufficient contrast ratio
    * Reading List button in AppComponent
    * Book Search Placeholder Text (Try searching for a topic...) in BookSearchComponent

### Manual ###

* Book Search Input box does not have an accessible name

* "JavaScript" Search Hyperlink does not have an accessible name

* "Close Reading List" Button does not have an accessible name
