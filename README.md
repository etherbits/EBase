#  EBase - Full-stack web application

Ebase is a Full-stack Next.js web application with the primary purpose of managing and organizing content such as movies and TV shows. Which utilizes React and SCSS for the front-end and the server-side and static rendering capabilities of NextJS.

I used this stack mainly to get more experience using production-level frameworks such as Next.js pretty much has everything a solo dev like me could ever hope for a production framework to have. While this stack is not all that widespread compared to others, it has amazing scalability and some of the best bleeding-edge features while maintaining simplicity and ease of use.  

Notable technologies used:

- React

- Iron-Session

- PostgreSQL

- Prisma

- Next.js

- SCSS

- Typescript

- Webpack

- Argon2

##  Website functionality

Users can register an account and log in using a username and a password. The password is securely hashed using the Argon2Id cryptographic hashing algorithm used for password hashing and stored in a PostgreSQL database using Prisma, an Object-Relational Mapping (ORM) library for Next.js. The account is used for storing and managing digital content. Each route verifies that the current user is authenticated using sessions stored in an encrypted cookie; if a user is not authenticated, they will be prompted to log in.

The content, which consists of movies and TV shows, is fetched from Themoviedb API. Using this API, a user can browse what's trending at the given moment, search for movies and TV shows, and get the details on a specific piece of content.

Since a lot of content is displayed at a given time, images are lazy-loaded for much faster page load speeds; also the content is fetched chunk by chunk depending on the actions of the user, so no data will be wasted if there is no use for more content.

If a user finds something worth keeping a track of he/she can easily do that with a click of a button. The piece of content will be saved to the user's private list, from where the user can manage the state of the piece of content.  

##  [Video demo](https://www.youtube.com/watch?v=yp5Uso8klBg)

This demo video demo shows off the functionality of the website. I'm from Georgia and thus not a native speaker, so I hope my pronunciation is not too horrible.

## Things that I could not complete in time
There are some things I wanted to add that did not make it in the finished product due to time constraints.

I wanted to add games to my content list using a secondary API, but I settled with only movies and TV series because I thought it was enough to capture the essence of the website I was going for in this project. 

I also wanted to add some kind of system where you could add other users as "friends" and be able to view their lists, but I would not be able to make it in time if I went with that idea. 

## Final thoughts
Overall I'm pretty happy with the project other than some incomplete things and a non-responsive user interface design. But for a project that I only had one week to make, I think it turned out alright. 

I'm certain I've become a better developer after taking this course. It was an educational and interesting journey. It was a fun ride.