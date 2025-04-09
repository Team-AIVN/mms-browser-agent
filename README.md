# 🚀 Welcome to your new awesome project!

This project has been created using **webpack-cli** and requires **pnpm** to build, you can now run

```
pnpm run build:prod
```

to bundle your application

# Re-compiling protobuf bindings using the protoc compiler
From the root directory run
```
protoc -I=. --ts_out=. smmp.proto 
```
This will produce `smmp.d.ts` and `smmp.js` 