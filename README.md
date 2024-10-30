# DrBogomaz
> Misha Bogomaz Professional Blog

I built this project for my brother, who is a therapist, when he started his own private practice during the pandemic. 

He wanted:
- a landing page to explain his qualifications and services offered
- a way for his clients to contact him
- a blog that he could update himself, in a no-code way

Stretch goal: offer potential clients a way to toggle languages from the browser

To meet the requirements, I used:
- a CMS (Storyblok) that my brother could use to update copy and photos
- a free form API (FormCarry).

Storyblok is meant to be used headless, which suited me, because I wanted to focus on showcasing my skills on the front end. I used Vercel for deployment for the same reason; I did not want to get bogged down either with a complex backend or dev ops.

I did set up the multilanguage capabilities, following a Storyblok tutorial, but that feature never went to production. I never got translated copy to use for the app, and my brother became a director of the Psychology Department at University of Florida, which did not leave him a lot of time to write a blog or work on his private practice.

Since the technology used for this app is so outdated, I will likely do a rewrite in Nuxt 3, in which case I will not bother with a CMS, but I might still tinker with translation, just because it's cool.

Currently, there is a deployment issue with Vercel that I need to fix, so updates are not going to production. Also, I can't run this locally without a whole bunch of updates, but these are the instructions to run it once this issue is resolved: https://github.com/users/mariajcb/projects/1/views/1?pane=issue&itemId=84943422&issue=mariajcb%7Cstoryblok-drbogomaz%7C33.

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
