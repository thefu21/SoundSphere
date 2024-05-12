export function mixColorWithWhite(color, mixAmount) {
    // Konvertiere die Hexadezimalfarbe in RGB-Komponenten
    var r = parseInt(color.substr(1, 2), 16);
    var g = parseInt(color.substr(3, 2), 16);
    var b = parseInt(color.substr(5, 2), 16);

    // Mische die RGB-Komponenten mit Weiß
    var mixedR = Math.round((1 - mixAmount) * 255 + mixAmount * r);
    var mixedG = Math.round((1 - mixAmount) * 255 + mixAmount * g);
    var mixedB = Math.round((1 - mixAmount) * 255 + mixAmount * b);

    // Konvertiere die gemischten RGB-Werte zurück in eine Hexadezimalfarbe
    var mixedColor = '#' + (mixedR << 16 | mixedG << 8 | mixedB).toString(16).padStart(6, '0');

    return mixedColor;
}

export function mixColors(color1, color2, mixAmount, attribute) {
    // Konvertiere die Hexadezimalfarben in RGB-Komponenten
    var r1 = parseInt(color1.substring(1, 3), 16);
    var g1 = parseInt(color1.substring(3, 5), 16);
    var b1 = parseInt(color1.substring(5, 7), 16);

    var r2 = parseInt(color2.substring(1, 3), 16);
    var g2 = parseInt(color2.substring(3, 5), 16);
    var b2 = parseInt(color2.substring(5, 7), 16);

    // Mische die RGB-Komponenten beider Farben
    var mixedR = Math.round((1 - mixAmount) * r1 + mixAmount * r2);
    var mixedG = Math.round((1 - mixAmount) * g1 + mixAmount * g2);
    var mixedB = Math.round((1 - mixAmount) * b1 + mixAmount * b2);

    // Konvertiere die gemischten RGB-Werte entweder in HSL oder Hexadezimal
    if (attribute === 'hsl') {
        // Konvertiere RGB zu HSL
        var hsl = rgbToHsl(mixedR, mixedG, mixedB);
        return hsl[0] + ' ' + hsl[1] + '% ' + hsl[2] + '%';
    } else {
        // Konvertiere RGB zu Hexadezimal
        return '#' + (mixedR << 16 | mixedG << 8 | mixedB).toString(16).padStart(6, '0');
    }
}

// Hilfsfunktion zum Umwandeln von RGB in HSL
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}