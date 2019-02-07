import {join} from "path";
import urljoin from "url-join"

export default class Utils {
    static getTimestamp():string {
        let currentDate = new Date();

        let h = currentDate.getHours();
        let m = currentDate.getMinutes();
        let s = currentDate.getSeconds();
        let d = currentDate.getDate();
        let M = currentDate.getMonth() + 1;
        let y = currentDate.getFullYear();

        return d + "-" + M + "-" + y + " " + h + "_" + m + "_" + s;
    }
    static concatFilePath(...parts: string[]) {
        return join(...parts);
    }
    static concatUrlPath(...parts: string[]) {
        return urljoin(parts);
    }
}