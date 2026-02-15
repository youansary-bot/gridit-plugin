// GridGenerator.js - Grid generation logic for Adobe Illustrator

class GridGenerator {
    constructor(document) {
        this.document = document;
        this.presets = {};
        this.loadPresets();
    }

    /**
     * Create a modular grid (columns + rows)
     */
    createModularGrid(options) {
        const {
            pageWidth,
            pageHeight,
            columns,
            rows,
            marginTop = 0,
            marginBottom = 0,
            marginLeft = 0,
            marginRight = 0,
            gutterH = 0,
            gutterV = 0,
            lineColor = [0, 0, 0],
            lineWeight = 0.5,
            asGuides = false,
            asLayer = true
        } = options;

        const gridGroup = asLayer ? this.document.activeArtboard.groups.add() : null;
        if (gridGroup) gridGroup.name = "Grid_Modular";

        const availableWidth = pageWidth - marginLeft - marginRight;
        const availableHeight = pageHeight - marginTop - marginBottom;

        const colWidth = (availableWidth - (gutterH * (columns - 1))) / columns;
        const rowHeight = (availableHeight - (gutterV * (rows - 1))) / rows;

        // Draw vertical lines (columns)
        for (let i = 0; i <= columns; i++) {
            const x = marginLeft + (i * (colWidth + gutterH));
            this.drawLine(
                x, marginTop,
                x, pageHeight - marginBottom,
                lineColor, lineWeight, gridGroup
            );
        }

        // Draw horizontal lines (rows)
        for (let i = 0; i <= rows; i++) {
            const y = marginTop + (i * (rowHeight + gutterV));
            this.drawLine(
                marginLeft, y,
                pageWidth - marginRight, y,
                lineColor, lineWeight, gridGroup
            );
        }

        return {
            type: "modular",
            columns,
            rows,
            colWidth,
            rowHeight,
            gutterH,
            gutterV
        };
    }

    /**
     * Create a baseline grid (for typography)
     */
    createBaselineGrid(options) {
        const {
            pageWidth,
            pageHeight,
            baselineSpacing = 12,
            marginTop = 0,
            marginBottom = 0,
            marginLeft = 0,
            marginRight = 0,
            lineColor = [0, 0, 0],
            lineWeight = 0.5,
            asGuides = false,
            asLayer = true
        } = options;

        const gridGroup = asLayer ? this.document.activeArtboard.groups.add() : null;
        if (gridGroup) gridGroup.name = "Grid_Baseline";

        const numLines = Math.ceil((pageHeight - marginTop - marginBottom) / baselineSpacing);

        // Draw horizontal lines
        for (let i = 0; i <= numLines; i++) {
            const y = marginTop + (i * baselineSpacing);
            if (y <= pageHeight - marginBottom) {
                this.drawLine(
                    marginLeft, y,
                    pageWidth - marginRight, y,
                    lineColor, lineWeight, gridGroup
                );
            }
        }

        return {
            type: "baseline",
            baselineSpacing,
            numLines
        };
    }

    drawLine(x1, y1, x2, y2, color, weight, group) {
        const line = this.document.activeArtboard.pathItems.add();
        line.setEntirePath([[x1, y1], [x2, y2]]);
        
        line.strokeColor = {
            red: color[0],
            green: color[1],
            blue: color[2]
        };
        line.strokeWidth = weight;
        line.filled = false;
        line.stroked = true;

        if (group) {
            group.moveToEnd();
        }

        return line;
    }

    savePreset(name, config) {
        this.presets[name] = config;
        localStorage.setItem('gridPresets', JSON.stringify(this.presets));
    }

    loadPreset(name) {
        return this.presets[name] || null;
    }

    loadPresets() {
        const saved = localStorage.getItem('gridPresets');
        if (saved) {
            this.presets = JSON.parse(saved);
        }
    }

    getAllPresets() {
        return Object.keys(this.presets);
    }

    deletePreset(name) {
        delete this.presets[name];
        localStorage.setItem('gridPresets', JSON.stringify(this.presets));
    }
}