import { cpSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));
const targetRoot = fileURLToPath(new URL("../dist/", import.meta.url));

function copyCssFiles(currentPath) {
  for (const entry of readdirSync(currentPath)) {
    const entryPath = join(currentPath, entry);
    const stats = statSync(entryPath);

    if (stats.isDirectory()) {
      copyCssFiles(entryPath);
      continue;
    }

    if (!entryPath.endsWith(".css")) {
      continue;
    }

    const relativePath = relative(sourceRoot, entryPath);
    const outputPath = join(targetRoot, relativePath);
    mkdirSync(dirname(outputPath), { recursive: true });
    cpSync(entryPath, outputPath);
  }
}

copyCssFiles(sourceRoot);
