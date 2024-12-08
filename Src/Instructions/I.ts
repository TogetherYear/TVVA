namespace I {
    export interface IHeaderBarOptionItem {
        type: string;
        icon: string;
        label: string;
    }

    export type LocalStoreKey = {
        Account: string;
        Password: string;
        Token: string;
    };
    export namespace Theme {
        export const enum Style {
            Dark = 'Dark',
            Light = 'Light'
        }
    }
}
export { I };
