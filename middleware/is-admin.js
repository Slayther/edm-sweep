function isAdmin(req,res,next){
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        next(
            res.redirect('/login')
            // new Error('User does not have permission')
        )
    }
}

module.exports = isAdmin;