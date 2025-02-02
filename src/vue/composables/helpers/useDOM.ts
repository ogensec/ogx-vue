export const parseUrls = function(string: string) {
    const regex = /(?:href=|http(?:s)?:\/\/)(?:www\.)?([^\s"<>]+)/;
    const match = regex.exec(string);
    return match || [];
}

export const parseHrefs = function(string: string) {
    const regex = /href=["']?([^"']+)["']?[^>]*>(.*?)/gi;
    const match = regex.exec(string);
    return match || [];
}

export const cleaner = function(string: string) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = string;
    return tmp.textContent || tmp.innerText || "";
}

export const getHTMLbody = function(string: string) {
    const regex = /<body.*?>([\s\S]*)<\/body>/i;
    const match = regex.exec(string);
    return match || [];
}

export default {
    parseUrls,
    parseHrefs,
    cleaner,
    getHTMLbody,
}