import { regexExecAll, Dict } from "./util";

export function getMetaRegex() {
    return /^(.*): (.*)$/gm;
}

export function getMetaSectionRegex() {
    return /^###### meta start([\s\S]*)###### meta end/;
}

export function getMeta(content: string): Dict<string, string> {
    const metaSection = getMetaSection(content);
    const metas = getMetaDict(metaSection);
    return metas;
}

export function getMetaSection(content: string): string {
    const metaSectionRegex = getMetaSectionRegex();
    const match = metaSectionRegex.exec(content);
    if (match == null) {
        return "";
    }
    return match[1].trim();
}

export function getMetaDict(metaSection: string): Dict<string, string> {
    const meta: Dict<string, string> = {};

    const re = getMetaRegex();
    const matches = regexExecAll(re, metaSection);
    for (const match of matches) {
        const key = match[1];
        const value = match[2].trim();

        meta[key] = value;
    }

    return meta;
}

export function stripMetaSection(content: string): string {
    const re = getMetaSectionRegex();
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
