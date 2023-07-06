class ApiFeatures {
    //here query -> Product.find() & queryStr -> query (whether it can be "page" "keyword")
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    searchProduct() {
        const keyword = this.queryStr.keyword ?
        {
            //This will find the word which have same chars in the particular name irresepective of the case senstiveness
            //For eg -> if search keyword is "samosa" it can also shows the result of "samosaAaA" as samsoa is also present
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } :
        {}

        this.query = this.query.find({...keyword});
        return this;
    }

    //it can filter like this -> price[gte]=1000&price[lte]=2000 or category "mobile" "tv"
    //gt -> greter than, gte -> greter than equal and same as lt, lte
    filterProduct() {
        const queryCopy = { ...this.queryStr };  //here it will generate the new copy string
        
        //Remove some field from category
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);  //here we add $ this sign because mongobd use this sign to know the syntax

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage) {
        const currPage = Number(this.queryStr.page) || 1;  //if page is not mention in query it will take 1

        const skip = resultPerPage * (currPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
}

module.exports = ApiFeatures;