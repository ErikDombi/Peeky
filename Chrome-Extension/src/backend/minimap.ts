class Minimap {
    source: string;
    content: string;

    constructor(source: string, content: string) {
        this.source = source;
        this.content = content.replace(/[\{\}]/gi, '')

        let indexes = [];
        let tokens = this.content.split(' ').filter(t => t.length > 0);
        for(let token of tokens) {
            for(let idx of this.getAllIndexes(source, token)) {
                indexes.push(idx);
            }
        }
        console.log(indexes);
        console.log(JSON.stringify(indexes));
    }

    getAllIndexes(arr: any, val: any): any[] {
        let indexes = [], i = -1;
        while ((i = arr.indexOf(val, i + 1)) != -1) {
            indexes.push(i);
        }
        return indexes;
    }
}

export { Minimap }