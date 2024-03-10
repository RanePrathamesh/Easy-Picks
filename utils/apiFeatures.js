import { parseQueryString } from "./generic-util";

export class ApiFeature {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            $or: [
                { brand: { $regex: this.queryStr.keyword, $options: "i" } },
                { title: { $regex: this.queryStr.keyword, $options: "i" } },
                { description: { $regex: this.queryStr.keyword, $options: "i" } }
            ]
        } : {}
        this.query = this.query.find({ ...keyword })
        return this
    }
    searchCategory() {
        const keyword = this.queryStr.keyword ? {
            $or: [
                { categoryName: { $regex: this.queryStr.keyword, $options: "i" } }
            ]
        } : {}
        this.query = this.query.find({ ...keyword })
        return this
    }
    search() {
        const keyword = this.queryStr.keyword ? {
            $or: [
                { brand: { $regex: this.queryStr.keyword, $options: "i" } },
                { title: { $regex: this.queryStr.keyword, $options: "i" } },
                { description: { $regex: this.queryStr.keyword, $options: "i" } }
            ]
        } : {}
        this.query = this.query.find({ ...keyword })
        return this
    }
    filter() {
        let queryCopy = { ...this.queryStr };
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(key => delete queryCopy[key]);
       let queryStr=parseQueryString(queryCopy)
        this.query = this.query.find(queryStr);
        return this;
    }
    pagination(productPerPage) {
        const currentPage = this.queryStr.page;
        const skip = (currentPage - 1) * productPerPage;
        this.query = this.query.limit(productPerPage).skip(skip)
        return this
    }
}
