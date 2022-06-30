export default interface Container {
    [key: string]: any;
    $decorator: () => void;
    $register: () => void;
    $list: () => void;
    $name: string | undefined;
}
export declare const newContainer: (name?: string) => {
    $decorator: () => void;
    $register: () => void;
    $list: () => void;
    $name: string | undefined;
};
