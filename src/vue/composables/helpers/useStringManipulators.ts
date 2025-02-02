export function capitalizeFirstLetter(string: string): string {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeAllFirstLetter(string: string): string {
    if (!string) return "";
    const tokens = string.split(' ');
    let ret = "";
    tokens.forEach((token) => {
        ret = ret + " " + capitalizeFirstLetter(token);
    })
    return ret.trim();
}
