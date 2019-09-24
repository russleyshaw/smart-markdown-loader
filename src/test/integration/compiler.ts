import path from "path";
import webpack from "webpack";
import memoryfs from "memory-fs";

export const outputFs = new memoryfs();

export default (fixture: string, options: any = {}): Promise<webpack.Stats> => {
    const compiler = webpack({
        context: __dirname,
        entry: `./${fixture}`,
        output: {
            path: path.resolve(__dirname),
            filename: "bundle.js"
        },
        module: {
            rules: [
                {
                    test: /\.md$/,
                    use: {
                        loader: path.resolve(__dirname, "../../../dist/lib/loader.js"),
                        options
                    }
                }
            ]
        }
    });

    compiler.outputFileSystem = outputFs;

    return new Promise<webpack.Stats>((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) return reject(err);
            if (stats.hasErrors()) return reject(new Error(stats.toJson().errors.join(", ")));

            resolve(stats);
        });
    });
};
