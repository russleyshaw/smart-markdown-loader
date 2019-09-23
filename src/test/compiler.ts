import path from "path";
import webpack from "webpack";
import memoryfs from "memory-fs";

export default (fixture: string, options: any): Promise<webpack.Stats> => {
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
                        loader: path.resolve(__dirname, "../../dist/loader.js")
                    }
                }
            ]
        }
    });

    compiler.outputFileSystem = new memoryfs();

    return new Promise<webpack.Stats>((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) reject(err);
            if (stats.hasErrors()) reject(new Error(stats.toJson().errors.toString()));
            resolve(stats);
        });
    });
};
