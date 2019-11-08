import { regexExecAll } from "./util";

export function getImageUrls(content: string): Set<string> {
    const metaRegex = /\!\[.*\]\((.*)\)/gm;
    const matches = regexExecAll(metaRegex, content);

    const result = new Set<string>();

    for (const match of matches) {
        result.add(match[1]);
    }

    return result;
}
