# Blogging-api
[![Build Status]]
[![Coverage Status]]
[![Maintainability]]
[![Test Coverage]] 

  
> Blogging-api is an api for a blogging app where users can read and post various blogs of their choice.

## Project Overview  
A Template for Blogging-api with the features below. 

## Required Features
1. Users can create an account and log in.  
2. Logged-in Users can post blogs.  
3. Logged-in users can switch their blogs between draft and published.
4. All users can view/read only published blogs. 

## Optional Features
1. Blogs can be searched by Title, Author or Tags.
2. Blogs are ordered as most read and latest.

## Technologies
* Nodejs
* Express
* Babel

## Base URL
https://blogging-api-el66.onrender.com

## API Endpoints
| Verb     | Endpoint                  | Action                                   | Description                   |
| :------- | :------------------------ | :-----------------------------           | :---------------------------- |
| GET      | /                         | Send a welcome note                      |                               |
| GET      | /blogs                    | Fetch all published blogs                |                               |
| GET      | /blogs/\<id>              | Fetch a single published blog            | `id` should be blog id        |
| GET      | /allmyblogs               | Fetch all logged-in user's blogs         |                               |
| GET      | /allmyblogs/\<id>         | Fetch a single logged-in user's blogs    | `id` should be blog id        | 
| POST     | /allmyblogs/              | Create a single blog as a logged-in user |                               |

## Setting up locally
1. Clone this repository to your local machine  
2. Cd to directory `cd Blogging-api`
3. Create `.env` file.
4. Use the format in `.env.example` file to add configure the API
5. Run `npm install` to install dependencies
6. Start app with `npm start`
  
## Test
Run `npm test`

## Live API
API is currently live at [https://blogging-api-el66.onrender.com](https://blogging-api-el66.onrender.com)

## Documentation

# ERD
(Entity relationship diagram) on Figma
[https://www.figma.com/file/RI3pAXNlW31MF9c7qvbzbr/Blog-site?type=whiteboard&node-id=814%3A334&t=yb7wBVdz57AJxFSl-1]
(https://www.figma.com/file/RI3pAXNlW31MF9c7qvbzbr/Blog-site?type=whiteboard&node-id=814%3A334&t=yb7wBVdz57AJxFSl-1)


## Discovered an issue
Did you find anything that you think should be fixed or added? Kindly create an issue so they can be resolved as soon as possible

## Author
Zion Johnson
