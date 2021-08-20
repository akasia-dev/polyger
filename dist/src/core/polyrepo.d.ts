export declare const getRepos: (projectPath: string) => Promise<{
    package: Record<string, any>;
    packageList: string[];
    packageFolders: string[];
    packagePath: string;
} | null>;
export declare const getPackages: () => Promise<{
    packageName: string;
    packagePath: string;
    url: string;
}[]>;
export declare const init: () => Promise<void>;
export default init;
