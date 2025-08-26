export const joinPipe = (arr: string[]) => arr.filter(Boolean).join("|");
export const splitPipe = (s?: string | null) => s ? s.split("|").filter(Boolean) : [];

export const joinComma = (arr: string[]) => arr.filter(Boolean).join(",");
export const splitComma = (s?: string | null) => s ? s.split(",").map(x => x.trim()).filter(Boolean) : [];