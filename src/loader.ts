import { loader } from "webpack";
import * as path from "path";

import loaderUtils from "loader-utils";
import validateOptions from "schema-utils";

import { readMetadata, getImageUrls, stripMetadata } from "./lib";
import { RawSourceMap } from "source-map";
import { asyncResolve, asyncLoadModule, asyncReadFile, hashFilename } from "./util";

const schema = {
    type: "object",
    properties: {
        publicPath: {
            type: "string"
        }
    }
};

export interface MarkdownResolveData {
    meta: Record<string, string>;
    url: string;
}

export default function(this: loader.LoaderContext, content: string, map: RawSourceMap, meta: any) {
    this.emitWarning(`This Context: ${this.context}`);
    this.emitWarning(`Root Context: ${this.rootContext}`);
    this.emitWarning(`This Resource Path: ${this.resourcePath}`);

    const options = loaderUtils.getOptions(this) || {};
    validateOptions(schema, options, "Smart Markdown Loader");

    const strippedContent = stripMetadata(content);
    const imageUrls = getImageUrls(content);

    for (const url of imageUrls) {
        const imgResourcePath = path.resolve(this.context, url);
        const filename = hashFilename(imgResourcePath);
        this.emitWarning(`Img Resource: ${imgResourcePath}`);
        this.emitWarning(`Filename: ${filename}`);

        const imgContent = this.fs.readFileSync(imgResourcePath);
        this.emitFile(filename, imgContent, {});
    }

    const publicPath = hashFilename(this.resourcePath);
    this.emitFile(publicPath, strippedContent, map);

    const result: MarkdownResolveData = {
        meta: readMetadata(content),
        url: publicPath
    };

    return `export default ${JSON.stringify(result)}`;
}
