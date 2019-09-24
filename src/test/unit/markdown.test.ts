import { expect } from "chai";

import * as mut from "../../lib/markdown";

describe("markdown_utils.ts", () => {
    describe("getMetaSection", () => {
        it("shall return empty on invalid section", async () => {
            // prettier-ignore
            const text = [
                "###### INVALID",
                "",
                "foo: bar",
                "bar: foo",
                "",
                "###### meta end",
                "stuff"
            ].join("\n");

            const expected = "";

            const result = mut.getMetaSection(text);

            expect(result).equals(expected);
        });
        it("shall return the parsed section", async () => {
            // prettier-ignore
            const text = [
                "###### meta start",
                "",
                "foo: bar",
                "bar: foo",
                "",
                "###### meta end",
                "stuff"
            ].join("\n");

            // prettier-ignore
            const expected = [
                "foo: bar",
                "bar: foo"
            ].join("\n");

            const result = mut.getMetaSection(text);

            expect(result).equals(expected);
        });
    });

    describe("getMeta", () => {
        it("shall return the parsed section", async () => {
            // prettier-ignore
            const text = [
                "###### meta start",
                "",
                "foo: bar",
                "bar: foo",
                "",
                "###### meta end",
                "stuff"
            ].join("\n");

            const result = mut.getMeta(text);
            expect(result).deep.equals({ foo: "bar", bar: "foo" });
        });
    });

    describe("getMetaDict", () => {
        it("shall return an empty meta", async () => {
            const text = "";
            const expected = {};

            const result = mut.getMetaDict(text);
            expect(result).deep.equals(expected);
        });

        it("shall return a populated meta", async () => {
            // prettier-ignore
            const text = [
                "foo: bar",
                "bar: foo"
            ].join("\n");

            const expected = {
                foo: "bar",
                bar: "foo"
            };

            const result = mut.getMetaDict(text);
            expect(result).deep.equals(expected);
        });
    });

    describe("stripMetaSection", () => {
        it("shall strip the meta section", async () => {
            // prettier-ignore
            const text = [
                "###### meta start",
                "",
                "foo: bar",
                "bar: foo",
                "",
                "###### meta end",
                "stuff"
            ].join("\n");

            const expected = "stuff";
            const result = mut.stripMetaSection(text);

            expect(result).equals(expected);
        });
    });
});
