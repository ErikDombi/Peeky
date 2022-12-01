type Nullable<T> = T | null;

declare namespace JSX {
    interface IntrinsicElements {
        StyleSelector: { rules: string[] };
        StyleBlock: { Title: string, Content: string };
    }
}