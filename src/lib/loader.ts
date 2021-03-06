import { loader } from "webpack";
import * as path from "path";
import loaderUtils from "loader-utils";
import validateOptions from "schema-utils";
import * as _ from "lodash";

import fm from "front-matter";

import { getImageUrls } from "./markdown";
import { RawSourceMap } from "source-map";
import { hashFilename, replaceAll, Dict } from "./util";

const schema = {
    type: "object",
    properties: {
        publicPath: {
            type: "string"
        },
        outputPath: {
            type: "string"
        }
    }
};

/**
 * Emitted result of loader.
 */
export interface MarkdownResolveData {
    /**
     * URL to the markdown file.
     */
    url: string;

    /**
     * Meta/Front-matter data from the markdown file.
     */
    meta: Dict<string, any>;
}

export default function(this: loader.LoaderContext, content: string, map: RawSourceMap, meta: any) {
    // Loader options
    const options = loaderUtils.getOptions(this) || {};
    validateOptions(schema, options, "Smart Markdown Loader");
    const publicPath: string = options.publicPath || "";
    const outputPath: string = options.outputPath || "";

    const data = fm(content);

    // Process images
    const mdImgPaths = getImageUrls(data.body);
    const imagePathMap = new Map<string, string>(); // (mdImgPath, publicImgPath)
    for (const mdImgPath of mdImgPaths) {
        const imgResourcePath = path.resolve(this.context, mdImgPath);
        const imgFilename = hashFilename(imgResourcePath);
        this.addDependency(imgResourcePath);
        const outputImgPath = path.join(outputPath, imgFilename);
        const publicImgPath = path.join(publicPath, outputImgPath);
        const imgContent = this.fs.readFileSync(imgResourcePath);

        // Output images
        imagePathMap.set(mdImgPath, publicImgPath);
        this.emitFile(outputImgPath, imgContent, {});
    }

    // Replace markdown image paths with public paths
    const replacedMd = replaceAll(data.body, imagePathMap);

    // Output markdown file
    const mdFilename = hashFilename(this.resourcePath);
    const mdFilepath = path.join(outputPath, mdFilename);
    this.emitFile(mdFilepath, replacedMd, map);

    const result: MarkdownResolveData = {
        meta: data.attributes ?? {},
        url: path.join(publicPath, mdFilepath)
    };

    return `export default ${JSON.stringify(result)}`;
}
