export function truncateString(str: string | any, length: number) {
    
    if (str.length > length) {
        return str.substring(0, length) + '...';
    }
    return str;
};