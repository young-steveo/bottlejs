export type Decorator<Service> = (service: Service) => Service;

export const reducer = <T>(instance: T, decorator: Decorator<T>): T => decorator(instance)
