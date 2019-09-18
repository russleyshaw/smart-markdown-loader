import { loader } from "webpack";
import * as path from "path";
import * as crypto from "crypto";

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

export async function asyncResolve(self: loader.LoaderContext, context: string, request: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        self.resolve(context, request, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

export async function asyncLoadModule(self: loader.LoaderContext, request: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        self.loadModule(request, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

export async function asyncReadFile(self: loader.LoaderContext, filepath: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        self.fs.readFile(filepath, (err: any, result: any) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

export function hashFilename(filename: string): string {
    const ext = path.extname(filename);

    const hasher = crypto.createHash("sha1");
    hasher.update(filename);
    const basename = hasher.digest().toString("hex");

    if (ext === "") {
        return basename;
    } else {
        return `${basename}${ext}`;
    }
}
