export const newContainer = (name) => {
    return {
        $decorator: () => { },
        $register: () => { },
        $list: () => { },
        $name: name
    };
};
