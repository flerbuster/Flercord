function moveStringByAscii(input: string, amount: number): string {
    const MAX_CHAR_CODE = 65536; // Maximum character code
    let result = '';

    for (let i = 0; i < input.length; i++) {
        let charCode = input.charCodeAt(i); // Get the ASCII value of the character
        charCode = (charCode + amount) % MAX_CHAR_CODE; // Apply the shift and handle overflow
        result += String.fromCharCode(charCode); // Convert ASCII value back to character and append to result
    }

    return result;
}
function chunkString(str: string, size: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < str.length; i += size) {
        chunks.push(str.slice(i, i + size));
    }
    return chunks;
}

function getMovedAmount(original: string, newString: string): number {
    const firstOriginal = original.charCodeAt(0)
    const firstNew = newString.charCodeAt(0)

    return firstNew - firstOriginal
}

export function flercode(input: string): string {
    let output = ""
    const chars = input.split('');
    for (let char of chars) {
        const charcode = char.charCodeAt(0)
        output += moveStringByAscii("fler", charcode)
    }
    return output
}

export function unflercode(input: string): string {
    let output = ""

    const chunks = chunkString(input, 4)

    for (let chunk of chunks) {
        let moved = getMovedAmount("fler", chunk)
        output += String.fromCharCode(moved)
    }

    return output
}
