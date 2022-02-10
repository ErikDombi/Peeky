# Peeky
![PeekyBanner](https://user-images.githubusercontent.com/23159219/153456801-6d09b526-ddec-4e73-b6ca-5b15a98ca8b6.png)
[![Chrome Extension Build](https://github.com/ErikDombi/Peeky/actions/workflows/chrome-extension-build.yml/badge.svg)](https://github.com/ErikDombi/Peeky/actions/workflows/chrome-extension-build.yml) [![VSCode Extension Build](https://github.com/ErikDombi/Peeky/actions/workflows/vscode-extension-build.yml/badge.svg)](https://github.com/ErikDombi/Peeky/actions/workflows/vscode-extension-build.yml)

Visual Studio Code &amp; Chrome Extension to open partial views using the xray-rails gem

## Installation

Both extensions are required for Peeky to work
* [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ErikDombi.peeky-xray)
* [Chrome Web Store](https://chrome.google.com/webstore/detail/peeky/bappgkfblakjanjkbebkpkaoimfhhpkk?hl=en&authuser=0)

## Usage

To start Peeky, look for the 'Peeky: Inactive' button in Visual Studio's status bar.
Clicking this button will start Peeky's listener.
* Note: Starting Peeky will stop Peeky in any other Visual Studio Code instance running.

![4x6jxtNUAe](https://user-images.githubusercontent.com/23159219/153323713-797ad19c-d22d-47a8-b18e-53390538710c.png)

Once you see 'Peeky: Active' in your status bar, you are ready to start using the chrome extension.
Simply click on any element and select "Show partial in VS Code", VS Code will then open the file containing the selected element.
* Note: Peeky will only work on sites using the xray-rails gem.

![s1PEMvHMbK](https://user-images.githubusercontent.com/23159219/153323901-77265848-36db-4084-a459-c18740e419d5.png)

## Building

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)
* [Visual Studio Code](https://code.visualstudio.com/)

## Setup (Per Project)

```
npm install
```

## Import as Visual Studio Code project

## Build

```
npm run build
```

## Build in watch mode

### Terminal

```
npm run watch
```

### Visual Studio Code

Run extension.

Press `F5`

## Test
`npx jest` or `npm run test`
