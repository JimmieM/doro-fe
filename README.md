### Overview

- Hosted URL Frontend: doro.inventable.se
- Hosted URL Backend: doro-api.inventable.se

example: https://doro-api.inventable.se/traffic/position?lat=200&lng=200

Packages/libs:

- [Frontend](https://github.com/JimmieM/doro-fe)
- [Backend](https://github.com/JimmieM/doro-be)
- [Docker](https://github.com/JimmieM/doro-docker)

Cloud provider: AWS with services EC2, Application Load Balancer, CloudFront, S3
Frontend: React SPA, TypeScript
Backend: NodeJS, NestJS, TypeScript, Docker

Frontend focus: Light-weight, comprehensive and clean UI. Easy to see and find relevant data. Responsive enough to use on most common devices.

### Focus

This solution (FE and BE) is focused on full-stack mostly. I didn't go deeper in any direction than needed to suffice the requirements of a MVP. I chose technologies and libraries I feel warm in to feel confident in delivering quality code in time.

Given the information of the test I made the assumption of knowing what the MVP would be:

- We want to pull data from the Sveriges Radion Trafik API
- A client must provide a geolocation for traffic notifications
- A client can update the geolocation for traffic notifications
- A client shows a relevant traffic incident that contains at a minimum (prio, title, location etc...)

Laying a small foundation adaptable enough to extend with more features for both Traffic and new functionality. Easy for continious implementation of clean code and seperation.

## Core technologies and why?

### FE

React with Tailwind. Of course I used Typescript.
Why Tailwind?
Since starting to code, writing css has always been lots of work. Learning all of it and then to use it effiently in a larger codebase. As much as love writing UI. Laying the groundworks takes a lot of time. From writing reusable classes to implementing the actual design guide and so on. Don't even begin with responsiveness. Getting a quick responsive feel with Tailwind's media query prefixes is really comfortable. Same with accessibilty.

#### Tailwind rant - optional

I've tried out many libraries and ways to improve styling. From simplifying classic css with scss to styled components, Bootstrap, stitches UI. Over to bigger libraries such as Material UI and Chakra UI. Having a bigger library for this application now seems overkill at best.

Tailwind's learning curve can be quite steep, but writing code has never been more enjoyable for me. Most templating, excessive css and styling is minified. There's a tradeoff for the html to grow and become unreadable (which personally I don't agree with).. If the html becomes too large with tailwind, it's usually too large without tailwind. More concise and reusable components which needs reusable css. Is usually as well contained in their components, just without their css files.

Move fast, change fast. In regards of having no guides to follow in design. Myself not being quite sure how I want it to look. I made a choice of not showing off my pure css-skills. In favor of having a easier way to work and easily modify this "MVP". Also giving me the possibility to put more time on other areas.

### BE

NodeJS with Typescript. I find NodeJS very easy to work with generally. A simple web API has never been cleaner with NestJS for example.

### CI/CD

Docker. Docker is undeniably great. Since the Frontend is being served as a SPA on CDN (Cloudfront ex.), only the backend is deployed with Docker.

I created a seperate package [doro-docker](https://github.com/JimmieM/doro-docker) to contain Docker related scripts and deployment. It's a simple enough deployment where the Docker package is pulled onto an EC2, in this example. Run some scripts to install docker and docker-compose. Then a custom script to build the image by pulling the BE from GitHub. Would be better to store the image on AWS (ECS) or Docker but this is efficient enough.

## General infrastructure

#### AWS

The frontend is served on an S3 bucket with CloudFront CDN on top.

The backend is deployed onto an EC2 which is connected to an Application Load Balancer.

## Why not "fullstack"?

NextJS would actually be pretty sweet here. Generally I don't like the idea of mixing frontend with backend. I'd love to see actual seperation of concern. For this case, the size of the project, it would actually be beneficial/efficient .
However, given the requirement of perhaps multiple clients (ios, android and web), why not make the API an actual API? Or the frontend an actual frontend.

## Dependencies and why?

### Shared

- We're using Axios for HTTP communication on both FE and BE.
  Why? Axios is great! Easy to use and efficient interceptors to handle authentication etc. JS internal "fetch" has improved quite a lot recently though.
- Prettier and ESlint. Just standard config for the moment. Nothing special really.

### FE

- Tailwind & HeadlessUI.
- Create React App. Since I didn't see the need for multiple pages, or even SSR. I decided to go with a clean CRA. Downsides. Of course.
- Google Maps
- Zustand. It's amazing. Zustand is like a global state hook. Doesn't fit all uses-cases, but sure do have a spot for this. User position and traffic items are stored like this. Prevent prop-drilling when needing Position in different places for example.

### BE

- NestJS. It builds on top of Express makes middleware, interceptors and whatever you can imagine, so much cleaner code and efficient reusable components.
  Usually I don't pack logic/business in my API. I create specific microservices or library/packages for such needs. However in this case, it seemed efficient since the logic is quite small, for the moment at least.
- XML2JSON. Dealing with XML is always a haggle if you're super comfy in JSON. Decided to not put too much work into parsing. XML2JSON helps out a bunch of parsing XML into JSON for me to quickly use in the backend's Model Factories.

## What did I do and why?

### FE

UI-wise, I didn't have a clear vision. For starter I wanted a list with map view option, with a clean indication of the users position. I don't want changing position or anything to be a haggle so just think simple. Provided by a simple button in the left top corner and the content (map/view) in the center.
Clicking the button should simply provide the user with a map to select another position, if wanted.

Most components are written to be reusable. Such as buttons, toggles, cards and modals.

State is managed by Zustand. In this case we only have the one "Traffic hook". But it's easily scalable. Same with API, being dettached into it's own class for seperation and mocking for tests. Nothing special.

There's no routing in place given the only page is the "traffic page".

Structuring-wise I tried to make it possible, even easier to build upon existing features. Adding more stuff. Maybe Traffic is only one feature.
Given the Bonus requirements you removed, a user (settings, sms etc) is a feature it-self, and perhaps equally if not a bigger one.

Generally I see a lot to be polished and improved on the frontend. Overall I'm pretty happy with it. Just details of information and data, could be way more improved.
Added some cool extra stuff in the front-end just because I got too excited about it. Like search and keep a viewing history to easy go back and read an item.
Being able to locate a traffic item on the map by first finding in the list is pretty sweet too.

#### Key issues to be resolved/improved upon.

- If you have a recently viewed traffic item based in another location than your current. You won't be able to see it on the map, since we're only populating both map and list with current items based on position. Interest ways to solve this.
- When selecting a new position with the map, sometimes the selected position marker won't show. I can't reproduce this, and it's super weird. Still have some research to do regarding the Maps package, since it's a relatively new one I haven't used before.
- Modal widths could be improved.
- Missing implementation of context/auth and/or routing. Given this is very easy to add upon, but not needed due to no implementation of notifications & users.

### BE

I don't want to make it complicated. But not too coupled...
Simply the Traffic Controller will ask the Traffic Service for messages for certain area.
The Traffic Service will check with the Area Service to retreive correct area name for given position.
The Area Service basically has an API to connect to SR. When XML is retreived, its being parsed by an "Traffic XML parser", which itself is just an extension of a XML parser (very small class I wrote to encapsulate these things). The Area Service also has it own model factory to convert XML/DTO from SR into usably Models for our applications. The Messages Service works in the same way.

This gives the Traffic Service a "parent" status or a monolithic pattern. Maybe too much dependecies. But I feel it's okay for this circumstance.

Area and messaging are two different concerns in SR's API. Given it should behave the same in ours. Not because we have too, but because it makes sense in our case as well.

Note the Traffic Area Service and Traffic Message Service is indeed very small and maybe doesn't yet need to be encapuslated.

#### Issues to be resolved/improved upon.

- Weird XML parsing where wrapping element "Messages" of the messages response, being transformed into an Object of {Message: IMessage[]}. As mentioned, not too much focus on a perfect XML to JS/JSON parser..
  My reasoning it that SR's XML response looks the same with "SR" being the wrapper, then next element is "Areas" or "Messages". By having a XML parser, then configured for SR's response to account for their wrappers (to access the data we want). To extend the class, add a node selector parameter. Doing this.. Feels okay. For this I think it's good enough.
  We've opened the possibility to get more data with XML easier.

## Testing

I've written tests to cover the lowest functionality. No E2E or integration. Rather unit tests covering the general flow of a specific service while mocking the actual API call. Making sure the data is being processed properly by low XML test.

#### Thank you for reading! Criticism is highly appreciated.

[dontClickThisLink](https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley)

### `npm start`. Dont forget the npm install.

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
