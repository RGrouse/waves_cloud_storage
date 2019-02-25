import {join} from 'path';
import * as url_join from 'url-join';

export default class Utils {
    static getTimestamp(): string {
        let currentDate = new Date();

        let h = currentDate.getHours();
        let m = currentDate.getMinutes();
        let s = currentDate.getSeconds();
        let d = currentDate.getDate();
        let M = currentDate.getMonth() + 1;
        let y = currentDate.getFullYear();

        return d + '-' + M + '-' + y + ' ' + h + '_' + m + '_' + s;
    }
    static formatDate(date: number): string {
        let fdate = new Date(date);

        let h = fdate.getHours();
        let m = fdate.getMinutes();
        let s = fdate.getSeconds();
        let d = fdate.getDate();
        let M = fdate.getMonth() + 1;
        let y = fdate.getFullYear();
        return [d, M, y].join('.') + ' ' + [h, m, s].join(':');
    }
    static concatFilePath(...parts: string[]) {
        return join(...parts);
    }
    static concatUrlPath(...parts: string[]) {
        return url_join(parts);
    }
}
