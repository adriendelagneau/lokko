import fs from "fs";
import path from "path";

import { parse } from "csv-parse/sync";



const geojsonPath = path.resolve("./public/france-communes/56.geojson"); // GeoJSON d’un département
const csvPath = path.resolve("./public/cog.csv"); // CSV COG communes
const outputPath = path.resolve("./public/communes-dept/56_enriched.geojson"); // sortie

// 1️⃣ Lire le GeoJSON
const geojsonRaw = fs.readFileSync(geojsonPath, "utf-8");
const geojson = JSON.parse(geojsonRaw);

// 2️⃣ Lire et parser le CSV
const csvRaw = fs.readFileSync(csvPath, "utf-8");
const records = parse(csvRaw, {
  columns: true,
  skip_empty_lines: true,
});


// 3️⃣ Créer un lookup pour retrouver les codes par code_commune
const communeLookup: Record<string, any> = {};
for (const row of records) {
  communeLookup[row["COM"] /* code commune dans CSV */] = {
    canton_code: row["CT"] /* code canton */,
    dept_code: row["DEP"] /* code département */,
    region_code: row["REG"] /* code région */,
    commune_name: row["NOM"] /* nom commune */,
  };
}

// 4️⃣ Enrichir chaque feature du GeoJSON
geojson.features = geojson.features.map((feature: any) => {
  const codeCommune = feature.properties.code; // doit correspondre à la colonne COM
  const data = communeLookup[codeCommune];
  if (data) {
    feature.properties = {
      ...feature.properties,
      ...data, // ajoute canton_code, dept_code, region_code
    };
  } else {
    console.warn(`Commune non trouvée dans CSV: ${codeCommune}`);
  }
  return feature;
});

// 5️⃣ Sauvegarder le GeoJSON enrichi
fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2), "utf-8");
console.log("GeoJSON enrichi généré :", outputPath);
