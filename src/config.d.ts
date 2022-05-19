/*  config.ts
  用于对项目进行配置 
 */

export const CONFIG_VERSION = "0.22.05.01"

export declare const mapper: {
  readonly avaiable: Record<StringConstructor, StringConstructor>
} | StringConstructor

export declare type Mapper = typeof mapper;

export declare const getAppFromMapper: {
  readonly apps: Record<StringConstructor, Mapper>
  readonly getAppMode: "mapper"
}

export declare const getAppFromApi: {
  readonly getAppMode: "app" | "label"
}

export declare const config: {
  readonly backendURL: StringConstructor
  readonly starlightURL: StringConstructor
  readonly starlightServers: Array<StringConstructor>
} & (typeof getAppFromMapper | typeof getAppFromApi)


export declare type PlatformConfig = typeof config
