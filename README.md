# wiki scraper

## about
sachen dingsen leicht gemacht

## setup

### tested with
- MacBook Air (M2, 2022), running macOS Ventura (v13.3.1)
- Docker v20.10.24
- NodeJs (v20.0.0)
- Npm (v9.6.4)

### prerequisites
- NodeJs
- Npm

### development setup
1. clone the repo: `$ git clone https://github.com/LinusBolls/wiki-scraper`.

2. run `$ npm i` to install the required dependencies.

3. run `$ npm run build` to create the `/dist` folder with the transpiled javascript. this step is required after changing the source code.

4. run `$ npm run start` to execute the transpiled javascript.