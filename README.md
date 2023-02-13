# New Project

> ✨ Bootstrapped with Create Snowpack App (CSA).

## Available Scripts

### npm start

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### npm run build

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

# Run Instructions:
To run the app, you need to install the nodejs and npm.

To install the app, you need to run the command "npm install" in the terminal.

To run the first site:
npm start https://courselab.lnu.se/scraper-site-1

To run the second site:
npm start https://courselab.lnu.se/scraper-site-2

# Project Information:

1. what is the architecture of the application?
The application has not followed a specific architecture pattern. But as a NodeJS application, it is a good practice to follow the NodeJS architecture pattern. As it is known NodeJs is a server-side application, and the architecture used is Single Threaded Event Loop, so the app function is driven by an event/s. All the functions are dependent on each other. The app uses asynchronous programming, even the chosen library "puppeteer" is using asynchronous programming. The app will start by running the getCalndersHrefs function, the function in Promise. then is executed at a certain time after the end of the main thread. So, after running the main page scrapper the second function is executed, with the returned data from the first function (thread).

The thoughts behind the architecture are to make the app as fast as possible and to make it as simple as possible. The task in the promise state method is a Microtask. The action in the main string is a macro task. This is because it is only possible to get the Microtask when the code is executed in the macro task, this will make sure that the next function will be run/executed only when the previous function is finished with the needed data (in case no error is thrown).

2. What Node concepts are essential to learn as a new programmer, when diving into Node? What would your recommendations be to a new wanna-be-Node-programmer?
NodeJS is single-threaded, so how you handle concurrency depends on the event loop. Non-blocking/asynchronous (input/output). Event-Driven: The entire program is driven by events. And because it is a single thread, a high I/O process will be moved to the event queue to wait. And after completion, it will be returned to the thread for processing through the callback function. This process of loop processing is called an event loop.

3. Are you satisfied with your application? Does it have some improvement areas? What are you especially satisfied with? Overall, I'm quite satisfied with the app. But every app/code can always be better; the structure, variables name... etc These things will not affect the functionality of the app, but they will make it better (backend). The application could be more event-driven, using Promises with the 3 states Pending, Resolved, and Rejected would make the app more capable of handling errors.

4. What is your TIL for this course part? The task I completed for this assignment involved learning how to create and import node.js modules, and how to work with non-blocking and asynchronous JavaScript. In addition, since my program is event-driven, I needed to expand my understanding of it.

5. Ensure that the README.md contains any essential details for grading, installing, starting, configuring your submission.

To run the app, you need to install the nodejs and npm. To install the app, you need to run the command "npm install" in the terminal. To run the first site: npm start https://courselab.lnu.se/scraper-site-1 To run the second site: npm start https://courselab.lnu.se/scraper-site-2
