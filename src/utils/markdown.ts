import { createMarkdownProcessor } from "@astrojs/markdown-remark";

let markdownProcessorPromise: ReturnType<typeof createMarkdownProcessor> | null = null;

export async function getMarkdownProcessor() {
    if (!markdownProcessorPromise) {
        markdownProcessorPromise = createMarkdownProcessor();
    }
    return markdownProcessorPromise;
}


