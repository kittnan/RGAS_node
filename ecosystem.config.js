module.exports = {
  apps: [
    {
      name: "rgas-node",
      script: "./index.js", // your script
      watch: true,
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 4051,
        DATABASE: "mongodb://10.200.90.152:27017/rgas",
        ACCESS_TOKEN_SECRET: EiKf9vBVMW0Qiu6EWgzwU7PyCdD0BLxv7ks4kTe4fXvGPDYsS3QT3wugV4ReGopt,
        REFRESH_TOKEN_SECRET: ueUlWRDDjvu7188rORSqZVuwWUVvJSyPGWw84J3HxgWmW9VKRP4RFzW2Imvb1Jr
      },
    },
  ],
};
