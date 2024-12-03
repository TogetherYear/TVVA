namespace I {
    export interface IHeaderBarOptionItem {
        type: string;
        icon: string;
        label: string;
    }

    export namespace Theme {
        export const enum Style {
            Dark = 'Dark',
            Light = 'Light'
        }
    }
}
export { I };
