export class DataCategoryDetail {
    modelID = '';
    variableIDs: string[] = [];

    /** @ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any) {
        Object.assign(this, obj);
    }
}

export class DataCategory {
    dataCategoryID = '';
    providedBy: DataCategoryDetail[] = [];

    /** @ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any) {
        Object.assign(this, obj);

        if (obj.providedBy && obj.providedBy.length != 0) {
            this.providedBy = obj.providedBy.map((item: unknown) => {
                return new DataCategoryDetail(item);
            });
        }
    }
}
