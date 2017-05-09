export class StringUtils {
    public static format(format: string, ...args: any[]) {
        return format.replace(/{(\d+)}/g, (match, number) => {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match;
        });
    }
}