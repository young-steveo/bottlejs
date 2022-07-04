import Container, { DELIMITER, Element, getElement, isContainer } from "./container.js";


export const resolveService = <Service>(container: Container, name: string): Element<Service> => {
    return name.split(DELIMITER)
        .reduce((element: Element<Service>, prop: string) => {
            return isContainer(element) ? getElement<Service>(element, prop) : element
        }, container);
}
