import { loader } from "webpack";
import * as path from "path";
import * as crypto from "crypto";
import * as _ from "lodash";

export function regexExecAll(re: RegExp, str: string): RegExpExecArray[] {
    if (!re.global) {
        throw new Error("Regular expression must be global to match all");
    }

    const matches = [];
    let currMatch = null;

    while ((currMatch = re.exec(str)) != null) {
        matches.push(currMatch);
    }

    return matches;
}

export function hashFilename(filename: string): string {
    const ext = path.extname(filename);

    const hasher = crypto.createHash("sha1");
    hasher.update(filename);
    const basename = hasher.digest("hex");

    if (ext === "") {
        return basename;
    } else {
        return `${basename}${ext}`;
    }
}

export function replaceAll(data: string, replacer: Map<string, string>): string {
    const replacerKeys = Array.from(replacer.keys());
    const re = new RegExp(replacerKeys.map(v => _.escapeRegExp(v)).join("|"), "m");
    return data.replace(re, substr => replacer.get(substr) || substr);
}

export type Dict<K extends string, V> = { [P in K]: V };
