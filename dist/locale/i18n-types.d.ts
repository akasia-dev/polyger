import type { LocalizedString } from 'typesafe-i18n';
export declare type BaseLocale = 'en';
export declare type Locales = 'en' | 'ko';
export declare type Translation = {
    /**
     * Access token is required for GitHub repo clone.
How to get a GitHub Access Token: (URL)
https://git.io/JsPkj
     */
    'messageOfNeedToken': string;
    /**
     *
The project must download the polyrepos in GitHub for execution.
The total number of polyrepos to clone is {count}.

New incoming polyrepo list: {list}
     * @param {number} count
     * @param {string} list
     */
    'messageOfClone': RequiredParams2<'count', 'list'>;
    /**
     * Please enter at least one polyrepo category.
e.g.: frontend, backend, release

Each category folder is created at the top,
and you can add a polyrepo to the sub-path.

You can type multiple folders by separating them with ","

Polyrepo category:

     */
    'messageOfSubFolders': string;
    /**
     * Please enter the GitHub CLI token.
     */
    'pleaseEnterGithubCLIToken': string;
    /**
     * Please enter GitHub user name. (NOT EMAIL)
     */
    'pleaseEnterUsername': string;
    /**
     * Please select the project command you want to use.
If you select a command, it will be executed.

     */
    'selectCommandWantToExecute': string;
    /**
     * Running... "{title}"
     * @param {string} title
     */
    'runningCommand': RequiredParams1<'title'>;
    /**
     * Do you want to clone the project?
     */
    'shallWeClone': string;
    /**
     * Update the entire local repos from the GitHub (pull)
     */
    'commandPull': string;
    /**
     * "{packageName}" Downloading polyrepos...
     * @param {string} packageName
     */
    'downloadingPolyrepos': RequiredParams1<'packageName'>;
};
export declare type TranslationFunctions = {
    /**
     * Access token is required for GitHub repo clone.
How to get a GitHub Access Token: (URL)
https://git.io/JsPkj
     */
    'messageOfNeedToken': () => LocalizedString;
    /**
     *
The project must download the polyrepos in GitHub for execution.
The total number of polyrepos to clone is {count}.

New incoming polyrepo list: {list}
     */
    'messageOfClone': (arg: {
        count: number;
        list: string;
    }) => LocalizedString;
    /**
     * Please enter at least one polyrepo category.
e.g.: frontend, backend, release

Each category folder is created at the top,
and you can add a polyrepo to the sub-path.

You can type multiple folders by separating them with ","

Polyrepo category:

     */
    'messageOfSubFolders': () => LocalizedString;
    /**
     * Please enter the GitHub CLI token.
     */
    'pleaseEnterGithubCLIToken': () => LocalizedString;
    /**
     * Please enter GitHub user name. (NOT EMAIL)
     */
    'pleaseEnterUsername': () => LocalizedString;
    /**
     * Please select the project command you want to use.
If you select a command, it will be executed.

     */
    'selectCommandWantToExecute': () => LocalizedString;
    /**
     * Running... "{title}"
     */
    'runningCommand': (arg: {
        title: string;
    }) => LocalizedString;
    /**
     * Do you want to clone the project?
     */
    'shallWeClone': () => LocalizedString;
    /**
     * Update the entire local repos from the GitHub (pull)
     */
    'commandPull': () => LocalizedString;
    /**
     * "{packageName}" Downloading polyrepos...
     */
    'downloadingPolyrepos': (arg: {
        packageName: string;
    }) => LocalizedString;
};
export declare type Formatters = {};
declare type Param<P extends string> = `{${P}}`;
declare type Params1<P1 extends string> = `${string}${Param<P1>}${string}`;
declare type Params2<P1 extends string, P2 extends string> = `${string}${Param<P1>}${string}${Param<P2>}${string}`;
declare type RequiredParams1<P1 extends string> = Params1<P1>;
declare type RequiredParams2<P1 extends string, P2 extends string> = Params2<P1, P2> | Params2<P2, P1>;
export {};
