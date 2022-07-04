This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Description

This is a web app that displays all colleagues of 13|37. You'll be able to see the name, office, portrait, and social media links to each of the coworkers. You can also search and sort the coworkers.

## How to run

You can see it live in https://leet-coworkers-q1qn1ou7z-x-y.vercel.app/

Alternatively, you can run it locally with the following instructions

Before you start, make sure you are using node 16.

In the root of the project folder, run the following commands:
```bash
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Desgin of code

This project is built upon Nextjs Framework. It has a builtin Express API server, which makes requests to the remote API with the API key defined as build time env variables.

On the frontend side, data fetching and state management is handled by react-query. Then the data is modified by 2 hooks to apply filter and sorting, before rendered into view.

User input for sort and filter is shared between the UI components and hooks through context.  

React components follows presentation/container pattern. 

Project codebase is divided into a few folders, each named to reflect their purposes. e.g. "components" for presentational components, and "containers" for logical containers. "interfaces" for Typescript definitions(in which only the data model is placed), and "lib" for unspecific reusable logics. 

Typescript is implicitly defined, relying on IDE to infer as much as possible. Sharable Data model "Coworkers" is defined in the interface folder to allow reusing. 

Styling is built upon sass modules out of convenience. In principle all styling should stay next to the presentational components.

## Motivation of installed packages 

### Nextjs: 
1. Provides a default approach for intermediate api server. Helps in making API requests
2. Is integrated with Vercel, which provides a simple way of CI/CD and deployment.
3. Provides a good project base with lots of tools at disposal, potential for future expansions

### react-query:
1. An easy and powerful tool of managing queries. 
2. Handles data sharing between components

### axios
1. Simple way of making queries

### sass
1. Easy and well-established tool for doing styling

## Stories Selected

### Responsive design
When applying responsive design, it defines the way css would be structured(Mobile first). So it just naturely flows with the base styling itself.

### Sort by name and office
### Filter by name and office
I like writing code which involves a bit logical thinking. Formulated the structure of how these two can work together, I think it makes the project more interesting.

### Available on free public url
It comes with Vercel

### Use Typescript
I'm using it regularly, so it's easy to adapt.
