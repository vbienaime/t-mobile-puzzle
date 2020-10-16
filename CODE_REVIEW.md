## Code Review ##

### Issues ###

* BookSearchComponent: When you search for a new book and the search result panel opens, the previous search results are not cleared and are visible.

* BookSearchComponent: There is not much error handling if the bookSearch API call fails - the user would not know if an error occured. This could be remedied by using the BookState attribues 'loaded' and 'error'.

### Points of Improvement ###

* In terms of functionality, I would add a button to clear the search input. As of now, you need to manually backspace the input if you want to clear the field.
    * I added this feature

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
