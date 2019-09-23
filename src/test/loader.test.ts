import compiler from "./compiler";

describe("Loader", () => {
    it("should compile", async () => {
        const stats = await compiler("./assets/thing.js", {});

        const modules = stats.toJson().modules!;
        console.log("Modules: ", modules);

        const output = stats.toJson().modules![0].source;

        console.log(output);
    });
});
