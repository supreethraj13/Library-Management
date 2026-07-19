# Library-Management

    This is a Library management Apis 

# Routes

## /users
GET: to get the list of users
POST: to create a new user

## /users/:id
GET: to get the user by id
PUT: to update the user by id
DELETE: to delete the user by id (check if the user has any books issued before deleting) and (is there any fines pending)

## /users/subscriptions/:id
GET: to get the subscription details of the user by id
    >> Date of subscription
    >> validity of subscription
    >> Fine details if any

## /books
GET: to get the list of books
POST: to create a new book

## /books/:id
GET: to get the book by id
PUT: to update the book by id
DELETE: to delete the book by id (check if the book is issued to any user before deleting)

## /books/issue/
GET: get all issued books

## /books/issue/withfine
GET: get all issued books with fine details

## Subscription
    >> basic
    >> standard
    >> premium

> > if user missed renewal, then charge 100
> > if user missed subscription, then charge 100
> > if user missed subscription and renewal, then charge 200
