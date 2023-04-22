import { promises as fs, existsSync, mkdirSync } from "fs"
import { join } from 'path'

import axios from "axios"
import { parse } from 'node-html-parser';

interface Source {
    id: string
    displayName: string

    baseUrl: string
    entrypointUrl: string

    entrypointNavlinkSelector: string
    pageMainContentSelector: string
}

const Source: Record<string, Source> = {
    LANGCHAIN: {
        id: "LANGCHAIN",
        displayName: "Langchain",

        baseUrl: "https://python.langchain.com/en/latest/",
        entrypointUrl: "https://python.langchain.com/en/latest/",

        entrypointNavlinkSelector: "nav#bd-docs-nav a",
        pageMainContentSelector: "article[role='main']",
    },
}
async function getSourceContent(source: Source) {

    const indexPageRes = await axios.get(source.entrypointUrl)

    const indexPage = parse(indexPageRes.data)

    const sidebarLinks = Array.from(indexPage.querySelectorAll(source.entrypointNavlinkSelector))

    const sidebarUrls = sidebarLinks.map(i => i.getAttribute("href"))

    const pages = await Promise.all(sidebarUrls.map(async url => {

        const isExternalPage = url.startsWith("http")

        if (isExternalPage) return {
            url,
            pageContent: null,
        }
        const newUrl = source.baseUrl + url

        const pageRes = await axios.get(newUrl)

        const page = parse(pageRes.data)

        const mainContentContainer = page.querySelector(source.pageMainContentSelector)

        const pageContent = mainContentContainer == null ? page.innerText : mainContentContainer.innerText

        return {
            url,
            pageContent,
        }
    }))
    return {
        source,
        pages,
    }
}
async function scrapeSourceToFile(source: Source) {

    const { pages } = await getSourceContent(Source.LANGCHAIN)

    const jsonPages = JSON.stringify(pages, null, 2)
    const plaintextPages = pages.map(i => i.pageContent).join("\n\n\n")

    const outDir = join(".", `./out/${source.id}/`)

    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

    await fs.writeFile(join(outDir, "pages.json"), jsonPages)
    await fs.writeFile(join(outDir, "pages.txt"), plaintextPages)
}
scrapeSourceToFile(Source.LANGCHAIN)