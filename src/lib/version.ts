// Sistema de versionamiento para OnPoint Admin
export const VERSION = {
  major: 1,      // Cambios importantes/breaking changes
  minor: 1,      // Nuevas features
  patch: 0,      // Bug fixes
  build: '2024.12.19' // Fecha de build
}

export const getVersionString = (): string => {
  return `v${VERSION.major}.${VERSION.minor}.${VERSION.patch}`
}

export const getFullVersionString = (): string => {
  return `${getVersionString()}.${VERSION.build}`
}

export const getVersionInfo = () => {
  return {
    version: getVersionString(),
    fullVersion: getFullVersionString(),
    build: VERSION.build,
    major: VERSION.major,
    minor: VERSION.minor,
    patch: VERSION.patch
  }
}
