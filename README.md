# minerctl
[![Build status](https://ci.appveyor.com/api/projects/status/u5gdsuift0axccr8/branch/master?svg=true)](https://ci.appveyor.com/project/IlyasDeckers/minerctl-desktop/branch/master)

# Introduction
MinerCTL is a simple monitoring solution for Claymore. The desktop application acts as a monitoring agent that sends data to a backend service. Statistics can be monitored through a clean web interface. 

> **TIP:** If Claymore is running on your system you can open the application and it will catch the Claymore process. This is handy in case you run custom startup scripts, and you just need to monitor your rig.

![alt text](https://s3.eu-central-1.amazonaws.com/minerctldownloads/Capture_cropped.png "https://minerctl.eu")

## Requirements
### System
- all systems that are Windows 8/10 compatible
- min. 2GB ram
- currently NVIDIA GPU's only
- only works with ethermine.org as mining pool

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
Before we can run the build we have to create an `env.json` file in `./src`. Make sure you are registered with [Infura](https://infura.io/).

``` bash
touch src/env.json

# open the file with your text editor and use the following variables
{
  "HOME_URL": "dashboard.yourapp.com",
  "WEB3_URL": "127.0.0.1",
  "WEB3_PORT": "8545"
}
```
Now you are ready to run the build.

``` bash
# serve with hot reload at localhost:9080
npm run dev

# build MinerC.TL application for production
npm run build
```
