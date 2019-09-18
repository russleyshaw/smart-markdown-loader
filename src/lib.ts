import { regexExecAll } from "./util";

export function readMetadata(content: string): Record<string, string> {
    let meta: Record<string, string> = {};

    const metaRegex = /^--- (.*): (.*)$/gm;
    const matches = regexExecAll(metaRegex, content);

    for (const match of matches) {
        const key = match[1];
        const value = match[2].trim();

        meta[key] = value;
    }
    return meta;
}

export function stripMetadata(content: string): string {
    const re = /^--- (.*): (.*)$/gm;
    return content.replace(re, "").trimLeft();
}

export function getImageUrls(content: string): Set<string> {
    const metaRegex = /\!\[.*\]\((.*)\)/gm;
    const matches = regexExecAll(metaRegex, content);

    const result = new Set<string>();

    for (const match of matches) {
        result.add(match[1]);
    }

    return result;
}

// export function replaceImageUrls(content: string, replacements: Map<string, string>) {
//     content.replace(/\!\[.*\]\(.*\)/gm, substring => {});
// }
