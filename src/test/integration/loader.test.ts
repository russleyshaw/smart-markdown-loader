import { expect } from "chai";
import * as path from "path";

import compiler from "./compiler";

describe("loader.ts", () => {
    it("shall load properly", async () => {
        const basePath = "./assets/valid/";
        const jsPath = path.join(basePath, "index.js");
        const mdPath = path.join(basePath, "home.md");

        const stats = await compiler(jsPath);

        const modules = stats.toJson().modules!;
        expect(modules).to.exist;

        const assets = stats.toJson().assets!;
        expect(assets).to.exist;

        const jsModule = modules.find(m => comparePaths(m.name, jsPath))!;
        expect(jsModule).to.exist;
        const mdModule = modules.find(m => comparePaths(m.name, mdPath))!;
        expect(mdModule).to.exist;

        expect(mdModule.assets).has.members([
            "2bee5fa6951ff69c24b9503146393efee731a07d.png",
            "afd5c27ad81612ea7c95181dab57f57845a06c5f.md"
        ]);

        expect(mdModule.source).contains('"title":"home"');
        expect(mdModule.source).contains('"author":"russley"');
    });
});

function comparePaths(p1: string, p2: string): boolean {
    return path.normalize(p1) === path.normalize(p2);
}
