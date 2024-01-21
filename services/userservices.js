const getExpanses = (req,where ) =>{
    return req.user.getExpanses(where);
}


module.exports={
    getExpanses
}