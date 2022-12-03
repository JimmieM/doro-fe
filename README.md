### About the test.

- Hosted URL Frontend: doro.inventable.se
- Hosted URL Backend: doro-api.inventable.se

example: https://doro-api.inventable.se/traffic/position?lat=200&lng=200

### Overview

Packages/libs:

- [Frontend](https://github.com/JimmieM/doro-fe) (you're here)
- [Backend](https://github.com/JimmieM/doro-be)
- [Docker](https://github.com/JimmieM/doro-docker)

Cloud: AWS

### Focus

This solution (FE and BE) is focused on full-stack mostly. I didn't go deeper in any direction than needed to suffice the requirements of a MVP.

Given the information of the test I made the assumption of knowing what the MVP would be:
-We want to pull data from the Sveriges Radion Trafik API
-A client must provide a geolocation for traffic notifications
-A client can update the geolocation for traffic notifications
-A client shows a relevant traffic incident that contains at a minimum (prio, title, location etc...)
Not knowing what's to come, given my decisions of working on it as "blackbox". It's not over-engineered to account for everything in the future, but not closed up making it hard to extend.

Laying a small foundation, not bigger than needed, but broad enough to implement clean code and seperation. The backend being adaptable to extend with more features for both Traffic and new functionality.
Same goes for frontend. What's missing is base implementation of context/auth and/or routing. Given this is very easy to add upon, but not yet needed.
Having reusable smaller components such as buttons, input, toggles & even some hooks, it could easily be extended, IMHO. I don't find any modules being too highly coupled either.

#### thinking openly.

A clear guide/vision has been layed on how to work the project. If we'd like a new module for another traffic resource other than Areas and Messages. It could easily be extended with the architecture in place. Add an API, Service and model factory if needed. Append new "sub service" to our Traffic service, if it doesn't break concerns and seperation too hard.

Let's say another feature would be "User". There we'd include perhaps a phonenumber or some kind of notification token (iOS, Android) along with user data and/or settings.
Another parent module such as ("traffic") would be created. For this instance "User". This time we don't want API, rather a repository and database.

// Just an idea.

- User
  - user.service.ts
  - user.repository.ts
  - user.query.ts
  - Notification
    - notification.service.ts
    - ios.notification.api.ts
    - android.notification.api.ts

Frontend implementation for this would also be super easy. Adding another API and state-hook ("Zustand"). Pages and custom modules, upon adding the reusable components.

## Core technologies and why?

### FE

React with Tailwind. Of course I used Typescript. The website is fully responsive.

### BE

NodeJS with Typescript. I find NodeJS very easy to work with generally. A simple web API has never been cleaner with NestJS for example.
.NET core is a true love, but that's another discussion.

### CI/CD

Docker. Docker is undeniably great. Since the Frontend is being served as a SPA on CDN (Cloudfront ex.), only the backend is deployed with Docker.

I created a seperate package (doro-docker) to preserve Docker related scripts and deployment. It's a simple enough deployment where the Docker package is pulled onto an EC2, in this example. Run some scripts to install docker and docker-compose. Then a custom script to build the image by pulling the BE from GitHub. Would be better to store the image on AWS (ECS) or Docker but this is efficient enough.

## General infrastructure

#### AWS <3

The frontend is served on an S3 bucket with CloudFront CDN on top.

The backend is deployed onto an EC2 which is connected to an Application Load Balancer.

## Why not "fullstack"???

NextJS would actually be pretty sweet here. Generally I don't like the idea of mixing frontend with backend. I'd love to see actual seperation of concern. For this case, the size of the project, it would actually be beneficial/efficient .
However, given the requirement of perhaps multiple clients (ios, android and web), why not make the API an actual API? Or the frontend an actual frontend.

## Dependencies and why?

### Shared

- We're using Axios for HTTP communication on both FE and BE.
  Why? Axios is great! Easy to use and efficient interceptors to handle authentication etc. JS internal "fetch" has improved quite a lot recently though.
- Prettier and ESlint. Just standard config for the moment. Nothing special really.

### FE

- Tailwind/HeadlessUI. I just love it. It's super simple and easy to get an UI up and running. I didn't need any fancy functionality such as Material UI (where lots of computation and logic is "off the shelf")
- Create React App. Since I didn't see the need for multiple pages, or even SSR. I decided to go with a clean CRA. Downsides. Of course.
- Google Maps. I went for a walk and imagined the UI, and Google Maps just seemed awesome for it. At least give the user an option!
  As soon as the general modelling etc is done, implementing Google Maps wasn't such a hassle. Made a very similar thing in 2019. https://www.jimmiem.se/portfolio.html.
  Also picking your position just seemed easier with Maps, as well as easier for the consumer. Type your coordinates manually? Who even does that nowadays.
- Zustand. Don't get me started on Zustand. It's amazing. State-management just got easy. Tired of boilerplate and unnessecary code? Zustand is literally like a global state hook. Doesn't fit all uses-cases. But sure do have a spot for this. I like working with it and saw a great opportunity to contain state.

### BE

- NestJS. This might be unfamiliar with you guys, but I assure you, it's as easy as it looks. It builds on top of Express makes middleware, interceptors and whatever you can imagine, sooo much cleaner code and efficient reusable components.
  I find NestJS to do a great job in setting up API's. Usually I don't pack logic/business in my API. I create specific microservices or library/packages for such needs. However in this case, it seemed efficient since the logic is quite small, for the moment at least.
- XML2JSON. Dealing with XML is always a haggle if you're super comfy in JSON. Decided to not put too much work into parsing. XML2JSON helps out a bunch of parsing XML into JSON for me to quickly use in the backend's Model Factories.

## What did I do and why?

### Frontend.

UI-wise, I didn't have a clear vision. I just wanted a List/map view, with a clear indication of the users position. I don't want changing position or anything to be a haggle so just think simple. Provided by a simple button in the left top corner and the content (map/view) in the center, to begin with.
Clicking the button shall simply provide the user with a map to select another position, if wanted.
The map view was the last thing I made, given it's not a requirement. Again, it should be ;)

Most components are written to be reusable. Such as buttons, toggles, cards and modals.

State is managed by Zustand. In this case we only have the one "Traffic hook". But it's easily scalable. Same with API, being dettached into it's own class for seperation and mocking for tests. Nothing special.

There's no routing in place given the only page is the "traffic page".

Structuring-wise I tried to make it possible, even easier to build upon existing features. Adding more stuff. Maybe Traffic is only one feature.
Given the Bonus requirements you removed, a user (settings, sms etc) is a feature it-self, and perhaps equally if not a bigger one.

Generally I see a lot to be polished and improved on the frontend. Overall I'm pretty happy with it. Just details of information and data, could be way more improved.
Added some cool extra stuff in the front-end just because I got too excited about it. Like search and keep a viewing history to easy go back and read an item.
Being able to locate a traffic item on the map by first finding in the list is pretty sweet too.

#### Issues to be resolved/improved upon.

- If you have a recently viewed traffic item based in another location than your current. You won't be able to see it on the map, since we're only populating both map and list with current items based on position. Interest ways to solve this.
- When selecting a new position with the map, sometimes the selected position marker won't show. I can't reproduce this, and it's super weird. Still have some research to do regarding the Maps package, since it's a relatively new one I haven't used before.
- Modal widths could be improved.

### Backend

I love architecture and seperation of concerns. Everything in-between. My head itches when I know I can make something even easier or better, clearer, whatever.

I decided to follow a simple rule when desiging the backend. Don't make it complicated, but not too simple either. Fine line..
Simply the Traffic Controller will ask the Traffic Service for messages for certain area.
The Traffic Service will check with the Area Service to retreive correct area name for given position.
The Area Service basically has an API to connect to SR. When XML is retreived, its being parsed by an "Traffic XML parser", which itself is just an extension of a XML parser (veeeeeery small class I wrote to encapsulate these things). The Area Service also has it own model factory to convert XML/DTO from SR into usably Models for our applications. The Messages Service works in the same way.

This gives the Traffic Service a parent-state. Maybe too much dependecies. But I feel it's okay for this.

Area and messaging are two different concerns in SR's API. Given it should behave the same in ours. Not because we have too, but because it makes sense in our case.

Note the Traffic Area Service and Traffic Message Service is indeed very small and maybe doesn't need to be encapuslated as yet.

Wanted to build it in a way where the backend uses cron job to fetch SR api every x minutes. Save result in DB. Then based on position given by client, just get the saved data instead of spamming SR's API lol. It's super similar to my app, Cue, where I fetched data from the Police API, process it and by some cool code, find out exactly where the crime/info happened (they just set lat & lng to the same, no matter the crime..). That was the whole idea with Cue.

#### Issues to be resolved/improved upon.

- Weird XML parsing where wrapping element "Messages" of the messages response, being transformed into an Object of {Message: IMessage[]}. As mentioned, not too much focus on a perfect XML to JS/JSON parser..
  My reasoning it that SR's XML response looks the same with "SR" being the wrapper, then next element is "Areas" or "Messages". By having a XML parser, then configured for SR's response to account for their wrappers (to access the data we want). To extend the class, add a node selector parameter. Doing this.. Feels okay. For this I think it's good enough.
  We've opened the possibility to get more data with XML easier.

### Other stuff I can mention.

- Unfortunately the Git commit history isn't as detailed as I'd like. Due to me being to eager coding.
-

### Note. Pls dont steal my Maps API key. Due to assessment of data and security, the .env files is commited. Bad practice generally IMO.

### `npm start`. Dont forget the npm install.

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
