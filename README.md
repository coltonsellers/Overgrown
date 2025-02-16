# Overgrown

Overgrown is a web extension that grows vines, flowers, grass, and other plants across the browser screen. The longer specific tabs are open
(websites specified by the user - ex. YouTube, Netfix, Spotify, etc.), the more overgrowth will appear across the user's screen, blocking
out elements of the page, and encouraging the user to step away for a bit or be more productive.

# Installation and Setup

Clone the GitHub repository into your code manager:

```
"git clone <repo URL>"
```

Then run the following commands in the terminal:
<br/>

```
npm install
```

and

```
npm install vite-plugin-static-copy
```

**To run:**
Start by running this command in the terminal:

```
npm run build
```

Go to chrome extensions, make sure you are in developer mode, then load unpacked on the build folder.
<br/>
Once you have it packed the first time, to update the build, you can run build again in the terminal and refresh the extension from the chrome extensions page.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
