declare module "front-matter" {
    export default function(data: string): { attributes?: { [key: string]: any }; body: string; frontmatter: string };
}
