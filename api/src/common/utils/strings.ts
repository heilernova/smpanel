/**
 * Formatea un string para que sea un ruta URL valida, retirando acentos y reemplazado los espacios por guiones (-)
 */
export const convertToSlug = (str: string): string => {
    return str.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").trim().replace(/\s+|(\s+-\s+)|(-\s+)|(\s+-)/g, "-");
}

/**
 * Coloca la primera letra de cada palabra en mayúscula
 */
export const capitalize = (str: string): string => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}