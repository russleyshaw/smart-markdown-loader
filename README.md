# Smart Markdown Loader

-   Extracts front-matter & metadata
-   Resolves images
-   Emits markdown file as a URL

### Loader Options

| Property     | Type     | Required | Description                                     |
| ------------ | -------- | -------- | ----------------------------------------------- |
| `publicPath` | `string` |          | Public path of the root of the site.            |
| `outputPath` | `string` |          | Directory to emit the files in the output path. |

### Emitted Interface

```ts
export interface MarkdownResolveData {
    /**
     * URL to the markdown file.
     */
    url: string;

    /**
     * Meta/Front-matter data from the markdown file.
     */
    meta: Record<string, string>;
}
```
