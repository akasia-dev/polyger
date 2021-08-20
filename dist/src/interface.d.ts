export interface ICommand {
    title: string;
    command?: string;
    localFunction?: () => unknown;
}
/**
 * .env.json 인터페이스
 */
export interface IEnv {
    [key: string]: unknown;
    githubToken?: string;
    githubUserName?: string;
}
