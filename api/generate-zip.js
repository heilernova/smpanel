const { createWriteStream } = require("node:fs");
const archiver = require("archiver");

const zipName = "smpanel-api.zip";
const ouPut = createWriteStream(zipName);
const archive = archiver("zip");

archive.pipe(ouPut);
archive.directory("./dist", "/dist");
archive.file("./package.json", { name: "package.json" });

archive.on("error", () => {
    console.log("Error al generar el archivo tar");
});

archive.finalize().then(() => {
    console.log("Archivo generado");
})