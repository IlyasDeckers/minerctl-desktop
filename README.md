# minerctl

> Minerctl desktop application

### Requirements
#### System
All systems that are Windows 8/10 compatible.

#### Software
The miner makes use of Claymore dual miner. To be able to start the miner Claymore v10.0.0 has to be located on your C drive `C:\Claymore_v10.0`. This will be fixed shortly.

This application relies on nvidia-smi. The program comes bundeled with Nvidia's Graphics Drivers and is located under:

```
C:\Program Files\NVIDIA Corporation\NVSMI\nvidia-smi.exe
```

Here is a download link.

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build MinerC.TL application for production
npm run build
```
---

This project was created with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
