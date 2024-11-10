//For a simple callback definition
export type Action = () => void;
//Foa a callback with a single parameter
export type Action1<T> = (param: T) => void;