const WINDOWS_1252_BYTES = new Map([
    ["€", 0x80],
    ["‚", 0x82],
    ["ƒ", 0x83],
    ["„", 0x84],
    ["…", 0x85],
    ["†", 0x86],
    ["‡", 0x87],
    ["ˆ", 0x88],
    ["‰", 0x89],
    ["Š", 0x8a],
    ["‹", 0x8b],
    ["Œ", 0x8c],
    ["Ž", 0x8e],
    ["‘", 0x91],
    ["’", 0x92],
    ["“", 0x93],
    ["”", 0x94],
    ["•", 0x95],
    ["–", 0x96],
    ["—", 0x97],
    ["˜", 0x98],
    ["™", 0x99],
    ["š", 0x9a],
    ["›", 0x9b],
    ["œ", 0x9c],
    ["ž", 0x9e],
    ["Ÿ", 0x9f]
]);

const MOJIBAKE_LEAD_BYTES = new Map([
    ["Â", 0xc2],
    ["Ã", 0xc3],
    ["â", 0xe2]
]);

const utf8Decoder = new TextDecoder("utf-8", { fatal: true });

function resolveByte(character) {
    if (!character)
        return null;

    const mapped = WINDOWS_1252_BYTES.get(character);
    if (mapped != null)
        return mapped;

    const code = character.charCodeAt(0);
    return code <= 0xff ? code : null;
}

function decodeBytes(bytes, fallback) {
    try {
        return utf8Decoder.decode(Uint8Array.from(bytes));
    } catch {
        return fallback;
    }
}

function repairMojibakeOnce(value) {
    if (typeof value !== "string" || !/[ÂÃâ]/.test(value))
        return value;

    let repaired = "";

    for (let index = 0; index < value.length; index += 1) {
        const character = value[index];
        const leadByte = MOJIBAKE_LEAD_BYTES.get(character);

        if (leadByte == null) {
            repaired += character;
            continue;
        }

        const byteCount = character === "â" ? 3 : 2;
        const segment = value.slice(index, index + byteCount);
        const bytes = [leadByte];
        let canDecode = segment.length === byteCount;

        for (let offset = 1; offset < byteCount; offset += 1) {
            const byte = resolveByte(value[index + offset]);
            if (byte == null) {
                canDecode = false;
                break;
            }

            bytes.push(byte);
        }

        if (!canDecode) {
            repaired += character;
            continue;
        }

        repaired += decodeBytes(bytes, segment);
        index += byteCount - 1;
    }

    return repaired;
}

export function repairMojibake(value) {
    let repaired = value;

    for (let attempt = 0; attempt < 3; attempt += 1) {
        const nextValue = repairMojibakeOnce(repaired);
        if (nextValue === repaired)
            return repaired;

        repaired = nextValue;
    }

    return repaired;
}

export function repairTextEncoding(value) {
    if (typeof value === "string")
        return repairMojibake(value);

    if (Array.isArray(value))
        return value.map(repairTextEncoding);

    if (value && typeof value === "object")
        return Object.fromEntries(
            Object.entries(value).map(([key, entryValue]) => [key, repairTextEncoding(entryValue)])
        );

    return value;
}
