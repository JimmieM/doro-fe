### About the test.

### Technologies and why?

## FE

- React with Tailwind. Of course I used Typescript. What kind of question is that.
  I just enjoy being able to catch bugs during dev time. What type is that variable? Idk.

## BE

NodeJS with Typescript. I find NodeJS very easy to work with generally. A simple web API has never been cleaner with NestJS for example.
.NET core is a true love, but that's another discussion.

## CI/CD

Docker. Docker is undeniably the s##t.

## Why not "fullstack"???

NextJS would actually be pretty sweet here. Generally I don't like the idea of mixing frontend with backend. I'd love to see actual seperation of concern. For this case, the size of the project, it would actually be beneficial.
However, given the requirement of perhaps multiple clients (ios, android and web), why not make the API an actual API? Or the frontend an actual frontend.

### Dependencies and why?

## Shared

- We're using Axios for HTTP communication on both FE and BE.
  Why? Axios is great! Easy to use and interceptors to handle authentication. JS internal "fetch" has improved quite a lot recently though.
- Prettier and ESlint. Just standard config for the moment. Nothing special really.

## FE

- Tailwind/HeadlessUI. I just love it. It's super simple and easy to get an UI up and running. I didn't need any fancy functionality such as Material UI (where lots of computation and logic is "off the shelf")
- Create React App. Since I didn't see the need for multiple pages, or even SSR. I decided to go with a clean CRA. Downsides. Of course.
- Google Maps. I went for a walk and imagined the UI, and Google Maps just seemed awesome for it. At least give the user an option!
  As soon as the general modelling etc is done, implementing Google Maps wasn't such a hassle. Made a very similar thing in 2019. https://www.jimmiem.se/portfolio.html.
  Also picking your position just seemed easier with Maps, as well as easier for the consumer. Type your coordinates manually? Who even does that nowadays.
- Zustand. Don't get me started on Zustand. It's amazing. State-management just got easy. Tired of boilerplate and unnessecary code? Zustand is literally like a global state hook. Doesn't fit all uses-cases. But sure do have a spot for this. I like working with it and saw a great opportunity to perserve state.

## BE

- NestJS. This might be unfamiliar with you guys, but I assure you, it's as easy as it looks. It builds on top of Express makes middleware, interceptors and whatever you can imagine, sooo much easier and cleaner.
  I find NestJs to do a great job in setting up API's. Usually I don't pack logic/business in my API. I create specific microservices or library/packages for such needs. However in this case, it seemed efficient since the logic is quite small, at the moment at least.
- XML2JSON. Dealing with XML is always a haggle if you're super comfy in JSON. Decided to not put too much work into parsing. XML2JSON helps out a bunch of parsing XML into JSON for me to quickly use in the backend's Model Factories.

### What did I do and why?

## Frontend.

UI-wise, I didn't have a clear vision. I just wanted a List/map view, with a clear indication of the users position. I don't want changing position or anything to be a haggle so just think simple. Provided by a simple button in the left top corner and the content (map/view) in the center, to begin with.
Clicking the button shall simply provide the user with a map to select another position, if wanted.
The map view was the last thing I made, given it's not a requirement. Again, it should be ;)

Most components are written to be reusable. Such as buttons, toggles, cards and modals.

State is managed by Zustand. In this case we only have the one "Traffic hook". But it's easily scalable. Same with API, being dettached into it's own class for seperation and mocking for tests. Nothing special.

There's no routing in place given the only page is the "traffic page".

Structuring-wise I tried to make it possible, even easier to build upon existing features. Adding more stuff. Maybe Traffic is only one feature.
Given the Bonus requirements you removed, a user (settings, sms etc) is a feature it-self, and perhaps equally if not a bigger one.

Generally I see a lot to be polished and improved on the frontend. Overall I'm pretty happy with it. Just details of information and stuff could be way more improved.
Maybe colored priorities. Red if its superduper prioritised, green, orange. You get the gist.

## Backend

I love architecture and seperation of concerns. Everything in-between. My head itches when I know I can make something even easier or better, clearer, whatever.

I decided to follow a simple rule when desiging the backend. Don't make it complicated, but not too simple either. Fine line..
Simply the Traffic Controller will ask the Traffic Service for messages for certain area.
The Traffic Service will check with the Area Service to retreive correct area name for given position.
The Area Service basically has an API to connect with SR. When XML is retreived, its being parsed by an "Traffic XML parser", which itself is just an extension of a XML.parser (veeeeeery small class I wrote to encapsulate these things). It also has it own model factory to convert XML/DTO from SR into usably Models for our applications. The Messages Service works in the same way.

This gives the Traffic Service a parent-state. Maybe too much dependecies. But I feel it's okay for this.

Area and messaging are two different concerns in SR's API. Given it should behave the same in ours. Not because we have too, but because it makes sense in our case.

Note the Traffic Area Service and Traffic Message Service is indeed very small and maybe doesn't need to be encapuslated as yet.

Wanted to build it in a way where the backend uses cron job to fetch SR api every x minutes. Save result in DB. Then based on position given by client, just get the saved data instead of spamming SR's API lol. It's super similar to my app, Cue, where I fetched data from the Police API, process it and by some cool code, find out exactly where the crime/info happened (they just set lat & lng to the same, no matter the crime..). That was the whole idea with Cue.

### Focus

This solution (FE and BE) is focused on full-stack mostly. I didn't go deeper in any direction than needed to suffice the requirements.

### Other stuff I can mention.

### Note. Pls dont steal my Maps API key.

### `npm start`. Dont forget the npm install.

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
