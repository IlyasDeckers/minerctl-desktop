# minerctl
[![Build status](https://ci.appveyor.com/api/projects/status/u5gdsuift0axccr8/branch/master?svg=true)](https://ci.appveyor.com/project/IlyasDeckers/minerctl-desktop/branch/master)

> Minerctl desktop application

## Requirements
### System
- all systems that are Windows 8/10 compatible
- min. 2GB ram
- currently NVIDIA GPU's only

### Software dependencies
The miner makes use of Claymore dual miner. To be able to start the miner Claymore v10.0.0 has to be located on your C drive `C:\Claymore_v10.0`. This will be fixed shortly.

This application relies on nvidia-smi. The program comes bundled with Nvidia's Graphics Drivers and is located under:

```
C:\Program Files\NVIDIA Corporation\NVSMI\nvidia-smi.exe
```

Later on, these dependencies will be included in the build, a.t.m. you will need to make sure that Claymore and nvidia-smi is installed correctly on your system.

## Installation
The installation has two options, run the installer (recommended) or build from the source. When you choose to build the application from the source you will need to run the backend privately as minerctl.eu will not share some of the required keys to make this application work.
### Using the installer
#### Windows
Go to the [release page](https://github.com/IlyasDeckers/minerctl-desktop/releases) and download the latest release. Run the setup and you are ready to go.

To start using the desktop application please register at [MinerCTL](https://minerctl.eu) and generate an API key under profile/settings.

#### Linux/mac
coming soon

### Compiling from the source
> Currently windows only! To use the application you need the [backend](https://github.com/IlyasDeckers/minerctl-backend) up and running, either local or hosted.

Install the latest [node version](https://nodejs.org/en/) and clone this repository to your local development machine and install the dependencies. On a fresh system 'npm install' can throw some errors, these are bound to your environment. Trace back the errors in the log and fix them accordingly

``` bash
git clone https://github.com/IlyasDeckers/minerctl-desktop.git minerctl-desktop
# install dependencies
npm install
```
Before we can run the build we have to create an `env.json` file in `./src`. Make sure you are registered with [Infura](https://infura.io/) and [Pusher](https://pusher.com/).

``` bash
touch src/env.json

# open the file with your text editor and use the following variables
{
  "HOME_URL": "backend_url",
  "INFURA_URL": "infura_url",
  "PUSHER_APP_ID": "app_id",
  "PUSHER_APP_KEY": "app_key",
  "PUSHER_APP_SECRET": "app_secret",
  "PUSHER_APP_CLUSTER": "app_cluster"
}
```
Now you are ready to run the build.

``` bash
# serve with hot reload at localhost:9080
npm run dev

# build MinerC.TL application for production
npm run build
```
---

This project was created with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
