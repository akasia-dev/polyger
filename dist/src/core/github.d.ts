export interface ICloneProps {
    name: string;
    url: string;
    githubUserName: string;
    githubToken: string;
    cwd: string;
    branch: string;
    onMessage: (message: string) => void | Promise<void>;
    onErrorMessage: (errorMessage: string) => void | Promise<void>;
    onError: (error: Error) => void | Promise<void>;
}
export declare const clone: (props: ICloneProps) => Promise<void>;
export declare const pull: (props: {
    cwd: string;
    onMessage: (message: string) => void | Promise<void>;
    onErrorMessage: (errorMessage: string) => void | Promise<void>;
    onError: (error: Error) => void | Promise<void>;
}) => Promise<void>;
